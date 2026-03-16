const express = require('express');
const router = express.Router();
const {
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getAvailableSlots,
    lookupAppointment,
    confirmToOrder
} = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createAppointment);
router.get('/available-slots', getAvailableSlots);
router.get('/lookup', lookupAppointment);

// Protected routes
router.get('/', protect, authorize('Admin', 'TiepTan'), getAppointments);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, authorize('Admin', 'TiepTan'), updateAppointment);
router.delete('/:id', protect, authorize('Admin'), deleteAppointment);
router.post('/:id/confirm-to-order', protect, authorize('Admin', 'TiepTan'), confirmToOrder);

module.exports = router;
