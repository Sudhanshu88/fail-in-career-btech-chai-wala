const db = require('../config/db');

const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mobile, delivery_address, payment_method, cart_items } = req.body;
        
        if (!mobile || !delivery_address || !payment_method || !cart_items || cart_items.length === 0) {
            return res.status(400).json({ error: 'All fields are required and cart must not be empty.' });
        }

        const [users] = await db.execute('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = users[0].name;

        // Calculate total
        let totalAmount = 0;
        for (let item of cart_items) {
            totalAmount += (item.price * item.quantity);
        }

        const [result] = await db.execute(
            'INSERT INTO orders (user_id, user_name, mobile, delivery_address, payment_method, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, userName, mobile, delivery_address, payment_method, totalAmount]
        );
        
        const orderId = result.insertId;

        // Insert items
        for (let item of cart_items) {
            await db.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product_id, item.quantity, item.price]
            );
        }

        // Clear user's cart in db
        await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const [orders] = await db.execute('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        
        for (let order of orders) {
            const [items] = await db.execute(`
                SELECT oi.*, p.name, p.image_url 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const [orders] = await db.execute('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
        if (orders.length === 0) return res.status(404).json({ error: 'Order not found.' });

        if (orders[0].status !== 'Pending') {
            return res.status(400).json({ error: 'Only pending orders can be cancelled.' });
        }

        await db.execute("UPDATE orders SET status = 'Cancelled' WHERE id = ?", [orderId]);
        res.json({ message: 'Order cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
        for (let order of orders) {
            const [items] = await db.execute(`
                SELECT oi.*, p.name 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const { status } = req.body;
        // status: 'Accepted', 'Rejected', 'Preparing', 'Ready', 'Delivered'
        await db.execute('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        res.json({ message: 'Order status updated.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { placeOrder, getUserOrders, cancelOrder, getAllOrders, updateOrderStatus };
