const express = require('express');
const router = express.Router();

const {
    CreateOrder,
    getUserListOrder,
    getUserOrderDetails,
    getOrderList,
    getOrderDetails,
    updateOrder
} = require('../controllers/orderController');

const {
    isAuthenticatedUser,
    authorizeRoles
} = require('../middlewares/authMiddleware');

router.route('/order/create').post(isAuthenticatedUser, CreateOrder);
router.route('/order/user').get(isAuthenticatedUser, getUserListOrder);
router.route('/order/details/:id').get(isAuthenticatedUser, getUserOrderDetails);

//admin routes
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getOrderList);
router.route('/admin/orders/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getOrderDetails);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

module.exports = router