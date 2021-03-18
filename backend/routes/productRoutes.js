const express = require('express')
const router = express.Router();
const { getProducts, createProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware')

router.route('/products').get(getProducts);

router.route('/products/:id').get(getSingleProduct);

//admin routes

router.route('/admin/product/create').post(isAuthenticatedUser,
    authorizeRoles('admin'), createProduct);

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);


module.exports = router;