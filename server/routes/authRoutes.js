const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    getUsers,
    getTechnicians,
    updateUser,
    deleteUser,
    sendOTP,
    verifyOTP,
    updateDetails,
    updatePassword
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { generateCaptcha, verifyCaptcha } = require('../middleware/captchaMiddleware');

// Public routes
router.post('/register', verifyCaptcha, register);
router.post('/login', verifyCaptcha, login);
router.get('/captcha', generateCaptcha);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

router.get('/users', protect, authorize('Admin'), getUsers);
router.get('/technicians', protect, authorize('Admin', 'TiepTan'), getTechnicians);
router.put('/users/:id', protect, authorize('Admin'), updateUser);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
