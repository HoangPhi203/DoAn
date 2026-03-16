const ThongBao = require('../models/ThongBao');

// @desc    Get all notifications for logged in user (based on role)
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const userRole = req.user.vaiTro; // 'Admin', 'TiepTan', 'KyThuatVien'
        
        let query = {
            $or: [
                { nguoiNhan: 'TatCa' },
                { nguoiNhan: userRole }
            ]
        };

        const notifications = await ThongBao.find(query)
            .sort('-createdAt')
            .limit(50);

        const unreadCount = await ThongBao.countDocuments({ ...query, daDoc: false });

        res.status(200).json({
            success: true,
            unreadCount,
            data: notifications
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        let notification = await ThongBao.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông báo'
            });
        }

        // Technically, mark as read should probably be per-user, but since the requirement 
        // implies a shared system for Admin/TiepTan for appointment alerts, 
        // setting it to true universally is acceptable for this scope.
        notification.daDoc = true;
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        const userRole = req.user.vaiTro;
        
        let query = {
            $or: [
                { nguoiNhan: 'TatCa' },
                { nguoiNhan: userRole }
            ],
            daDoc: false
        };

        await ThongBao.updateMany(query, { daDoc: true });

        res.status(200).json({
            success: true,
            message: 'Đã đánh dấu tất cả là đã đọc'
        });
    } catch (err) {
        next(err);
    }
};
