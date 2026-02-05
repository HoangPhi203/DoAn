const mongoose = require('mongoose');

const LichHenSchema = new mongoose.Schema({
    khachHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    hoTenKhach: {
        type: String,
        required: [true, 'Vui lòng nhập họ tên']
    },
    soDienThoai: {
        type: String,
        required: [true, 'Vui lòng nhập số điện thoại'],
        match: [/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ']
    },
    ngayGioHen: {
        type: Date,
        required: [true, 'Vui lòng chọn ngày giờ hẹn']
    },
    noiDungHongHoc: {
        type: String,
        required: [true, 'Vui lòng mô tả tình trạng hỏng hóc']
    },
    modelMay: {
        type: String,
        trim: true
    },
    trangThaiXacNhan: {
        type: String,
        enum: ['ChoXacNhan', 'DaXacNhan', 'DaHuy', 'DaHoanThanh'],
        default: 'ChoXacNhan'
    },
    ghiChu: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for querying appointments by time slot
LichHenSchema.index({ ngayGioHen: 1, trangThaiXacNhan: 1 });

module.exports = mongoose.model('LichHen', LichHenSchema);
