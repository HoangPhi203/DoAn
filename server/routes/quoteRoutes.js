const express = require('express');
const router = express.Router();
const {
    createQuote,
    getQuotes,
    getQuote,
    getQuoteByOrder,
    approveQuote,
    rejectQuote,
    deleteQuote
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Lấy báo giá theo đơn hàng - must come before :id routes
router.get('/order/:donHangId', protect, getQuoteByOrder);

router.route('/')
    .get(protect, authorize('Admin', 'TiepTan', 'KyThuatVien'), getQuotes)
    .post(protect, authorize('KyThuatVien', 'Admin'), createQuote);

router.route('/:id')
    .get(protect, getQuote)
    .delete(protect, authorize('Admin'), deleteQuote);

router.put('/:id/approve', protect, authorize('Admin', 'TiepTan'), approveQuote);
router.put('/:id/reject', protect, authorize('Admin', 'TiepTan'), rejectQuote);

module.exports = router;
