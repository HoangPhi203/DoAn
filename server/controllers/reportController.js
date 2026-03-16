const DonHang = require('../models/DonHang');
const HoaDon = require('../models/HoaDon');
const LinhKien = require('../models/LinhKien');
const User = require('../models/User');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// @desc    Thống kê doanh thu theo tháng
// @route   GET /api/reports/revenue
// @access  Private/Admin
exports.getRevenueReport = async (req, res, next) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        const yearNum = parseInt(year);

        const revenue = await HoaDon.aggregate([
            {
                $match: {
                    trangThaiThanhToan: 'DaThanhToan',
                    ngayThanhToan: {
                        $gte: new Date(`${yearNum}-01-01`),
                        $lt: new Date(`${yearNum + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$ngayThanhToan' },
                    tongDoanhThu: { $sum: '$tongTien' },
                    tongLinhKien: { $sum: '$tongTienLinhKien' },
                    tongCongTho: { $sum: '$tongCongTho' },
                    soHoaDon: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Tạo mảng 12 tháng đầy đủ
        const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const found = revenue.find(r => r._id === i + 1);
            return {
                thang: i + 1,
                tongDoanhThu: found ? found.tongDoanhThu : 0,
                tongLinhKien: found ? found.tongLinhKien : 0,
                tongCongTho: found ? found.tongCongTho : 0,
                soHoaDon: found ? found.soHoaDon : 0
            };
        });

        const tongNam = revenue.reduce((sum, r) => sum + r.tongDoanhThu, 0);

        res.status(200).json({
            success: true,
            data: {
                nam: yearNum,
                tongDoanhThuNam: tongNam,
                chiTietThang: monthlyData
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Thống kê hiệu suất kỹ thuật viên
// @route   GET /api/reports/technician-performance
// @access  Private/Admin
exports.getTechnicianPerformance = async (req, res, next) => {
    try {
        const { year = new Date().getFullYear(), month } = req.query;
        const yearNum = parseInt(year);

        let dateMatch = {
            createdAt: {
                $gte: new Date(`${yearNum}-01-01`),
                $lt: new Date(`${yearNum + 1}-01-01`)
            }
        };

        if (month) {
            const monthNum = parseInt(month);
            dateMatch.createdAt = {
                $gte: new Date(`${yearNum}-${String(monthNum).padStart(2, '0')}-01`),
                $lt: new Date(monthNum === 12 ? `${yearNum + 1}-01-01` : `${yearNum}-${String(monthNum + 1).padStart(2, '0')}-01`)
            };
        }

        const performance = await DonHang.aggregate([
            {
                $match: {
                    kyThuatVien: { $exists: true, $ne: null },
                    ...dateMatch
                }
            },
            {
                $group: {
                    _id: '$kyThuatVien',
                    tongDon: { $sum: 1 },
                    donHoanThanh: {
                        $sum: {
                            $cond: [{ $in: ['$trangThai', ['HoanThanh', 'DaTraKhach']] }, 1, 0]
                        }
                    },
                    donDangSua: {
                        $sum: { $cond: [{ $eq: ['$trangThai', 'DangSua'] }, 1, 0] }
                    },
                    donChoLinhKien: {
                        $sum: { $cond: [{ $eq: ['$trangThai', 'ChoLinhKien'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'kyThuatVien'
                }
            },
            {
                $unwind: '$kyThuatVien'
            },
            {
                $project: {
                    _id: 1,
                    hoTen: '$kyThuatVien.hoTen',
                    soDienThoai: '$kyThuatVien.soDienThoai',
                    tongDon: 1,
                    donHoanThanh: 1,
                    donDangSua: 1,
                    donChoLinhKien: 1,
                    tyLeHoanThanh: {
                        $cond: [
                            { $gt: ['$tongDon', 0] },
                            { $multiply: [{ $divide: ['$donHoanThanh', '$tongDon'] }, 100] },
                            0
                        ]
                    }
                }
            },
            {
                $sort: { donHoanThanh: -1 }
            }
        ]);

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Thống kê trạng thái đơn hàng
// @route   GET /api/reports/order-status
// @access  Private/Admin
exports.getOrderStatusSummary = async (req, res, next) => {
    try {
        const statusSummary = await DonHang.aggregate([
            {
                $group: {
                    _id: '$trangThai',
                    soLuong: { $sum: 1 }
                }
            },
            {
                $sort: { soLuong: -1 }
            }
        ]);

        const statusLabels = {
            'ChoBaoGia': 'Chờ báo giá',
            'ChoKhachDuyet': 'Chờ khách duyệt',
            'DangSua': 'Đang sửa',
            'ChoLinhKien': 'Chờ linh kiện',
            'HoanThanh': 'Hoàn thành',
            'DaTraKhach': 'Đã trả khách'
        };

        const result = statusSummary.map(item => ({
            trangThai: item._id,
            nhanMac: statusLabels[item._id] || item._id,
            soLuong: item.soLuong
        }));

        const tongDon = result.reduce((sum, item) => sum + item.soLuong, 0);

        res.status(200).json({
            success: true,
            data: {
                tongDon,
                chiTiet: result
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Cảnh báo linh kiện tồn kho thấp
// @route   GET /api/reports/low-stock
// @access  Private/Admin
exports.getLowStockAlert = async (req, res, next) => {
    try {
        const lowStock = await LinhKien.aggregate([
            {
                $match: {
                    $expr: { $lte: ['$soLuongTon', '$tonToiThieu'] }
                }
            },
            {
                $project: {
                    maSKU: 1,
                    tenLinhKien: 1,
                    danhMuc: 1,
                    soLuongTon: 1,
                    tonToiThieu: 1,
                    giaNhap: 1,
                    nhaCungCap: 1,
                    mucCanhBao: {
                        $cond: [
                            { $eq: ['$soLuongTon', 0] },
                            'HetHang',
                            'SapHet'
                        ]
                    }
                }
            },
            {
                $sort: { soLuongTon: 1 }
            }
        ]);

        res.status(200).json({
            success: true,
            count: lowStock.length,
            data: lowStock
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Xuất báo cáo doanh thu Excel
// @route   GET /api/reports/export/excel
// @access  Private/Admin
exports.exportReportExcel = async (req, res, next) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        const yearNum = parseInt(year);

        // Lấy dữ liệu doanh thu
        const revenue = await HoaDon.aggregate([
            {
                $match: {
                    trangThaiThanhToan: 'DaThanhToan',
                    ngayThanhToan: {
                        $gte: new Date(`${yearNum}-01-01`),
                        $lt: new Date(`${yearNum + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$ngayThanhToan' },
                    tongDoanhThu: { $sum: '$tongTien' },
                    tongLinhKien: { $sum: '$tongTienLinhKien' },
                    tongCongTho: { $sum: '$tongCongTho' },
                    soHoaDon: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'LaptopCare System';
        workbook.created = new Date();

        // Sheet 1: Doanh thu theo tháng
        const sheet = workbook.addWorksheet('Doanh thu theo tháng');

        // Header
        sheet.mergeCells('A1:E1');
        sheet.getCell('A1').value = `BÁO CÁO DOANH THU NĂM ${yearNum}`;
        sheet.getCell('A1').font = { size: 16, bold: true };
        sheet.getCell('A1').alignment = { horizontal: 'center' };

        sheet.addRow([]);
        sheet.addRow(['Tháng', 'Số hóa đơn', 'Linh kiện (VNĐ)', 'Công thợ (VNĐ)', 'Tổng doanh thu (VNĐ)']);
        sheet.getRow(3).font = { bold: true };
        sheet.getRow(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4472C4' } };
        sheet.getRow(3).font = { bold: true, color: { argb: 'FFFFFFFF' } };

        const thangLabels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

        for (let i = 0; i < 12; i++) {
            const found = revenue.find(r => r._id === i + 1);
            sheet.addRow([
                thangLabels[i],
                found ? found.soHoaDon : 0,
                found ? found.tongLinhKien : 0,
                found ? found.tongCongTho : 0,
                found ? found.tongDoanhThu : 0
            ]);
        }

        // Tổng cộng
        const totalRow = sheet.addRow([
            'TỔNG CỘNG',
            revenue.reduce((s, r) => s + r.soHoaDon, 0),
            revenue.reduce((s, r) => s + r.tongLinhKien, 0),
            revenue.reduce((s, r) => s + r.tongCongTho, 0),
            revenue.reduce((s, r) => s + r.tongDoanhThu, 0)
        ]);
        totalRow.font = { bold: true };

        // Set column widths
        sheet.columns.forEach((col, i) => {
            col.width = [15, 15, 20, 20, 25][i];
        });

        // Format number columns
        for (let row = 4; row <= 16; row++) {
            for (let col = 3; col <= 5; col++) {
                const cell = sheet.getCell(row, col);
                cell.numFmt = '#,##0';
            }
        }

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=BaoCaoDoanhThu_${yearNum}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        next(err);
    }
};

// @desc    Xuất báo cáo PDF
// @route   GET /api/reports/export/pdf
// @access  Private/Admin
exports.exportReportPDF = async (req, res, next) => {
    try {
        const { year = new Date().getFullYear() } = req.query;
        const yearNum = parseInt(year);

        // Lấy dữ liệu
        const revenue = await HoaDon.aggregate([
            {
                $match: {
                    trangThaiThanhToan: 'DaThanhToan',
                    ngayThanhToan: {
                        $gte: new Date(`${yearNum}-01-01`),
                        $lt: new Date(`${yearNum + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$ngayThanhToan' },
                    tongDoanhThu: { $sum: '$tongTien' },
                    soHoaDon: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const orderStatus = await DonHang.aggregate([
            {
                $group: {
                    _id: '$trangThai',
                    soLuong: { $sum: 1 }
                }
            }
        ]);

        const doc = new PDFDocument({ margin: 50 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=BaoCao_${yearNum}.pdf`);

        doc.pipe(res);

        // Title
        doc.fontSize(20).text(`BAO CAO TONG HOP NAM ${yearNum}`, { align: 'center' });
        doc.fontSize(10).text(`Ngay xuat: ${new Date().toLocaleDateString('vi-VN')}`, { align: 'center' });
        doc.moveDown(2);

        // Revenue section
        doc.fontSize(14).text('I. DOANH THU THEO THANG');
        doc.moveDown();

        const thangLabels = ['Thang 1', 'Thang 2', 'Thang 3', 'Thang 4', 'Thang 5', 'Thang 6',
            'Thang 7', 'Thang 8', 'Thang 9', 'Thang 10', 'Thang 11', 'Thang 12'];

        doc.fontSize(10);
        for (let i = 0; i < 12; i++) {
            const found = revenue.find(r => r._id === i + 1);
            const amount = found ? found.tongDoanhThu.toLocaleString('vi-VN') : '0';
            const count = found ? found.soHoaDon : 0;
            doc.text(`  ${thangLabels[i]}: ${amount} VND (${count} hoa don)`);
        }

        const tongNam = revenue.reduce((sum, r) => sum + r.tongDoanhThu, 0);
        doc.moveDown();
        doc.fontSize(12).text(`Tong doanh thu nam: ${tongNam.toLocaleString('vi-VN')} VND`, { underline: true });

        doc.moveDown(2);

        // Order status section
        doc.fontSize(14).text('II. TRANG THAI DON HANG');
        doc.moveDown();

        const statusLabels = {
            'ChoBaoGia': 'Cho bao gia',
            'ChoKhachDuyet': 'Cho khach duyet',
            'DangSua': 'Dang sua',
            'ChoLinhKien': 'Cho linh kien',
            'HoanThanh': 'Hoan thanh',
            'DaTraKhach': 'Da tra khach'
        };

        doc.fontSize(10);
        orderStatus.forEach(item => {
            const label = statusLabels[item._id] || item._id;
            doc.text(`  ${label}: ${item.soLuong} don`);
        });

        doc.end();
    } catch (err) {
        next(err);
    }
};
