const router = require('express').Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getProfile);
router.put('/address', userController.updateAddress);

module.exports = router;