const express = require('express');
const router = express.Router();
const { 
    submitFeedback, getAllFeedback, deleteFeedback, 
    submitContact, getContactMessages, deleteContact, 
    getDashboardStats, getAllUsers, deleteUser 
} = require('../controllers/miscController');
const { verifyAdmin } = require('../middleware/auth');

// Public routes
router.post('/feedback', submitFeedback);
router.post('/contact', submitContact);

// Admin routes
router.get('/feedback', verifyAdmin, getAllFeedback);
router.delete('/feedback/:id', verifyAdmin, deleteFeedback);

router.get('/contact', verifyAdmin, getContactMessages);
router.delete('/contact/:id', verifyAdmin, deleteContact);

router.get('/dashboard-stats', verifyAdmin, getDashboardStats);

router.get('/users', verifyAdmin, getAllUsers);
router.delete('/users/:id', verifyAdmin, deleteUser);

module.exports = router;
