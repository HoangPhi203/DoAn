const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ThongBao = require('./models/ThongBao');

dotenv.config({ path: './.env' });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('MongoDB Connected');
    
    const count = await ThongBao.countDocuments();
    console.log(`Total notifications: ${count}`);

    const techCount = await ThongBao.countDocuments({ nguoiNhan: 'KyThuatVien' });
    console.log(`Total notifications for KyThuatVien: ${techCount}`);

    const recent = await ThongBao.find({ nguoiNhan: 'KyThuatVien' }).sort('-createdAt').limit(2);
    console.log('Recent notifications:', recent);

    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
