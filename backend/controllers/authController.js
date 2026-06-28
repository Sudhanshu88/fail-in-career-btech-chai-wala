const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute('INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)', [name, email, mobile, hashedPassword]);
        
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'All fields are required.' });

        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials.' });

        const user = users[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile } });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'All fields are required.' });

        const [admins] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        
        if (admins.length === 0) {
            // Temporary measure: if no admins exist and using default credentials, create one
            if (username === 'admin' && password === 'admin123') {
                const hashed = await bcrypt.hash('admin123', 10);
                const [result] = await db.execute('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hashed]);
                const adminId = result.insertId;
                const token = jwt.sign({ id: adminId, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
                return res.json({ token, user: { id: adminId, username: 'admin', role: 'admin' } });
            }
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const admin = admins[0];
        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { id: admin.id, username: admin.username, role: 'admin' } });
    } catch (error) {
        console.error('Admin Login Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [users] = await db.execute('SELECT id, name, email, mobile, created_at FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found.' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, mobile } = req.body;
        await db.execute('UPDATE users SET name = ?, mobile = ? WHERE id = ?', [name, mobile, userId]);
        res.json({ message: 'Profile updated successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { oldPassword, newPassword } = req.body;
        
        const [users] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found.' });

        const user = users[0];
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(400).json({ error: 'Incorrect old password.' });

        const hashedNew = await bcrypt.hash(newPassword, 10);
        await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedNew, userId]);

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { registerUser, loginUser, loginAdmin, getProfile, updateProfile, changePassword };
