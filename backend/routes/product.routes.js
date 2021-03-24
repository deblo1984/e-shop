const express = require('express');
const product = require('../controllers/productController');
const { validateProduct } = require('../validations/productValidator')
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/products').get(product.findAll);
router.route('/products/:id').get(product.findOne);
router.route('/products/:id/review').get(isAuthenticated, product.productReviews);

router.route('/admin/products/create').post(isAuthenticated, authorizeRoles('admin', 'user'),
    validateProduct, product.create);
router.route('/admin/products/:id').delete(isAuthenticated, authorizeRoles('admin'),
    product.delete);
router.route('/admin/products/:id').put(isAuthenticated, authorizeRoles('admin'),
    validateProduct, product.update);

module.exports = router