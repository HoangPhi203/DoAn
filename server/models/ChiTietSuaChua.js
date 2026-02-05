const mongoose = require('mongoose');

const ChiTietSuaChuaSchema = new mongoose.Schema({
    donHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DonHang',
        required: [true, 'Chi tiết phải thuộc về một đơn hàng']
    },
    danhSachLinhKien: [{
        linhKien: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LinhKien',
            required: true
        },
        tenLinhKien: {
            type: String
        },
        soLuong: {
            type: Number,
            required: true,
            min: [1, 'Số lượng phải ít nhất là 1']
        },
        donGia: {
            type: Number,
            required: true
        },
        thanhTien: {
            type: Number
        }
    }],
    congTho: {
        type: Number,
        default: 0
    },
    ghiChuKyThuat: {
        type: String,
        trim: true
    },
    chanDoan: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Calculate thanhTien before save
ChiTietSuaChuaSchema.pre('save', function (next) {
    this.danhSachLinhKien.forEach(item => {
        item.thanhTien = item.soLuong * item.donGia;
    });
    next();
});

module.exports = mongoose.model('ChiTietSuaChua', ChiTietSuaChuaSchema);
