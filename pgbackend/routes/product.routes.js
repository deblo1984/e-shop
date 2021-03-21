const express = require('express');
const product = require('../controllers/productController');
const { isAuthenticatedUser } = require('../middlewares/authentication');

const router = express.Router();

router.route('/product').post(isAuthenticatedUser, product.create);
router.route('/product').get(isAuthenticatedUser, product.findAll);
router.route('/product/:id').get(product.findOne);
router.route('/product/:id').delete(product.delete);
router.route('/product/:id').put(product.update);

module.exports = router