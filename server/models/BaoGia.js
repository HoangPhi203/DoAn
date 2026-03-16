const mongoose = require('mongoose');

const BaoGiaSchema = new mongoose.Schema({
    maBaoGia: {
        type: String,
        unique: true
    },
    donHang: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DonHang',
        required: [true, 'Báo giá phải liên kết với đơn hàng']
    },
    kyThuatVien: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Báo giá phải có kỹ thuật viên tạo']
    },
    danhSachLinhKien: [{
        linhKien: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LinhKien'
        },
        tenLinhKien: {
            type: String,
            required: [true, 'Vui lòng nhập tên linh kiện']
        },
        soLuong: {
            type: Number,
            required: [true, 'Vui lòng nhập số lượng'],
            min: [1, 'Số lượng phải ít nhất là 1']
        },
        donGia: {
            type: Number,
            required: [true, 'Vui lòng nhập đơn giá'],
            min: [0, 'Đơn giá không thể âm']
        },
        thanhTien: {
            type: Number
        }
    }],
    chiPhiDichVu: [{
        tenDichVu: {
            type: String,
            required: [true, 'Vui lòng nhập tên dịch vụ']
        },
        chiPhi: {
            type: Number,
            required: [true, 'Vui lòng nhập chi phí'],
            min: [0, 'Chi phí không thể âm']
        }
    }],
    tongChiPhiLinhKien: {
        type: Number,
        default: 0
    },
    tongChiPhiDichVu: {
        type: Number,
        default: 0
    },
    tongCong: {
        type: Number,
        default: 0
    },
    thoiGianDuKien: {
        type: Number, // Số ngày dự kiến
        min: [1, 'Thời gian dự kiến ít nhất 1 ngày']
    },
    trangThai: {
        type: String,
        enum: ['ChoPheDuyet', 'DaPheDuyet', 'TuChoi'],
        default: 'ChoPheDuyet'
    },
    lyDoTuChoi: {
        type: String,
        trim: true
    },
    nguoiPheDuyet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ngayPheDuyet: {
        type: Date
    },
    ghiChu: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Tính toán thành tiền và tổng trước khi lưu
BaoGiaSchema.pre('save', async function (next) {
    // Auto generate maBaoGia
    if (!this.maBaoGia) {
        const count = await mongoose.model('BaoGia').countDocuments();
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
        this.maBaoGia = `BG-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }

    // Tính thành tiền cho từng linh kiện
    this.danhSachLinhKien.forEach(item => {
        item.thanhTien = item.soLuong * item.donGia;
    });

    // Tính tổng chi phí linh kiện
    this.tongChiPhiLinhKien = this.danhSachLinhKien.reduce(
        (sum, item) => sum + (item.thanhTien || 0), 0
    );

    // Tính tổng chi phí dịch vụ
    this.tongChiPhiDichVu = this.chiPhiDichVu.reduce(
        (sum, item) => sum + (item.chiPhi || 0), 0
    );

    // Tính tổng cộng
    this.tongCong = this.tongChiPhiLinhKien + this.tongChiPhiDichVu;

    next();
});

// Index
BaoGiaSchema.index({ donHang: 1 });
BaoGiaSchema.index({ trangThai: 1 });
BaoGiaSchema.index({ kyThuatVien: 1 });

module.exports = mongoose.model('BaoGia', BaoGiaSchema);
