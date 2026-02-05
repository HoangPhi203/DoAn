const DonHang = require('../models/DonHang');
const ChiTietSuaChua = require('../models/ChiTietSuaChua');
const LinhKien = require('../models/LinhKien');
const User = require('../models/User');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin,TiepTan,KyThuatVien
exports.getOrders = async (req, res, next) => {
    try {
        const { trangThai, kyThuatVien, page = 1, limit = 20 } = req.query;

        let query = {};

        if (trangThai) {
            query.trangThai = trangThai;
        }

        if (kyThuatVien) {
            query.kyThuatVien = kyThuatVien;
        }

        // If user is a technician, only show their assigned orders
        if (req.user.vaiTro === 'KyThuatVien') {
            query.kyThuatVien = req.user._id;
        }

        const orders = await DonHang.find(query)
            .populate('khachHang', 'hoTen soDienThoai email')
            .populate('kyThuatVien', 'hoTen soDienThoai')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt');

        const total = await DonHang.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
    try {
        const order = await DonHang.findById(req.params.id)
            .populate('khachHang', 'hoTen soDienThoai email diaChi')
            .populate('kyThuatVien', 'hoTen soDienThoai');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Get repair details if exists
        const chiTiet = await ChiTietSuaChua.findOne({ donHang: order._id })
            .populate('danhSachLinhKien.linhKien', 'tenLinhKien maSKU giaBan');

        res.status(200).json({
            success: true,
            data: {
                ...order.toObject(),
                chiTietSuaChua: chiTiet
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private/TiepTan,Admin
exports.createOrder = async (req, res, next) => {
    try {
        const { khachHang, modelMay, serialIMEI, tinhTrangLoi, phuKienKem, ghiChu, ngayHenTra } = req.body;

        // Check if customer exists or create new one
        let customer;
        if (khachHang.id) {
            customer = await User.findById(khachHang.id);
        } else if (khachHang.soDienThoai) {
            customer = await User.findOne({ soDienThoai: khachHang.soDienThoai });

            if (!customer) {
                // Create new customer
                customer = await User.create({
                    hoTen: khachHang.hoTen,
                    soDienThoai: khachHang.soDienThoai,
                    matKhau: khachHang.soDienThoai, // Default password is phone number
                    vaiTro: 'KhachHang',
                    diaChi: khachHang.diaChi,
                    email: khachHang.email
                });
            }
        }

        if (!customer) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp thông tin khách hàng'
            });
        }

        const order = await DonHang.create({
            khachHang: customer._id,
            modelMay,
            serialIMEI,
            tinhTrangLoi,
            phuKienKem,
            ghiChu,
            ngayHenTra,
            trangThai: 'ChoBaoGia'
        });

        const populatedOrder = await DonHang.findById(order._id)
            .populate('khachHang', 'hoTen soDienThoai email');

        res.status(201).json({
            success: true,
            message: `Đã tạo đơn hàng ${order.maVanDon}`,
            data: populatedOrder
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Assign technician to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Admin,TiepTan
exports.assignTechnician = async (req, res, next) => {
    try {
        const { kyThuatVienId } = req.body;

        const technician = await User.findById(kyThuatVienId);
        if (!technician || technician.vaiTro !== 'KyThuatVien') {
            return res.status(400).json({
                success: false,
                message: 'Kỹ thuật viên không hợp lệ'
            });
        }

        const order = await DonHang.findByIdAndUpdate(
            req.params.id,
            {
                kyThuatVien: kyThuatVienId,
                trangThai: 'DangSua'
            },
            { new: true }
        ).populate('kyThuatVien', 'hoTen soDienThoai');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã phân công ${technician.hoTen} cho đơn hàng ${order.maVanDon}`,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/KyThuatVien,Admin
exports.updateStatus = async (req, res, next) => {
    try {
        const { trangThai, ghiChu, uocTinhChiPhi } = req.body;

        const validStatuses = ['ChoBaoGia', 'ChoKhachDuyet', 'DangSua', 'ChoLinhKien', 'HoanThanh', 'DaTraKhach'];
        if (!validStatuses.includes(trangThai)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ'
            });
        }

        const updateData = { trangThai };
        if (ghiChu) updateData.ghiChu = ghiChu;
        if (uocTinhChiPhi) updateData.uocTinhChiPhi = uocTinhChiPhi;
        if (trangThai === 'DaTraKhach') updateData.ngayTraThucTe = new Date();

        const order = await DonHang.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        ).populate('khachHang', 'hoTen soDienThoai');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            message: `Đã cập nhật trạng thái đơn hàng thành "${trangThai}"`,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Add parts to order (deduct from inventory)
// @route   POST /api/orders/:id/parts
// @access  Private/KyThuatVien
exports.addParts = async (req, res, next) => {
    try {
        const { linhKienList, congTho, ghiChuKyThuat, chanDoan } = req.body;

        const order = await DonHang.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Validate and deduct inventory
        const processedParts = [];
        for (const item of linhKienList) {
            const linhKien = await LinhKien.findById(item.linhKienId);

            if (!linhKien) {
                return res.status(404).json({
                    success: false,
                    message: `Không tìm thấy linh kiện với ID: ${item.linhKienId}`
                });
            }

            if (linhKien.soLuongTon < item.soLuong) {
                return res.status(400).json({
                    success: false,
                    message: `Linh kiện "${linhKien.tenLinhKien}" không đủ số lượng. Hiện còn: ${linhKien.soLuongTon}`
                });
            }

            // Deduct from inventory
            linhKien.soLuongTon -= item.soLuong;
            await linhKien.save();

            processedParts.push({
                linhKien: linhKien._id,
                tenLinhKien: linhKien.tenLinhKien,
                soLuong: item.soLuong,
                donGia: linhKien.giaBan,
                thanhTien: item.soLuong * linhKien.giaBan
            });
        }

        // Create or update repair details
        let chiTiet = await ChiTietSuaChua.findOne({ donHang: order._id });

        if (chiTiet) {
            chiTiet.danhSachLinhKien.push(...processedParts);
            if (congTho) chiTiet.congTho = congTho;
            if (ghiChuKyThuat) chiTiet.ghiChuKyThuat = ghiChuKyThuat;
            if (chanDoan) chiTiet.chanDoan = chanDoan;
            await chiTiet.save();
        } else {
            chiTiet = await ChiTietSuaChua.create({
                donHang: order._id,
                danhSachLinhKien: processedParts,
                congTho: congTho || 0,
                ghiChuKyThuat,
                chanDoan
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã thêm linh kiện vào đơn hàng và cập nhật tồn kho',
            data: chiTiet
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Track order by phone (public)
// @route   GET /api/orders/track/:phone
// @access  Public
exports.trackOrder = async (req, res, next) => {
    try {
        const { phone } = req.params;

        const customer = await User.findOne({ soDienThoai: phone });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng với số điện thoại này'
            });
        }

        const orders = await DonHang.find({ khachHang: customer._id })
            .select('maVanDon modelMay trangThai ngayNhan ngayHenTra uocTinhChiPhi')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin,TiepTan
exports.updateOrder = async (req, res, next) => {
    try {
        const order = await DonHang.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('khachHang kyThuatVien');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
    try {
        const order = await DonHang.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Also delete repair details
        await ChiTietSuaChua.deleteMany({ donHang: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Đã xóa đơn hàng'
        });
    } catch (err) {
        next(err);
    }
};
