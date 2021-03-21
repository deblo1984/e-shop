const express = require('express');
const product = require('../controllers/productController');

const router = express.Router();

router.route('/product').post(product.create);
router.route('/product').get(product.findAll);
router.route('/product/:id').get(product.findOne);
router.route('/product/:id').delete(product.delete);
router.route('/product/:id').put(product.update);

module.exports = router