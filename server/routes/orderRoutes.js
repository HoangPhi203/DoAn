const express = require('express');
const router = express.Router();
const {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
    assignTechnician,
    updateStatus,
    addParts,
    trackOrder
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route - must come before protected routes
router.get('/track/:phone', trackOrder);

router.route('/')
    .get(protect, authorize('Admin', 'TiepTan', 'KyThuatVien'), getOrders)
    .post(protect, authorize('Admin', 'TiepTan'), createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .put(protect, authorize('Admin', 'TiepTan'), updateOrder)
    .delete(protect, authorize('Admin'), deleteOrder);

router.put('/:id/assign', protect, authorize('Admin', 'TiepTan'), assignTechnician);
router.put('/:id/status', protect, authorize('Admin', 'KyThuatVien'), updateStatus);
router.post('/:id/parts', protect, authorize('KyThuatVien', 'Admin'), addParts);

module.exports = router;
