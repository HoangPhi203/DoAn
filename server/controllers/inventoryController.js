const LinhKien = require('../models/LinhKien');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private/Admin,TiepTan
exports.getInventory = async (req, res, next) => {
    try {
        const { search, danhMuc, page = 1, limit = 20 } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { tenLinhKien: { $regex: search, $options: 'i' } },
                { maSKU: { $regex: search, $options: 'i' } }
            ];
        }

        if (danhMuc) {
            query.danhMuc = danhMuc;
        }

        const items = await LinhKien.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .sort('-createdAt');

        const total = await LinhKien.countDocuments(query);

        res.status(200).json({
            success: true,
            count: items.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            data: items
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryItem = async (req, res, next) => {
    try {
        const item = await LinhKien.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy linh kiện'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private/Admin
exports.createInventoryItem = async (req, res, next) => {
    try {
        const item = await LinhKien.create(req.body);

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
exports.updateInventoryItem = async (req, res, next) => {
    try {
        const item = await LinhKien.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy linh kiện'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
exports.deleteInventoryItem = async (req, res, next) => {
    try {
        const item = await LinhKien.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy linh kiện'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa linh kiện'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private/Admin,TiepTan
exports.getLowStock = async (req, res, next) => {
    try {
        const items = await LinhKien.find({
            $expr: { $lte: ['$soLuongTon', '$tonToiThieu'] }
        }).sort('soLuongTon');

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Import inventory (add stock)
// @route   PUT /api/inventory/:id/import
// @access  Private/Admin
exports.importStock = async (req, res, next) => {
    try {
        const { soLuong, giaNhap, ghiChu } = req.body;

        if (!soLuong || soLuong <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số lượng nhập kho phải lớn hơn 0'
            });
        }

        const item = await LinhKien.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy linh kiện'
            });
        }

        item.soLuongTon += parseInt(soLuong);
        if (giaNhap) {
            item.giaNhap = giaNhap;
        }
        await item.save();

        res.status(200).json({
            success: true,
            message: `Đã nhập ${soLuong} ${item.tenLinhKien} vào kho`,
            data: item
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Export inventory (reduce stock)
// @route   PUT /api/inventory/:id/export
// @access  Private/Admin,KyThuatVien
exports.exportStock = async (req, res, next) => {
    try {
        const { soLuong, ghiChu } = req.body;

        if (!soLuong || soLuong <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Số lượng xuất kho phải lớn hơn 0'
            });
        }

        const item = await LinhKien.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy linh kiện'
            });
        }

        if (item.soLuongTon < soLuong) {
            return res.status(400).json({
                success: false,
                message: `Không đủ số lượng trong kho. Hiện còn: ${item.soLuongTon}`
            });
        }

        item.soLuongTon -= parseInt(soLuong);
        await item.save();

        res.status(200).json({
            success: true,
            message: `Đã xuất ${soLuong} ${item.tenLinhKien} khỏi kho`,
            data: item
        });
    } catch (err) {
        next(err);
    }
};
