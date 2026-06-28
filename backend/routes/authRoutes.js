const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin/login', loginAdmin);

// Protected routes
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.post('/change-password', verifyToken, changePassword);

module.exports = router;
