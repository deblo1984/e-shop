const express = require('express');
const order = require('../controllers/orderController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/order').post(isAuthenticated, order.create);
router.route('/order').get(isAuthenticated, authorizeRoles('admin'), order.findAll);
router.route('/order/:id').get(isAuthenticated, order.findOne);
router.route('/order/:id/delivered').put(isAuthenticated, authorizeRoles('admin'), order.updateDelivered);

module.exports = router