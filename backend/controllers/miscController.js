const db = require('../config/db');

// Feedback
const submitFeedback = async (req, res) => {
    try {
        const { name, email, mobile, rating, message } = req.body;
        const userId = req.user ? req.user.id : null; // Optional login

        await db.execute(
            'INSERT INTO feedback (user_id, name, email, mobile, rating, message) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, email, mobile, rating, message]
        );
        res.status(201).json({ message: 'Feedback submitted successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const [feedbacks] = await db.execute('SELECT * FROM feedback ORDER BY created_at DESC');
        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        await db.execute('DELETE FROM feedback WHERE id = ?', [req.params.id]);
        res.json({ message: 'Feedback deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Contact
const submitContact = async (req, res) => {
    try {
        const { name, email, mobile, subject, message } = req.body;
        await db.execute(
            'INSERT INTO contact_messages (name, email, mobile, subject, message) VALUES (?, ?, ?, ?, ?)',
            [name, email, mobile, subject, message]
        );
        res.status(201).json({ message: 'Message sent successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getContactMessages = async (req, res) => {
    try {
        const [messages] = await db.execute('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const deleteContact = async (req, res) => {
    try {
        await db.execute('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
        res.json({ message: 'Message deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Dashboard Stats
const getDashboardStats = async (req, res) => {
    try {
        const [[users]] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [[orders]] = await db.execute('SELECT COUNT(*) as count FROM orders');
        const [[revenue]] = await db.execute("SELECT SUM(total_amount) as total FROM orders WHERE status = 'Delivered'");
        const [[feedback]] = await db.execute('SELECT COUNT(*) as count FROM feedback');
        const [[products]] = await db.execute('SELECT COUNT(*) as count FROM products');

        res.json({
            users: users.count,
            orders: orders.count,
            revenue: revenue.total || 0,
            feedback: feedback.count,
            products: products.count
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Users management (Admin)
const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, email, mobile, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const deleteUser = async (req, res) => {
    try {
        await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};


module.exports = { 
    submitFeedback, getAllFeedback, deleteFeedback, 
    submitContact, getContactMessages, deleteContact, 
    getDashboardStats, getAllUsers, deleteUser 
};
