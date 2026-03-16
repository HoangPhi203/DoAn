const mongoose = require('mongoose');

const BaoHanhSchema = new mongoose.Schema({
    maBaoHanh: {
        type: String,
        unique: true
    },
    donHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DonHang',
        required: [true, 'Bảo hành phải liên kết với đơn hàng']
    },
    khachHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Bảo hành phải có thông tin khách hàng']
    },
    thoiGianBatDau: {
        type: Date,
        required: [true, 'Vui lòng nhập thời gian bắt đầu bảo hành'],
        default: Date.now
    },
    thoiGianKetThuc: {
        type: Date,
        required: [true, 'Vui lòng nhập thời gian kết thúc bảo hành']
    },
    trangThai: {
        type: String,
        enum: ['ConHan', 'HetHan', 'DangBaoHanh', 'HuyBaoHanh'],
        default: 'ConHan'
    },
    dieuKienBaoHanh: {
        type: String,
        trim: true
    },
    ghiChu: {
        type: String,
        trim: true
    },
    lichSuBaoHanh: [{
        ngay: {
            type: Date,
            default: Date.now
        },
        moTa: {
            type: String,
            required: [true, 'Vui lòng mô tả nội dung bảo hành']
        },
        nguoiXuLy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        trangThai: {
            type: String,
            enum: ['TiepNhan', 'DangXuLy', 'HoanThanh'],
            default: 'TiepNhan'
        },
        chiPhi: {
            type: Number,
            default: 0
        }
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual: Kiểm tra tự động tính hợp lệ của bảo hành
BaoHanhSchema.virtual('conHieuLuc').get(function () {
    if (this.trangThai === 'HuyBaoHanh') return false;
    return new Date() <= this.thoiGianKetThuc;
});

// Virtual: Số ngày bảo hành còn lại
BaoHanhSchema.virtual('soNgayConLai').get(function () {
    if (this.trangThai === 'HuyBaoHanh') return 0;
    const diff = this.thoiGianKetThuc - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
});

// Auto generate maBaoHanh before save
BaoHanhSchema.pre('save', async function (next) {
    if (!this.maBaoHanh) {
        const count = await mongoose.model('BaoHanh').countDocuments();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        this.maBaoHanh = `BH-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }

    // Tự động cập nhật trạng thái theo thời hạn
    if (this.trangThai !== 'HuyBaoHanh' && this.trangThai !== 'DangBaoHanh') {
        this.trangThai = new Date() <= this.thoiGianKetThuc ? 'ConHan' : 'HetHan';
    }

    next();
});

// Index
BaoHanhSchema.index({ donHang: 1 });
BaoHanhSchema.index({ khachHang: 1 });
BaoHanhSchema.index({ trangThai: 1, thoiGianKetThuc: 1 });

module.exports = mongoose.model('BaoHanh', BaoHanhSchema);
