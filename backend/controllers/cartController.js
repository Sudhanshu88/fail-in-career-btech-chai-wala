const db = require('../config/db');

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const [cartItems] = await db.execute(`
            SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?
        `, [userId]);
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id, quantity } = req.body;

        const [existing] = await db.execute('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, product_id]);
        
        if (existing.length > 0) {
            await db.execute('UPDATE cart SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existing[0].id]);
        } else {
            await db.execute('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, product_id, quantity || 1]);
        }
        res.status(201).json({ message: 'Added to cart.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user.id;
        const { quantity } = req.body;
        const cartId = req.params.id;

        if (quantity <= 0) {
            await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, userId]);
        } else {
            await db.execute('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartId, userId]);
        }
        res.json({ message: 'Cart updated.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;
        await db.execute('DELETE FROM cart WHERE id = ? AND user_id = ?', [cartId, userId]);
        res.json({ message: 'Item removed from cart.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.execute('DELETE FROM cart WHERE user_id = ?', [userId]);
        res.json({ message: 'Cart cleared.' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart };
