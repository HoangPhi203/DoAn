const mongoose = require('mongoose');

const ThongBaoSchema = new mongoose.Schema({
    tieuDe: {
        type: String,
        required: [true, 'Vui lòng thêm tiêu đề thông báo']
    },
    noiDung: {
        type: String,
        required: [true, 'Vui lòng thêm nội dung thông báo']
    },
    loai: {
        type: String,
        enum: ['LichHen', 'DonHang', 'BaoGia', 'HeThong'],
        default: 'HeThong'
    },
    nguoiNhan: {
        type: String,
        enum: ['Admin', 'TiepTan', 'KyThuatVien', 'TatCa'],
        default: 'TatCa'
    },
    daDoc: {
        type: Boolean,
        default: false
    },
    duLieuLienQuan: {
        type: mongoose.Schema.Types.ObjectId,
        // Could be LichHen ID or DonHang ID
        refPath: 'loaiThamChieu'
    },
    loaiThamChieu: {
        type: String,
        enum: ['LichHen', 'DonHang']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ThongBao', ThongBaoSchema);
