const express = require('express');
const order = require('../controllers/orderController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

//user routes
router.route('/order/create').post(isAuthenticated, order.create);
router.route('/orders').get(isAuthenticated, order.findAllByUserId);
router.route('/orders/:id').get(isAuthenticated, order.getUserOrderDetails);

//admin routes
router.route('/admin/orders').get(isAuthenticated, authorizeRoles('admin'), order.findAll);
router.route('/admin/order/:id').get(isAuthenticated, authorizeRoles('admin'), order.findOne)
    .delete(isAuthenticated, authorizeRoles('admin'), order.delete);
router.route('/admin/order/:id/status')
    .put(isAuthenticated, authorizeRoles('admin'), order.updateStatus);

module.exports = router