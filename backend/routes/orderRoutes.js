const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/', verifyToken, placeOrder);
router.get('/myorders', verifyToken, getUserOrders);
router.put('/:id/cancel', verifyToken, cancelOrder);

// Admin Routes
router.get('/', verifyAdmin, getAllOrders);
router.put('/:id/status', verifyAdmin, updateOrderStatus);

module.exports = router;
