const db = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const [products] = await db.execute(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
        `);
        res.json(products);
    } catch (error) {
        console.error('getProducts Error:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getProductById = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (products.length === 0) return res.status(404).json({ error: 'Product not found.' });
        res.json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const addProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, is_available } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        await db.execute(
            'INSERT INTO products (category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
            [category_id || null, name, description, price, imageUrl, is_available !== undefined ? is_available : true]
        );
        res.status(201).json({ message: 'Product added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, is_available } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.body.image_url;

        await db.execute(
            'UPDATE products SET category_id=?, name=?, description=?, price=?, image_url=?, is_available=? WHERE id=?',
            [category_id || null, name, description, price, imageUrl, is_available, req.params.id]
        );
        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// Categories
const getCategories = async (req, res) => {
    try {
        const [categories] = await db.execute('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        await db.execute('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        res.status(201).json({ message: 'Category added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

module.exports = { getProducts, getProductById, addProduct, updateProduct, deleteProduct, getCategories, addCategory };
