const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    hoTen: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên'],
        trim: true
    },
    soDienThoai: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        unique: true,
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    matKhau: {
        type: String,
        required: [true, 'Vui lòng nhập mật khẩu'],
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
        select: false
    },
    vaiTro: {
        type: String,
        enum: ['Admin', 'TiepTan', 'KyThuatVien', 'KhachHang'],
        default: 'KhachHang'
    },
    diaChi: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('matKhau')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.matKhau = await bcrypt.hash(this.matKhau, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign(
        { id: this._id, vaiTro: this.vaiTro },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Match password
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.matKhau);
};

module.exports = mongoose.model('User', UserSchema);
