const router = require('express').Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/upload');
const Product = require('../models/Product');

router.get('/products', productController.getProducts);

// Route for downloading live inventory CSV from the backend database
router.get('/products/export-csv', productController.exportInventoryCSV);

router.post('/add-single-saree', upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }]), productController.addSingleSaree);
router.post('/add-saree-with-variants', upload.any(), productController.addSareeWithVariants);
router.post('/upload-sarees', upload.single('file'), productController.uploadExcelSarees);

// Added alias for bulk-excel route matching your frontend call
router.post('/products/bulk-excel', upload.single('file'), productController.uploadExcelSarees);

// Added Clear All Listings route
router.delete('/products/clear-all', async (req, res) => {
  try {
    await Product.deleteMany({});
    return res.status(200).json({ message: "All product listings removed successfully." });
  } catch (err) {
    console.error("Clear All Error:", err);
    return res.status(500).json({ message: "Server error while clearing listings." });
  }
});

router.put('/products/:id', upload.any(), productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);
router.post('/products/:id/review', productController.addReview);

module.exports = router;