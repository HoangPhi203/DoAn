const BaoHanh = require('../models/BaoHanh');
const DonHang = require('../models/DonHang');

// @desc    Tạo bảo hành cho đơn hàng đã hoàn thành
// @route   POST /api/warranty
// @access  Private/Admin,TiepTan
exports.createWarranty = async (req, res, next) => {
    try {
        const { donHangId, thoiGianBatDau, thoiGianKetThuc, dieuKienBaoHanh, ghiChu } = req.body;

        // Kiểm tra đơn hàng tồn tại
        const donHang = await DonHang.findById(donHangId);
        if (!donHang) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Kiểm tra đơn hàng đã có bảo hành chưa
        const existingWarranty = await BaoHanh.findOne({ donHang: donHangId });
        if (existingWarranty) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng này đã có phiếu bảo hành'
            });
        }

        // Validate thời gian
        const startDate = new Date(thoiGianBatDau || Date.now());
        const endDate = new Date(thoiGianKetThuc);

        if (endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: 'Thời gian kết thúc phải sau thời gian bắt đầu'
            });
        }

        const baoHanh = await BaoHanh.create({
            donHang: donHangId,
            khachHang: donHang.khachHang,
            thoiGianBatDau: startDate,
            thoiGianKetThuc: endDate,
            dieuKienBaoHanh,
            ghiChu
        });

        const populated = await BaoHanh.findById(baoHanh._id)
            .populate('donHang', 'maVanDon modelMay')
            .populate('khachHang', 'hoTen soDienThoai');

        res.status(201).json({
            success: true,
            message: `Đã tạo phiếu bảo hành ${baoHanh.maBaoHanh}`,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Lấy danh sách bảo hành
// @route   GET /api/warranty
// @access  Private/Admin,TiepTan
exports.getWarranties = async (req, res, next) => {
    try {
        const { trangThai, khachHang, page = 1, limit = 20 } = req.query;

        let query = {};
        if (trangThai) query.trangThai = trangThai;
        if (khachHang) query.khachHang = khachHang;

        const warranties = await BaoHanh.find(query)
            .populate('donHang', 'maVanDon modelMay trangThai')
            .populate('khachHang', 'hoTen soDienThoai email')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt');

        const total = await BaoHanh.countDocuments(query);

        res.status(200).json({
            success: true,
            count: warranties.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: warranties
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Lấy chi tiết bảo hành
// @route   GET /api/warranty/:id
// @access  Private
exports.getWarranty = async (req, res, next) => {
    try {
        const warranty = await BaoHanh.findById(req.params.id)
            .populate('donHang', 'maVanDon modelMay tinhTrangLoi trangThai ngayNhan')
            .populate('khachHang', 'hoTen soDienThoai email diaChi')
            .populate('lichSuBaoHanh.nguoiXuLy', 'hoTen');

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu bảo hành'
            });
        }

        res.status(200).json({
            success: true,
            data: warranty
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Kiểm tra tính hợp lệ bảo hành theo mã đơn hàng
// @route   GET /api/warranty/check/:donHangId
// @access  Private
exports.checkWarrantyValidity = async (req, res, next) => {
    try {
        const warranty = await BaoHanh.findOne({ donHang: req.params.donHangId })
            .populate('donHang', 'maVanDon modelMay')
            .populate('khachHang', 'hoTen soDienThoai');

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bảo hành cho đơn hàng này'
            });
        }

        // Tự động cập nhật trạng thái nếu hết hạn
        if (warranty.trangThai === 'ConHan' && !warranty.conHieuLuc) {
            warranty.trangThai = 'HetHan';
            await warranty.save();
        }

        res.status(200).json({
            success: true,
            data: {
                maBaoHanh: warranty.maBaoHanh,
                conHieuLuc: warranty.conHieuLuc,
                soNgayConLai: warranty.soNgayConLai,
                trangThai: warranty.trangThai,
                thoiGianBatDau: warranty.thoiGianBatDau,
                thoiGianKetThuc: warranty.thoiGianKetThuc,
                donHang: warranty.donHang,
                khachHang: warranty.khachHang
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Thêm lịch sử bảo hành
// @route   POST /api/warranty/:id/history
// @access  Private/Admin,TiepTan,KyThuatVien
exports.addWarrantyHistory = async (req, res, next) => {
    try {
        const { moTa, trangThai, chiPhi } = req.body;

        const warranty = await BaoHanh.findById(req.params.id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu bảo hành'
            });
        }

        // Kiểm tra bảo hành còn hạn
        if (!warranty.conHieuLuc) {
            return res.status(400).json({
                success: false,
                message: 'Phiếu bảo hành đã hết hạn hoặc đã bị hủy'
            });
        }

        warranty.lichSuBaoHanh.push({
            moTa,
            nguoiXuLy: req.user._id,
            trangThai: trangThai || 'TiepNhan',
            chiPhi: chiPhi || 0
        });

        // Cập nhật trạng thái bảo hành
        if (trangThai === 'DangXuLy') {
            warranty.trangThai = 'DangBaoHanh';
        }

        await warranty.save();

        const populated = await BaoHanh.findById(warranty._id)
            .populate('lichSuBaoHanh.nguoiXuLy', 'hoTen');

        res.status(200).json({
            success: true,
            message: 'Đã thêm lịch sử bảo hành',
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cập nhật bảo hành
// @route   PUT /api/warranty/:id
// @access  Private/Admin
exports.updateWarranty = async (req, res, next) => {
    try {
        const { thoiGianKetThuc, dieuKienBaoHanh, ghiChu, trangThai } = req.body;

        const warranty = await BaoHanh.findById(req.params.id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu bảo hành'
            });
        }

        if (thoiGianKetThuc) warranty.thoiGianKetThuc = new Date(thoiGianKetThuc);
        if (dieuKienBaoHanh) warranty.dieuKienBaoHanh = dieuKienBaoHanh;
        if (ghiChu !== undefined) warranty.ghiChu = ghiChu;
        if (trangThai) warranty.trangThai = trangThai;

        await warranty.save();

        res.status(200).json({
            success: true,
            message: 'Đã cập nhật phiếu bảo hành',
            data: warranty
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Xóa bảo hành
// @route   DELETE /api/warranty/:id
// @access  Private/Admin
exports.deleteWarranty = async (req, res, next) => {
    try {
        const warranty = await BaoHanh.findByIdAndDelete(req.params.id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy phiếu bảo hành'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa phiếu bảo hành'
        });
    } catch (err) {
        next(err);
    }
};
