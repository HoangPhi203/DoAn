const express = require('express');
const router = express.Router();
const {
    getRevenueReport,
    getTechnicianPerformance,
    getOrderStatusSummary,
    getLowStockAlert,
    exportReportExcel,
    exportReportPDF
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/revenue', protect, authorize('Admin'), getRevenueReport);
router.get('/technician-performance', protect, authorize('Admin'), getTechnicianPerformance);
router.get('/order-status', protect, authorize('Admin'), getOrderStatusSummary);
router.get('/low-stock', protect, authorize('Admin'), getLowStockAlert);
router.get('/export/excel', protect, authorize('Admin'), exportReportExcel);
router.get('/export/pdf', protect, authorize('Admin'), exportReportPDF);

module.exports = router;
