const mongoose = require('mongoose');

const HoaDonSchema = new mongoose.Schema({
    maHoaDon: {
        type: String,
        unique: true
    },
    donHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DonHang',
        required: [true, 'Hóa đơn phải liên kết với đơn hàng']
    },
    khachHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tongTienLinhKien: {
        type: Number,
        default: 0
    },
    tongCongTho: {
        type: Number,
        default: 0
    },
    giamGia: {
        type: Number,
        default: 0
    },
    tongTien: {
        type: Number,
        required: [true, 'Vui lòng nhập tổng tiền']
    },
    trangThaiThanhToan: {
        type: String,
        enum: ['ChuaThanhToan', 'DaThanhToan', 'ThanhToanMotPhan'],
        default: 'ChuaThanhToan'
    },
    phuongThucThanhToan: {
        type: String,
        enum: ['TienMat', 'ChuyenKhoan', 'TheNganHang'],
        default: 'TienMat'
    },
    ngayThanhToan: {
        type: Date
    },
    ghiChu: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Auto generate maHoaDon before save
HoaDonSchema.pre('save', async function (next) {
    if (!this.maHoaDon) {
        const count = await mongoose.model('HoaDon').countDocuments();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        this.maHoaDon = `HD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('HoaDon', HoaDonSchema);
