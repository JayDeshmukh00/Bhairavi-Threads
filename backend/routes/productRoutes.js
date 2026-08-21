const router = require('express').Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/products', productController.getProducts);
router.post('/add-single-saree', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), productController.addSingleSaree);
router.post('/add-saree-with-variants', upload.any(), productController.addSareeWithVariants);
router.post('/upload-sarees', upload.single('file'), productController.uploadExcelSarees);
router.put('/products/:id', upload.any(), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.post('/products/:id/review', productController.addReview);

module.exports = router;