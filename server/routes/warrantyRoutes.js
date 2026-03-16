const express = require('express');
const router = express.Router();
const {
    createWarranty,
    getWarranties,
    getWarranty,
    checkWarrantyValidity,
    addWarrantyHistory,
    updateWarranty,
    deleteWarranty
} = require('../controllers/warrantyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Kiểm tra bảo hành theo đơn hàng - must come before :id routes
router.get('/check/:donHangId', protect, checkWarrantyValidity);

router.route('/')
    .get(protect, authorize('Admin', 'TiepTan'), getWarranties)
    .post(protect, authorize('Admin', 'TiepTan'), createWarranty);

router.route('/:id')
    .get(protect, getWarranty)
    .put(protect, authorize('Admin'), updateWarranty)
    .delete(protect, authorize('Admin'), deleteWarranty);

router.post('/:id/history', protect, authorize('Admin', 'TiepTan', 'KyThuatVien'), addWarrantyHistory);

module.exports = router;
