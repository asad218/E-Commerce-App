const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const productController = require('../controllers/product.controller');
const middleware = require('../middleware/auth.middleware');  
const cartController = require('../controllers/cart.controller') ;
const orderController = require('../controllers/order.controller');

router.post('/register', authController.registerUser);
router.post('/log-in',authController.loginUser);
router.post('/create-product',middleware.authAdmin,productController.createProduct);
router.get('/get-all-products',middleware.authCustomer,productController.getAllProducts);
router.get('/get-product/:id',middleware.authCustomer,productController.getProductById);
router.post('/add/cart' , middleware.authCustomer,cartController.addToCart);
router.get('/cart',  middleware.authCustomer,cartController.getCart);
router.delete('/remove/:productId',middleware.authCustomer,cartController.removeItem);
router.delete('/clear', middleware.authCustomer,cartController.clearCart);
router.post('/create-order' , middleware.authAdmin,orderController.createOrder);



module.exports = router;