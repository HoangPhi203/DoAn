const mongoose = require('mongoose');

const LinhKienSchema = new mongoose.Schema({
    maSKU: {
        type: String,
        unique: true
    },
    tenLinhKien: {
        type: String,
        required: [true, 'Vui lòng nhập tên linh kiện'],
        trim: true
    },
    moTa: {
        type: String,
        trim: true
    },
    danhMuc: {
        type: String,
        trim: true
    },
    soLuongTon: {
        type: Number,
        default: 0,
        min: [0, 'Số lượng không thể âm']
    },
    giaNhap: {
        type: Number,
        required: [true, 'Vui lòng nhập giá nhập'],
        min: [0, 'Giá nhập không thể âm']
    },
    giaBan: {
        type: Number,
        required: [true, 'Vui lòng nhập giá bán'],
        min: [0, 'Giá bán không thể âm']
    },
    tonToiThieu: {
        type: Number,
        default: 5,
        min: [0, 'Tồn tối thiểu không thể âm']
    },
    nhaCungCap: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Auto generate maSKU before save
LinhKienSchema.pre('save', async function (next) {
    if (!this.maSKU) {
        const count = await mongoose.model('LinhKien').countDocuments();
        this.maSKU = `LK-${String(count + 1).padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('LinhKien', LinhKienSchema);
