const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://hoangphi:hoangphi123@doan.uwb9uvv.mongodb.net/';

async function getStaff() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ soDienThoai: String, hoTen: String, vaiTro: String }));
        
        const admin = await User.findOne({ vaiTro: 'Admin' });
        const receptionist = await User.findOne({ vaiTro: 'TiepTan' });
        const technician = await User.findOne({ hoTen: 'Phương Mai Phan' });
        
        console.log('Admin:', admin ? admin.soDienThoai : 'Not found');
        console.log('Receptionist:', receptionist ? receptionist.soDienThoai : 'Not found');
        console.log('Technician (Mai):', technician ? technician.soDienThoai : 'Not found');
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

getStaff();
