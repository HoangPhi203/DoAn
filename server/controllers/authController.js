const User = require('../models/User');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


// @desc    Register customer
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { hoTen, soDienThoai, matKhau, email, diaChi } = req.body;

        // Validate required fields
        if (!hoTen || !soDienThoai || !matKhau) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập họ tên, số điện thoại và mật khẩu'
            });
        }

        // Check if phone number already exists
        const existingUser = await User.findOne({ soDienThoai });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại đã được đăng ký'
            });
        }

        // Create user with KhachHang role
        const user = await User.create({
            hoTen,
            soDienThoai,
            matKhau,
            email: email || undefined,
            diaChi: diaChi || undefined,
            vaiTro: 'KhachHang'
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        // Handle mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }
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

// @desc    Update current user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            hoTen: req.body.hoTen,
            soDienThoai: req.body.soDienThoai,
            email: req.body.email,
            diaChi: req.body.diaChi
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]);

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        // Handle mongoose validation errors
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join('. ')
            });
        }
        // Handle unique phone number collision
        if (err.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Số điện thoại này đã được sử dụng'
            });
        }
        next(err);
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp mật khẩu cũ và mới'
            });
        }

        const user = await User.findById(req.user.id).select('+matKhau');

        // Check current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        user.matKhau = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
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

// Helper - Tạo Nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// @desc    Gửi mã OTP qua email
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res, next) => {
    try {
        const { email, soDienThoai } = req.body;

        if (!email && !soDienThoai) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng cung cấp email hoặc số điện thoại'
            });
        }

        // Tìm user
        let query = {};
        if (email) query.email = email;
        if (soDienThoai) query.soDienThoai = soDienThoai;

        const user = await User.findOne(query).select('+otp +otpExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản với thông tin này'
            });
        }

        if (!user.email) {
            return res.status(400).json({
                success: false,
                message: 'Tài khoản chưa có email. Vui lòng liên hệ quản trị viên.'
            });
        }

        // Tạo OTP 6 chữ số
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 phút

        // Hash OTP trước khi lưu
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        user.otp = hashedOtp;
        user.otpExpires = otpExpires;
        user.otpVerified = false;
        await user.save({ validateBeforeSave: false });

        // Gửi email
        try {
            const transporter = createTransporter();

            await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"LaptopCare" <noreply@laptopcare.vn>',
                to: user.email,
                subject: 'Mã xác thực OTP - LaptopCare',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #7c3aed; text-align: center;">LaptopCare</h2>
                        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center;">
                            <p style="color: #374151; margin-bottom: 16px;">Mã xác thực OTP của bạn là:</p>
                            <div style="font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 8px; margin: 16px 0;">
                                ${otp}
                            </div>
                            <p style="color: #6b7280; font-size: 14px;">Mã có hiệu lực trong 10 phút.</p>
                            <p style="color: #6b7280; font-size: 14px;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                        </div>
                    </div>
                `
            });

            res.status(200).json({
                success: true,
                message: `Đã gửi mã OTP đến email ${user.email.replace(/(.{2})(.*)(@.*)/, '$1***$3')}`
            });
        } catch (emailErr) {
            // Nếu gửi email thất bại, xóa OTP
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Không thể gửi email. Vui lòng thử lại sau.'
            });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Xác thực OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, soDienThoai, otp } = req.body;

        if (!otp) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập mã OTP'
            });
        }

        // Tìm user
        let query = {};
        if (email) query.email = email;
        if (soDienThoai) query.soDienThoai = soDienThoai;

        const user = await User.findOne(query).select('+otp +otpExpires');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tài khoản'
            });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({
                success: false,
                message: 'Chưa có mã OTP nào được gửi. Vui lòng yêu cầu gửi OTP trước.'
            });
        }

        // Kiểm tra hết hạn
        if (Date.now() > user.otpExpires) {
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(400).json({
                success: false,
                message: 'Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.'
            });
        }

        // So sánh OTP (hash)
        const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

        if (hashedOtp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: 'Mã OTP không đúng'
            });
        }

        // OTP hợp lệ
        user.otp = undefined;
        user.otpExpires = undefined;
        user.otpVerified = true;
        await user.save({ validateBeforeSave: false });

        // Trả về token đăng nhập
        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};
