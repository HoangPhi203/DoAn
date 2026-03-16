const BaoGia = require('../models/BaoGia');
const DonHang = require('../models/DonHang');
const LinhKien = require('../models/LinhKien');

// @desc    Tạo báo giá cho đơn hàng
// @route   POST /api/quotes
// @access  Private/KyThuatVien,Admin
exports.createQuote = async (req, res, next) => {
    try {
        const { donHangId, danhSachLinhKien, chiPhiDichVu, thoiGianDuKien, ghiChu } = req.body;

        // Kiểm tra đơn hàng tồn tại
        const donHang = await DonHang.findById(donHangId);
        if (!donHang) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Kiểm tra đơn hàng đã có báo giá chưa
        const existingQuote = await BaoGia.findOne({
            donHang: donHangId,
            trangThai: { $ne: 'TuChoi' }
        });
        if (existingQuote) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng này đã có báo giá đang chờ duyệt hoặc đã được phê duyệt'
            });
        }

        // Validate và lấy thông tin linh kiện từ kho
        const processedParts = [];
        if (danhSachLinhKien && danhSachLinhKien.length > 0) {
            for (const item of danhSachLinhKien) {
                if (item.linhKienId) {
                    const linhKien = await LinhKien.findById(item.linhKienId);
                    if (!linhKien) {
                        return res.status(404).json({
                            success: false,
                            message: `Không tìm thấy linh kiện với ID: ${item.linhKienId}`
                        });
                    }
                    processedParts.push({
                        linhKien: linhKien._id,
                        tenLinhKien: linhKien.tenLinhKien,
                        soLuong: item.soLuong,
                        donGia: item.donGia || linhKien.giaBan
                    });
                } else {
                    // Linh kiện bên ngoài (không có trong kho)
                    processedParts.push({
                        tenLinhKien: item.tenLinhKien,
                        soLuong: item.soLuong,
                        donGia: item.donGia
                    });
                }
            }
        }

        const baoGia = await BaoGia.create({
            donHang: donHangId,
            kyThuatVien: req.user._id,
            danhSachLinhKien: processedParts,
            chiPhiDichVu: chiPhiDichVu || [],
            thoiGianDuKien,
            ghiChu
        });

        // Cập nhật trạng thái đơn hàng sang ChoKhachDuyet
        await DonHang.findByIdAndUpdate(donHangId, { trangThai: 'ChoKhachDuyet' });

        const populated = await BaoGia.findById(baoGia._id)
            .populate('donHang', 'maVanDon modelMay')
            .populate('kyThuatVien', 'hoTen')
            .populate('danhSachLinhKien.linhKien', 'tenLinhKien maSKU');

        res.status(201).json({
            success: true,
            message: `Đã tạo báo giá ${baoGia.maBaoGia}`,
            data: populated
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Lấy danh sách báo giá
// @route   GET /api/quotes
// @access  Private/Admin,TiepTan,KyThuatVien
exports.getQuotes = async (req, res, next) => {
    try {
        const { trangThai, page = 1, limit = 20 } = req.query;

        let query = {};
        if (trangThai) query.trangThai = trangThai;

        // KTV chỉ xem báo giá của mình
        if (req.user.vaiTro === 'KyThuatVien') {
            query.kyThuatVien = req.user._id;
        }

        const quotes = await BaoGia.find(query)
            .populate('donHang', 'maVanDon modelMay trangThai khachHang')
            .populate('kyThuatVien', 'hoTen soDienThoai')
            .populate('nguoiPheDuyet', 'hoTen')
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt');

        // Populate khachHang thông qua donHang
        const populatedQuotes = await BaoGia.populate(quotes, {
            path: 'donHang.khachHang',
            select: 'hoTen soDienThoai email'
        });

        const total = await BaoGia.countDocuments(query);

        res.status(200).json({
            success: true,
            count: quotes.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: populatedQuotes
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Lấy chi tiết báo giá
// @route   GET /api/quotes/:id
// @access  Private
exports.getQuote = async (req, res, next) => {
    try {
        const quote = await BaoGia.findById(req.params.id)
            .populate('donHang', 'maVanDon modelMay tinhTrangLoi trangThai')
            .populate('kyThuatVien', 'hoTen soDienThoai')
            .populate('nguoiPheDuyet', 'hoTen')
            .populate('danhSachLinhKien.linhKien', 'tenLinhKien maSKU giaBan');

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo giá'
            });
        }

        res.status(200).json({
            success: true,
            data: quote
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Lấy báo giá theo đơn hàng
// @route   GET /api/quotes/order/:donHangId
// @access  Private
exports.getQuoteByOrder = async (req, res, next) => {
    try {
        const quote = await BaoGia.findOne({ donHang: req.params.donHangId })
            .populate('kyThuatVien', 'hoTen soDienThoai')
            .populate('danhSachLinhKien.linhKien', 'tenLinhKien maSKU');

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Chưa có báo giá cho đơn hàng này'
            });
        }

        res.status(200).json({
            success: true,
            data: quote
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Phê duyệt báo giá
// @route   PUT /api/quotes/:id/approve
// @access  Private/Admin,TiepTan
exports.approveQuote = async (req, res, next) => {
    try {
        const quote = await BaoGia.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo giá'
            });
        }

        if (quote.trangThai !== 'ChoPheDuyet') {
            return res.status(400).json({
                success: false,
                message: `Báo giá đang ở trạng thái "${quote.trangThai}", không thể phê duyệt`
            });
        }

        quote.trangThai = 'DaPheDuyet';
        quote.nguoiPheDuyet = req.user._id;
        quote.ngayPheDuyet = new Date();
        await quote.save();

        // Cập nhật trạng thái và chi phí ước tính cho đơn hàng
        await DonHang.findByIdAndUpdate(quote.donHang, {
            trangThai: 'DangSua',
            uocTinhChiPhi: quote.tongCong
        });

        res.status(200).json({
            success: true,
            message: 'Đã phê duyệt báo giá',
            data: quote
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Từ chối báo giá
// @route   PUT /api/quotes/:id/reject
// @access  Private/Admin,TiepTan
exports.rejectQuote = async (req, res, next) => {
    try {
        const { lyDoTuChoi } = req.body;

        const quote = await BaoGia.findById(req.params.id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo giá'
            });
        }

        if (quote.trangThai !== 'ChoPheDuyet') {
            return res.status(400).json({
                success: false,
                message: `Báo giá đang ở trạng thái "${quote.trangThai}", không thể từ chối`
            });
        }

        quote.trangThai = 'TuChoi';
        quote.lyDoTuChoi = lyDoTuChoi || 'Không có lý do cụ thể';
        quote.nguoiPheDuyet = req.user._id;
        quote.ngayPheDuyet = new Date();
        await quote.save();

        // Đưa đơn hàng về trạng thái ChoBaoGia để KTV làm báo giá mới
        await DonHang.findByIdAndUpdate(quote.donHang, {
            trangThai: 'ChoBaoGia'
        });

        res.status(200).json({
            success: true,
            message: 'Đã từ chối báo giá',
            data: quote
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Xóa báo giá
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = async (req, res, next) => {
    try {
        const quote = await BaoGia.findByIdAndDelete(req.params.id);

        if (!quote) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy báo giá'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa báo giá'
        });
    } catch (err) {
        next(err);
    }
};
