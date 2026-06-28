const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct, getCategories, addCategory } = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

// Setup multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/categories', getCategories);
router.post('/categories', verifyAdmin, addCategory);

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', verifyAdmin, upload.single('image'), addProduct);
router.put('/:id', verifyAdmin, upload.single('image'), updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);

module.exports = router;
