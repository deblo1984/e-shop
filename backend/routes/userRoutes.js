const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    getAllUser,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/userController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware')

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/user').get(isAuthenticatedUser, getUserProfile);
router.route('/user/password').put(isAuthenticatedUser, updatePassword);
router.route('/user/update').put(isAuthenticatedUser, updateProfile);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);

//admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin',), getAllUser);
router.route('/admin/users/:id').get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)

module.exports = router;