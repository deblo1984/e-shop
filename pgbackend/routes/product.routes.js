const express = require('express');
const product = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/product').post(isAuthenticatedUser, authorizeRoles('admin', 'user'), product.create);
router.route('/product').get(isAuthenticatedUser, authorizeRoles('admin', 'user'), product.findAll);
router.route('/product/:id').get(product.findOne);
router.route('/product/:id').delete(product.delete);
router.route('/product/:id').put(product.update);

module.exports = router