const mongoose = require('mongoose');

const DonHangSchema = new mongoose.Schema({
    maVanDon: {
        type: String,
        unique: true
    },
    modelMay: {
        type: String,
        required: [true, 'Vui lòng nhập model máy']
    },
    serialIMEI: {
        type: String,
        trim: true
    },
    tinhTrangLoi: {
        type: String,
        required: [true, 'Vui lòng mô tả tình trạng lỗi']
    },
    phuKienKem: [{
        type: String
    }],
    trangThai: {
        type: String,
        enum: ['ChoBaoGia', 'ChoKhachDuyet', 'DangSua', 'ChoLinhKien', 'HoanThanh', 'DaTraKhach'],
        default: 'ChoBaoGia'
    },
    khachHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Đơn hàng phải có khách hàng']
    },
    kyThuatVien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ngayNhan: {
        type: Date,
        default: Date.now
    },
    ngayHenTra: {
        type: Date
    },
    ngayTraThucTe: {
        type: Date
    },
    ghiChu: {
        type: String
    },
    uocTinhChiPhi: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Auto generate maVanDon before save
DonHangSchema.pre('save', async function (next) {
    if (!this.maVanDon) {
        const count = await mongoose.model('DonHang').countDocuments();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        this.maVanDon = `VD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('DonHang', DonHangSchema);
