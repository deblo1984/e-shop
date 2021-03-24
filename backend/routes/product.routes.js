const express = require('express');
const product = require('../controllers/productController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/products/create').post(isAuthenticated, authorizeRoles('admin', 'user'), product.create);
router.route('/products').get(isAuthenticated, authorizeRoles('admin', 'user'), product.findAll);
router.route('/products/:id').get(product.findOne);
router.route('/products/:id').delete(product.delete);
router.route('/products/:id').put(product.update);
router.route('/products/:id/review').get(isAuthenticated, product.productReviews);

module.exports = router