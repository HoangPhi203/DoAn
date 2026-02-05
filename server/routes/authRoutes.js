const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getMe,
    getUsers,
    getTechnicians,
    updateUser,
    deleteUser
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, authorize('Admin'), getUsers);
router.get('/technicians', protect, authorize('Admin', 'TiepTan'), getTechnicians);
router.put('/users/:id', protect, authorize('Admin'), updateUser);
router.delete('/users/:id', protect, authorize('Admin'), deleteUser);

module.exports = router;
