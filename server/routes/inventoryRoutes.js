const express = require('express');
const router = express.Router();
const {
    getInventory,
    getInventoryItem,
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    getLowStock,
    importStock,
    exportStock
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Low stock route must come before :id routes
router.get('/low-stock', protect, authorize('Admin', 'TiepTan'), getLowStock);

router.route('/')
    .get(protect, authorize('Admin', 'TiepTan', 'KyThuatVien'), getInventory)
    .post(protect, authorize('Admin'), createInventoryItem);

router.route('/:id')
    .get(protect, getInventoryItem)
    .put(protect, authorize('Admin'), updateInventoryItem)
    .delete(protect, authorize('Admin'), deleteInventoryItem);

router.put('/:id/import', protect, authorize('Admin'), importStock);
router.put('/:id/export', protect, authorize('Admin', 'KyThuatVien'), exportStock);

module.exports = router;
