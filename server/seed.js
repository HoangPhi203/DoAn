/**
 * Seed Script - Tạo dữ liệu mẫu cho hệ thống quản lý cửa hàng sửa chữa Laptop
 * 
 * Chạy: node seed.js
 * 
 * Dữ liệu tạo:
 * - 1 Admin, 2 Tiếp tân, 5 Kỹ thuật viên, 50 Khách hàng
 * - 50 Linh kiện (RAM, SSD, Màn hình, Pin, Bàn phím)
 * - 100 Đơn hàng (20 ChoBaoGia, 30 DangSua, 30 HoanThanh, 20 DaTraKhach)
 * - 25 Lịch hẹn (5 lịch trùng giờ để test)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker/locale/vi');

// Import Models
const User = require('./models/User');
const LinhKien = require('./models/LinhKien');
const DonHang = require('./models/DonHang');
const ChiTietSuaChua = require('./models/ChiTietSuaChua');
const HoaDon = require('./models/HoaDon');
const LichHen = require('./models/LichHen');

// Constants
const DEFAULT_PASSWORD = '123456';

// Vietnamese phone number prefixes
const VN_PHONE_PREFIXES = ['090', '091', '092', '093', '094', '095', '096', '097', '098', '099',
    '032', '033', '034', '035', '036', '037', '038', '039',
    '070', '076', '077', '078', '079', '081', '082', '083', '084', '085', '086', '088', '089'];

// Linh kien categories with realistic data
const LINH_KIEN_DATA = [
    // RAM
    {
        danhMuc: 'RAM', items: [
            { ten: 'RAM DDR4 4GB 2666MHz', giaNhap: 250000, moTa: 'RAM laptop DDR4 4GB bus 2666' },
            { ten: 'RAM DDR4 8GB 2666MHz', giaNhap: 450000, moTa: 'RAM laptop DDR4 8GB bus 2666' },
            { ten: 'RAM DDR4 8GB 3200MHz', giaNhap: 550000, moTa: 'RAM laptop DDR4 8GB bus 3200' },
            { ten: 'RAM DDR4 16GB 2666MHz', giaNhap: 850000, moTa: 'RAM laptop DDR4 16GB bus 2666' },
            { ten: 'RAM DDR4 16GB 3200MHz', giaNhap: 950000, moTa: 'RAM laptop DDR4 16GB bus 3200' },
            { ten: 'RAM DDR5 8GB 4800MHz', giaNhap: 750000, moTa: 'RAM laptop DDR5 8GB bus 4800' },
            { ten: 'RAM DDR5 16GB 4800MHz', giaNhap: 1250000, moTa: 'RAM laptop DDR5 16GB bus 4800' },
            { ten: 'RAM DDR5 32GB 4800MHz', giaNhap: 2200000, moTa: 'RAM laptop DDR5 32GB bus 4800' },
        ]
    },
    // SSD
    {
        danhMuc: 'Ổ cứng SSD', items: [
            { ten: 'SSD SATA 120GB', giaNhap: 350000, moTa: 'SSD SATA 2.5 inch 120GB' },
            { ten: 'SSD SATA 240GB', giaNhap: 550000, moTa: 'SSD SATA 2.5 inch 240GB' },
            { ten: 'SSD SATA 480GB', giaNhap: 850000, moTa: 'SSD SATA 2.5 inch 480GB' },
            { ten: 'SSD SATA 1TB', giaNhap: 1500000, moTa: 'SSD SATA 2.5 inch 1TB' },
            { ten: 'SSD NVMe 128GB', giaNhap: 400000, moTa: 'SSD M.2 NVMe 128GB' },
            { ten: 'SSD NVMe 256GB', giaNhap: 650000, moTa: 'SSD M.2 NVMe 256GB' },
            { ten: 'SSD NVMe 512GB', giaNhap: 1100000, moTa: 'SSD M.2 NVMe 512GB' },
            { ten: 'SSD NVMe 1TB', giaNhap: 2000000, moTa: 'SSD M.2 NVMe 1TB' },
        ]
    },
    // Màn hình
    {
        danhMuc: 'Màn hình', items: [
            { ten: 'Màn hình 14" FHD IPS', giaNhap: 1800000, moTa: 'Màn hình laptop 14 inch Full HD IPS' },
            { ten: 'Màn hình 15.6" FHD IPS', giaNhap: 1900000, moTa: 'Màn hình laptop 15.6 inch Full HD IPS' },
            { ten: 'Màn hình 14" FHD IPS 144Hz', giaNhap: 2500000, moTa: 'Màn hình laptop 14 inch Full HD 144Hz' },
            { ten: 'Màn hình 15.6" FHD 144Hz', giaNhap: 2800000, moTa: 'Màn hình laptop 15.6 inch Full HD 144Hz' },
            { ten: 'Màn hình 14" 2K IPS', giaNhap: 3200000, moTa: 'Màn hình laptop 14 inch 2K IPS' },
            { ten: 'Màn hình 15.6" 2K IPS', giaNhap: 3500000, moTa: 'Màn hình laptop 15.6 inch 2K IPS' },
            { ten: 'Màn hình 13.3" FHD OLED', giaNhap: 4500000, moTa: 'Màn hình laptop 13.3 inch OLED' },
            { ten: 'Màn hình 16" 4K OLED', giaNhap: 6500000, moTa: 'Màn hình laptop 16 inch 4K OLED' },
        ]
    },
    // Pin
    {
        danhMuc: 'Pin', items: [
            { ten: 'Pin Dell 3 cell 42Wh', giaNhap: 750000, moTa: 'Pin laptop Dell 3 cell 42Wh' },
            { ten: 'Pin Dell 4 cell 56Wh', giaNhap: 950000, moTa: 'Pin laptop Dell 4 cell 56Wh' },
            { ten: 'Pin HP 3 cell 45Wh', giaNhap: 700000, moTa: 'Pin laptop HP 3 cell 45Wh' },
            { ten: 'Pin HP 4 cell 52Wh', giaNhap: 900000, moTa: 'Pin laptop HP 4 cell 52Wh' },
            { ten: 'Pin Lenovo 3 cell 45Wh', giaNhap: 720000, moTa: 'Pin laptop Lenovo 3 cell 45Wh' },
            { ten: 'Pin Lenovo 4 cell 57Wh', giaNhap: 920000, moTa: 'Pin laptop Lenovo 4 cell 57Wh' },
            { ten: 'Pin Asus 3 cell 42Wh', giaNhap: 680000, moTa: 'Pin laptop Asus 3 cell 42Wh' },
            { ten: 'Pin Asus 4 cell 56Wh', giaNhap: 880000, moTa: 'Pin laptop Asus 4 cell 56Wh' },
            { ten: 'Pin MacBook Pro 13" 58Wh', giaNhap: 1800000, moTa: 'Pin MacBook Pro 13 inch 58Wh' },
            { ten: 'Pin MacBook Pro 16" 100Wh', giaNhap: 2500000, moTa: 'Pin MacBook Pro 16 inch 100Wh' },
        ]
    },
    // Bàn phím
    {
        danhMuc: 'Bàn phím', items: [
            { ten: 'Bàn phím Dell Latitude', giaNhap: 350000, moTa: 'Bàn phím laptop Dell Latitude series' },
            { ten: 'Bàn phím Dell Inspiron', giaNhap: 320000, moTa: 'Bàn phím laptop Dell Inspiron series' },
            { ten: 'Bàn phím HP EliteBook', giaNhap: 380000, moTa: 'Bàn phím laptop HP EliteBook' },
            { ten: 'Bàn phím HP ProBook', giaNhap: 340000, moTa: 'Bàn phím laptop HP ProBook' },
            { ten: 'Bàn phím Lenovo ThinkPad', giaNhap: 400000, moTa: 'Bàn phím laptop Lenovo ThinkPad' },
            { ten: 'Bàn phím Lenovo IdeaPad', giaNhap: 300000, moTa: 'Bàn phím laptop Lenovo IdeaPad' },
            { ten: 'Bàn phím Asus VivoBook', giaNhap: 320000, moTa: 'Bàn phím laptop Asus VivoBook' },
            { ten: 'Bàn phím Asus ZenBook', giaNhap: 450000, moTa: 'Bàn phím laptop Asus ZenBook' },
            { ten: 'Bàn phím Asus ROG', giaNhap: 550000, moTa: 'Bàn phím laptop Asus ROG Gaming' },
            { ten: 'Bàn phím MacBook Air', giaNhap: 1500000, moTa: 'Bàn phím MacBook Air' },
            { ten: 'Bàn phím MacBook Pro', giaNhap: 1800000, moTa: 'Bàn phím MacBook Pro' },
        ]
    },
    // Linh kiện khác
    {
        danhMuc: 'Linh kiện khác', items: [
            { ten: 'Quạt tản nhiệt CPU', giaNhap: 180000, moTa: 'Quạt tản nhiệt CPU laptop' },
            { ten: 'Loa laptop', giaNhap: 200000, moTa: 'Bộ loa laptop' },
            { ten: 'Webcam laptop', giaNhap: 250000, moTa: 'Webcam tích hợp laptop' },
            { ten: 'Jack sạc DC', giaNhap: 80000, moTa: 'Jack nguồn DC laptop' },
            { ten: 'Cổng USB', giaNhap: 120000, moTa: 'Board cổng USB laptop' },
        ]
    }
];

// Laptop models for realistic order data
const LAPTOP_MODELS = [
    'Dell Latitude 5520', 'Dell Inspiron 15 3520', 'Dell XPS 13', 'Dell XPS 15',
    'HP EliteBook 840 G8', 'HP ProBook 450 G9', 'HP Pavilion 15', 'HP Envy x360',
    'Lenovo ThinkPad T14', 'Lenovo ThinkPad X1 Carbon', 'Lenovo IdeaPad Gaming 3', 'Lenovo Legion 5',
    'Asus VivoBook 15', 'Asus ZenBook 14', 'Asus ROG Strix G15', 'Asus TUF Gaming',
    'MacBook Air M1', 'MacBook Air M2', 'MacBook Pro 14" M2', 'MacBook Pro 16" M2',
    'Acer Nitro 5', 'Acer Aspire 5', 'MSI GF63 Thin', 'MSI Prestige 14'
];

// Common laptop issues
const LAPTOP_ISSUES = [
    'Laptop không lên nguồn',
    'Màn hình bị sọc, chớp nháy',
    'Bàn phím liệt một số phím',
    'Pin không sạc được, chai pin',
    'Quạt kêu to, máy nóng bất thường',
    'Loa không có âm thanh',
    'Webcam không hoạt động',
    'Màn hình bị vỡ, nứt',
    'Ổ cứng chậm, hay bị treo',
    'Máy chạy chậm, giật lag',
    'Không nhận USB, cổng hư',
    'Màn hình tối, không hiển thị',
    'Mainboard có vấn đề',
    'RAM lỗi, máy tự tắt',
    'Cần nâng cấp SSD, RAM'
];

// Technical notes
const TECHNICAL_NOTES = [
    'Kiểm tra nguồn, thay IC nguồn',
    'Thay cáp màn hình, test màn mới',
    'Thay bàn phím nguyên bộ',
    'Thay pin mới, test dung lượng',
    'Vệ sinh quạt, thay keo tản nhiệt',
    'Thay loa, kiểm tra board âm thanh',
    'Thay webcam module',
    'Thay màn hình mới theo yêu cầu',
    'Nâng cấp SSD, clone dữ liệu',
    'Cài đặt lại Windows, driver',
    'Thay cổng USB, hàn lại chân',
    'Thay đèn nền màn hình',
    'Sửa mainboard, thay IC',
    'Thay RAM mới, test stress',
    'Thêm SSD NVMe, thêm RAM'
];

// Accessories
const ACCESSORIES = ['Sạc laptop', 'Túi đựng', 'Chuột', 'Không'];

// ============ HELPER FUNCTIONS ============

/**
 * Generate Vietnamese phone number
 */
function generateVNPhone() {
    const prefix = VN_PHONE_PREFIXES[Math.floor(Math.random() * VN_PHONE_PREFIXES.length)];
    const suffix = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
    return prefix + suffix;
}

/**
 * Generate random date within range
 */
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Get random items from array
 */
function getRandomItems(arr, min = 1, max = 3) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

/**
 * Get random item from array
 */
function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Hash password with bcrypt
 */
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

// ============ CLEAN DATA ============

async function cleanData() {
    console.log('\n🗑️  Đang xóa dữ liệu cũ...');

    // Delete in reverse order of dependencies
    await HoaDon.deleteMany({});
    console.log('   ✓ Đã xóa HoaDon');

    await ChiTietSuaChua.deleteMany({});
    console.log('   ✓ Đã xóa ChiTietSuaChua');

    await DonHang.deleteMany({});
    console.log('   ✓ Đã xóa DonHang');

    await LichHen.deleteMany({});
    console.log('   ✓ Đã xóa LichHen');

    await LinhKien.deleteMany({});
    console.log('   ✓ Đã xóa LinhKien');

    await User.deleteMany({});
    console.log('   ✓ Đã xóa User');

    console.log('✅ Xóa dữ liệu cũ hoàn tất!\n');
}

// ============ SEED USERS ============

async function seedUsers() {
    console.log('👥 Đang tạo Users...');

    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    const users = [];

    // 1. Admin - Fixed account
    users.push({
        hoTen: 'Administrator',
        soDienThoai: '0901234567',
        email: 'admin@store.com',
        matKhau: hashedPassword,
        vaiTro: 'Admin',
        diaChi: 'Số 1, Đường Nguyễn Huệ, Q.1, TP.HCM'
    });

    // 2. Tiep Tan - 2 accounts
    for (let i = 1; i <= 2; i++) {
        users.push({
            hoTen: faker.person.fullName(),
            soDienThoai: generateVNPhone(),
            email: `tieptan0${i}@store.com`,
            matKhau: hashedPassword,
            vaiTro: 'TiepTan',
            diaChi: faker.location.streetAddress() + ', ' + faker.location.city()
        });
    }

    // 3. Ky Thuat Vien - 5 accounts
    for (let i = 1; i <= 5; i++) {
        users.push({
            hoTen: faker.person.fullName(),
            soDienThoai: generateVNPhone(),
            email: `ktv0${i}@store.com`,
            matKhau: hashedPassword,
            vaiTro: 'KyThuatVien',
            diaChi: faker.location.streetAddress() + ', ' + faker.location.city()
        });
    }

    // 4. Khach Hang - 50 accounts
    for (let i = 0; i < 50; i++) {
        users.push({
            hoTen: faker.person.fullName(),
            soDienThoai: generateVNPhone(),
            email: faker.internet.email().toLowerCase(),
            matKhau: hashedPassword,
            vaiTro: 'KhachHang',
            diaChi: faker.location.streetAddress() + ', ' + faker.location.city()
        });
    }

    // Insert users - bypass password hashing middleware
    const createdUsers = await User.insertMany(users);

    console.log(`   ✓ Admin: 1`);
    console.log(`   ✓ Tiếp tân: 2`);
    console.log(`   ✓ Kỹ thuật viên: 5`);
    console.log(`   ✓ Khách hàng: 50`);
    console.log(`✅ Tổng Users: ${createdUsers.length}\n`);

    return {
        admin: createdUsers.filter(u => u.vaiTro === 'Admin'),
        tiepTan: createdUsers.filter(u => u.vaiTro === 'TiepTan'),
        kyThuatVien: createdUsers.filter(u => u.vaiTro === 'KyThuatVien'),
        khachHang: createdUsers.filter(u => u.vaiTro === 'KhachHang')
    };
}

// ============ SEED LINH KIEN ============

async function seedLinhKien() {
    console.log('🔧 Đang tạo Linh Kiện...');

    const linhKienList = [];
    let stt = 1;

    const nhaCungCapList = [
        'Công ty TNHH Linh Kiện Số Việt',
        'Công ty CP Phân Phối Máy Tính',
        'Nhà phân phối chính hãng Dell',
        'Nhà phân phối chính hãng HP',
        'Công ty TNHH TM LCD Miền Nam',
        'Đại lý Pin Laptop Chính Hãng'
    ];

    for (const category of LINH_KIEN_DATA) {
        for (const item of category.items) {
            const tonToiThieu = Math.floor(Math.random() * 6) + 5; // 5-10
            // Random so luong, some items will be below minimum for testing
            let soLuongTon;
            if (Math.random() < 0.15) {
                // 15% chance to have low stock (for testing warnings)
                soLuongTon = Math.floor(Math.random() * tonToiThieu);
            } else {
                soLuongTon = Math.floor(Math.random() * 100) + 1;
            }

            linhKienList.push({
                maSKU: `LK-${String(stt).padStart(5, '0')}`,
                tenLinhKien: item.ten,
                moTa: item.moTa,
                danhMuc: category.danhMuc,
                giaNhap: item.giaNhap,
                giaBan: Math.round(item.giaNhap * 1.3), // 30% profit margin
                soLuongTon,
                tonToiThieu,
                nhaCungCap: getRandomItem(nhaCungCapList)
            });
            stt++;
        }
    }

    const createdLinhKien = await LinhKien.insertMany(linhKienList);

    // Count by category
    const categoryCounts = {};
    for (const lk of createdLinhKien) {
        categoryCounts[lk.danhMuc] = (categoryCounts[lk.danhMuc] || 0) + 1;
    }

    for (const [cat, count] of Object.entries(categoryCounts)) {
        console.log(`   ✓ ${cat}: ${count}`);
    }

    // Count low stock items
    const lowStock = createdLinhKien.filter(lk => lk.soLuongTon <= lk.tonToiThieu);
    console.log(`   ⚠️  Linh kiện cần nhập thêm (tồn thấp): ${lowStock.length}`);
    console.log(`✅ Tổng Linh Kiện: ${createdLinhKien.length}\n`);

    return createdLinhKien;
}

// ============ SEED DON HANG ============

async function seedDonHang(users, linhKienList) {
    console.log('📋 Đang tạo Đơn Hàng...');

    const { tiepTan, kyThuatVien, khachHang } = users;
    const donHangList = [];
    const chiTietList = [];
    const hoaDonList = [];

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    let orderCount = 0;

    // Helper to create maVanDon
    const createMaVanDon = (index, date) => {
        const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
        return `VD-${dateStr}-${String(index + 1).padStart(4, '0')}`;
    };

    // 1. ChoBaoGia - 20 orders (no technician, no parts)
    for (let i = 0; i < 20; i++) {
        const ngayNhan = randomDate(thirtyDaysAgo, now);

        donHangList.push({
            maVanDon: createMaVanDon(orderCount++, ngayNhan),
            modelMay: getRandomItem(LAPTOP_MODELS),
            serialIMEI: faker.string.alphanumeric(15).toUpperCase(),
            tinhTrangLoi: getRandomItem(LAPTOP_ISSUES),
            phuKienKem: getRandomItems(ACCESSORIES, 0, 2),
            trangThai: 'ChoBaoGia',
            khachHang: getRandomItem(khachHang)._id,
            ngayNhan,
            ghiChu: Math.random() > 0.7 ? faker.lorem.sentence() : undefined
        });
    }

    // 2. DangSua - 30 orders (with technician and parts)
    for (let i = 0; i < 30; i++) {
        const ngayNhan = randomDate(thirtyDaysAgo, now);
        const ngayHenTra = new Date(ngayNhan.getTime() + (3 + Math.floor(Math.random() * 4)) * 24 * 60 * 60 * 1000);

        const donHang = {
            maVanDon: createMaVanDon(orderCount++, ngayNhan),
            modelMay: getRandomItem(LAPTOP_MODELS),
            serialIMEI: faker.string.alphanumeric(15).toUpperCase(),
            tinhTrangLoi: getRandomItem(LAPTOP_ISSUES),
            phuKienKem: getRandomItems(ACCESSORIES, 0, 2),
            trangThai: 'DangSua',
            khachHang: getRandomItem(khachHang)._id,
            kyThuatVien: getRandomItem(kyThuatVien)._id,
            ngayNhan,
            ngayHenTra,
            uocTinhChiPhi: (Math.floor(Math.random() * 20) + 5) * 100000, // 500k - 2.5M
            ghiChu: Math.random() > 0.7 ? faker.lorem.sentence() : undefined
        };

        donHangList.push(donHang);
    }

    // 3. HoanThanh - 30 orders (completed with parts)
    for (let i = 0; i < 30; i++) {
        const ngayNhan = randomDate(thirtyDaysAgo, new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000));
        const ngayHenTra = new Date(ngayNhan.getTime() + (3 + Math.floor(Math.random() * 4)) * 24 * 60 * 60 * 1000);
        const ngayTraThucTe = new Date(ngayHenTra.getTime() + (Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000));

        donHangList.push({
            maVanDon: createMaVanDon(orderCount++, ngayNhan),
            modelMay: getRandomItem(LAPTOP_MODELS),
            serialIMEI: faker.string.alphanumeric(15).toUpperCase(),
            tinhTrangLoi: getRandomItem(LAPTOP_ISSUES),
            phuKienKem: getRandomItems(ACCESSORIES, 0, 2),
            trangThai: 'HoanThanh',
            khachHang: getRandomItem(khachHang)._id,
            kyThuatVien: getRandomItem(kyThuatVien)._id,
            ngayNhan,
            ngayHenTra,
            ngayTraThucTe,
            uocTinhChiPhi: (Math.floor(Math.random() * 20) + 5) * 100000,
            ghiChu: Math.random() > 0.7 ? faker.lorem.sentence() : undefined
        });
    }

    // 4. DaTraKhach - 20 orders (with invoice)
    for (let i = 0; i < 20; i++) {
        const ngayNhan = randomDate(thirtyDaysAgo, new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
        const ngayHenTra = new Date(ngayNhan.getTime() + (3 + Math.floor(Math.random() * 4)) * 24 * 60 * 60 * 1000);
        const ngayTraThucTe = new Date(ngayHenTra.getTime() + (Math.random() < 0.8 ? 0 : Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000));

        donHangList.push({
            maVanDon: createMaVanDon(orderCount++, ngayNhan),
            modelMay: getRandomItem(LAPTOP_MODELS),
            serialIMEI: faker.string.alphanumeric(15).toUpperCase(),
            tinhTrangLoi: getRandomItem(LAPTOP_ISSUES),
            phuKienKem: getRandomItems(ACCESSORIES, 0, 2),
            trangThai: 'DaTraKhach',
            khachHang: getRandomItem(khachHang)._id,
            kyThuatVien: getRandomItem(kyThuatVien)._id,
            ngayNhan,
            ngayHenTra,
            ngayTraThucTe,
            uocTinhChiPhi: (Math.floor(Math.random() * 20) + 5) * 100000,
            ghiChu: Math.random() > 0.7 ? faker.lorem.sentence() : undefined
        });
    }

    // Insert don hang
    const createdDonHang = await DonHang.insertMany(donHangList);

    // Create ChiTietSuaChua for orders with status DangSua, HoanThanh, DaTraKhach
    const ordersWithParts = createdDonHang.filter(d =>
        ['DangSua', 'HoanThanh', 'DaTraKhach'].includes(d.trangThai)
    );

    for (const order of ordersWithParts) {
        const selectedParts = getRandomItems(linhKienList, 1, 3);
        const danhSachLinhKien = selectedParts.map(lk => ({
            linhKien: lk._id,
            tenLinhKien: lk.tenLinhKien,
            soLuong: Math.floor(Math.random() * 2) + 1, // 1-2
            donGia: lk.giaBan
        }));

        const congTho = (Math.floor(Math.random() * 5) + 1) * 100000; // 100k - 500k

        chiTietList.push({
            donHang: order._id,
            danhSachLinhKien,
            congTho,
            chanDoan: getRandomItem(TECHNICAL_NOTES),
            ghiChuKyThuat: Math.random() > 0.5 ? faker.lorem.sentence() : undefined
        });
    }

    const createdChiTiet = await ChiTietSuaChua.insertMany(chiTietList);

    // Create HoaDon for DaTraKhach orders
    const completedOrders = createdDonHang.filter(d => d.trangThai === 'DaTraKhach');
    let hdIndex = 0;

    for (const order of completedOrders) {
        const chiTiet = createdChiTiet.find(ct => ct.donHang.toString() === order._id.toString());

        if (chiTiet) {
            const tongTienLinhKien = chiTiet.danhSachLinhKien.reduce((sum, item) =>
                sum + (item.soLuong * item.donGia), 0
            );
            const tongCongTho = chiTiet.congTho;
            const giamGia = Math.random() < 0.2 ? Math.floor(tongTienLinhKien * 0.05) : 0;
            const tongTien = tongTienLinhKien + tongCongTho - giamGia;

            const dateStr = order.ngayTraThucTe.toISOString().slice(2, 10).replace(/-/g, '');

            hoaDonList.push({
                maHoaDon: `HD-${dateStr}-${String(hdIndex + 1).padStart(4, '0')}`,
                donHang: order._id,
                khachHang: order.khachHang,
                tongTienLinhKien,
                tongCongTho,
                giamGia,
                tongTien,
                trangThaiThanhToan: 'DaThanhToan',
                phuongThucThanhToan: getRandomItem(['TienMat', 'ChuyenKhoan', 'TheNganHang']),
                ngayThanhToan: order.ngayTraThucTe
            });
            hdIndex++;
        }
    }

    const createdHoaDon = await HoaDon.insertMany(hoaDonList);

    // Count by status
    const statusCounts = {};
    for (const dh of createdDonHang) {
        statusCounts[dh.trangThai] = (statusCounts[dh.trangThai] || 0) + 1;
    }

    console.log(`   ✓ ChoBaoGia: ${statusCounts['ChoBaoGia'] || 0}`);
    console.log(`   ✓ DangSua: ${statusCounts['DangSua'] || 0}`);
    console.log(`   ✓ HoanThanh: ${statusCounts['HoanThanh'] || 0}`);
    console.log(`   ✓ DaTraKhach: ${statusCounts['DaTraKhach'] || 0}`);
    console.log(`   ✓ Chi tiết sửa chữa: ${createdChiTiet.length}`);
    console.log(`   ✓ Hóa đơn: ${createdHoaDon.length}`);
    console.log(`✅ Tổng Đơn Hàng: ${createdDonHang.length}\n`);

    return createdDonHang;
}

// ============ SEED LICH HEN ============

async function seedLichHen(users) {
    console.log('📅 Đang tạo Lịch Hẹn...');

    const { khachHang } = users;
    const lichHenList = [];

    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Working hours: 8:00 - 17:00
    const workingHours = [8, 9, 10, 11, 14, 15, 16, 17];

    // Create 20 normal appointments
    for (let i = 0; i < 20; i++) {
        const customer = getRandomItem(khachHang);
        const appointmentDate = randomDate(now, sevenDaysLater);
        appointmentDate.setHours(getRandomItem(workingHours), 0, 0, 0);

        lichHenList.push({
            khachHang: customer._id,
            hoTenKhach: customer.hoTen,
            soDienThoai: customer.soDienThoai,
            ngayGioHen: appointmentDate,
            noiDungHongHoc: getRandomItem(LAPTOP_ISSUES),
            modelMay: getRandomItem(LAPTOP_MODELS),
            trangThaiXacNhan: getRandomItem(['ChoXacNhan', 'DaXacNhan']),
            ghiChu: Math.random() > 0.7 ? faker.lorem.sentence() : undefined
        });
    }

    // Create 5 overlapping appointments (same time slot to test warning)
    const overlappingDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    overlappingDate.setHours(10, 0, 0, 0); // All at 10:00 AM

    for (let i = 0; i < 5; i++) {
        const customer = getRandomItem(khachHang);

        lichHenList.push({
            khachHang: customer._id,
            hoTenKhach: customer.hoTen,
            soDienThoai: customer.soDienThoai,
            ngayGioHen: overlappingDate,
            noiDungHongHoc: getRandomItem(LAPTOP_ISSUES),
            modelMay: getRandomItem(LAPTOP_MODELS),
            trangThaiXacNhan: 'ChoXacNhan',
            ghiChu: '⚠️ Lịch hẹn trùng giờ (test)'
        });
    }

    const createdLichHen = await LichHen.insertMany(lichHenList);

    const confirmedCount = createdLichHen.filter(lh => lh.trangThaiXacNhan === 'DaXacNhan').length;
    const pendingCount = createdLichHen.filter(lh => lh.trangThaiXacNhan === 'ChoXacNhan').length;

    console.log(`   ✓ Đã xác nhận: ${confirmedCount}`);
    console.log(`   ✓ Chờ xác nhận: ${pendingCount}`);
    console.log(`   ⚠️  Lịch trùng giờ (${overlappingDate.toLocaleDateString('vi-VN')} 10:00): 5`);
    console.log(`✅ Tổng Lịch Hẹn: ${createdLichHen.length}\n`);

    return createdLichHen;
}

// ============ MAIN EXECUTION ============

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   🚀 LAPTOP REPAIR SHOP - DATABASE SEEDER');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        // Connect to MongoDB
        console.log('🔌 Đang kết nối MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}\n`);

        // Clean existing data
        await cleanData();

        // Seed data in order
        const users = await seedUsers();
        const linhKien = await seedLinhKien();
        await seedDonHang(users, linhKien);
        await seedLichHen(users);

        // Summary
        console.log('═══════════════════════════════════════════════════════════');
        console.log('   ✅ HOÀN TẤT TẠO DỮ LIỆU MẪU!');
        console.log('═══════════════════════════════════════════════════════════\n');

        console.log('📊 TỔNG KẾT:');
        console.log(`   • Users: ${await User.countDocuments()}`);
        console.log(`   • Linh Kiện: ${await LinhKien.countDocuments()}`);
        console.log(`   • Đơn Hàng: ${await DonHang.countDocuments()}`);
        console.log(`   • Chi Tiết Sửa Chữa: ${await ChiTietSuaChua.countDocuments()}`);
        console.log(`   • Hóa Đơn: ${await HoaDon.countDocuments()}`);
        console.log(`   • Lịch Hẹn: ${await LichHen.countDocuments()}`);

        console.log('\n🔑 THÔNG TIN ĐĂNG NHẬP:');
        console.log('───────────────────────────────────────────────────────────');
        console.log('   📌 ADMIN:');
        console.log('      • Email: admin@store.com');
        console.log('      • SĐT: 0901234567');
        console.log('      • Mật khẩu: 123456');
        console.log('');
        console.log('   📌 KỸ THUẬT VIÊN:');
        console.log('      • Email: ktv01@store.com');
        console.log('      • Mật khẩu: 123456');
        console.log('');
        console.log('   📌 TIẾP TÂN:');
        console.log('      • Email: tieptan01@store.com');
        console.log('      • Mật khẩu: 123456');
        console.log('───────────────────────────────────────────────────────────\n');

    } catch (error) {
        console.error('❌ Lỗi:', error.message);
        console.error(error);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 Đã ngắt kết nối MongoDB.');
        process.exit();
    }
}

// Run
main();
