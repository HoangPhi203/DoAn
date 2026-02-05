const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { hoTen, soDienThoai, matKhau, vaiTro, diaChi, email } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ soDienThoai });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại đã được đăng ký'
            });
        }

        // Create user
        const user = await User.create({
            hoTen,
            soDienThoai,
            matKhau,
            vaiTro: vaiTro || 'KhachHang',
            diaChi,
            email
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { soDienThoai, matKhau } = req.body;

        // Validate
        if (!soDienThoai || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập số điện thoại và mật khẩu'
            });
        }

        // Check for user
        const user = await User.findOne({ soDienThoai }).select('+matKhau');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Số điện thoại hoặc mật khẩu không đúng'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(matKhau);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Số điện thoại hoặc mật khẩu không đúng'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort('-createdAt');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get technicians
// @route   GET /api/auth/technicians
// @access  Private/Admin,TiepTan
exports.getTechnicians = async (req, res, next) => {
    try {
        const technicians = await User.find({ vaiTro: 'KyThuatVien' });

        res.status(200).json({
            success: true,
            count: technicians.length,
            data: technicians
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Đã xóa người dùng'
        });
    } catch (err) {
        next(err);
    }
};

// Helper - Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            hoTen: user.hoTen,
            soDienThoai: user.soDienThoai,
            vaiTro: user.vaiTro,
            email: user.email
        }
    });
};
