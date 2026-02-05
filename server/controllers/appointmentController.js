const LichHen = require('../models/LichHen');
const User = require('../models/User');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private/Admin,TiepTan
exports.getAppointments = async (req, res, next) => {
    try {
        const { trangThaiXacNhan, ngay, page = 1, limit = 20 } = req.query;

        let query = {};

        if (trangThaiXacNhan) {
            query.trangThaiXacNhan = trangThaiXacNhan;
        }

        if (ngay) {
            const startOfDay = new Date(ngay);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(ngay);
            endOfDay.setHours(23, 59, 59, 999);
            query.ngayGioHen = { $gte: startOfDay, $lte: endOfDay };
        }

        const appointments = await LichHen.find(query)
            .populate('khachHang', 'hoTen soDienThoai')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('ngayGioHen');

        const total = await LichHen.countDocuments(query);

        res.status(200).json({
            success: true,
            count: appointments.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: appointments
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
    try {
        const appointment = await LichHen.findById(req.params.id)
            .populate('khachHang', 'hoTen soDienThoai email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch hẹn'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Public
exports.createAppointment = async (req, res, next) => {
    try {
        const { hoTenKhach, soDienThoai, ngayGioHen, noiDungHongHoc, modelMay, ghiChu } = req.body;

        // Check time slot availability (max 3 appointments per hour)
        const appointmentDate = new Date(ngayGioHen);
        const startOfHour = new Date(appointmentDate);
        startOfHour.setMinutes(0, 0, 0);
        const endOfHour = new Date(appointmentDate);
        endOfHour.setMinutes(59, 59, 999);

        const existingCount = await LichHen.countDocuments({
            ngayGioHen: { $gte: startOfHour, $lte: endOfHour },
            trangThaiXacNhan: { $ne: 'DaHuy' }
        });

        if (existingCount >= 3) {
            return res.status(400).json({
                success: false,
                message: 'Khung giờ này đã đầy (tối đa 3 lịch hẹn/giờ). Vui lòng chọn khung giờ khác.'
            });
        }

        // Check if customer exists
        let customer = await User.findOne({ soDienThoai });

        const appointment = await LichHen.create({
            khachHang: customer ? customer._id : null,
            hoTenKhach,
            soDienThoai,
            ngayGioHen,
            noiDungHongHoc,
            modelMay,
            ghiChu,
            trangThaiXacNhan: 'ChoXacNhan'
        });

        res.status(201).json({
            success: true,
            message: 'Đã đặt lịch hẹn thành công. Chúng tôi sẽ liên hệ xác nhận.',
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Admin,TiepTan
exports.updateAppointment = async (req, res, next) => {
    try {
        const { trangThaiXacNhan, ngayGioHen, ghiChu } = req.body;

        const updateData = {};
        if (trangThaiXacNhan) updateData.trangThaiXacNhan = trangThaiXacNhan;
        if (ngayGioHen) updateData.ngayGioHen = ngayGioHen;
        if (ghiChu) updateData.ghiChu = ghiChu;

        const appointment = await LichHen.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch hẹn'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã cập nhật lịch hẹn`,
            data: appointment
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private/Admin
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await LichHen.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch hẹn'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa lịch hẹn'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Check available slots
// @route   GET /api/appointments/available-slots
// @access  Public
exports.getAvailableSlots = async (req, res, next) => {
    try {
        const { ngay } = req.query;

        if (!ngay) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp ngày để kiểm tra'
            });
        }

        const date = new Date(ngay);
        const slots = [];

        // Business hours: 8:00 - 17:00
        for (let hour = 8; hour <= 17; hour++) {
            const startOfHour = new Date(date);
            startOfHour.setHours(hour, 0, 0, 0);
            const endOfHour = new Date(date);
            endOfHour.setHours(hour, 59, 59, 999);

            const count = await LichHen.countDocuments({
                ngayGioHen: { $gte: startOfHour, $lte: endOfHour },
                trangThaiXacNhan: { $ne: 'DaHuy' }
            });

            slots.push({
                hour: `${hour}:00`,
                available: count < 3,
                currentCount: count,
                maxCount: 3
            });
        }

        res.status(200).json({
            success: true,
            date: ngay,
            data: slots
        });
    } catch (err) {
        next(err);
    }
};
