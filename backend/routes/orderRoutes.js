const router = require('express').Router();
const orderController = require('../controllers/orderController');

router.get('/orders/user', orderController.getUserOrders);
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', orderController.updateOrderStatus);

module.exports = router;