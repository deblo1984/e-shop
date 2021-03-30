const express = require('express');
const { validateUser } = require('../validations/userValidator');
const user = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authentication')

const router = express.Router();

router.route('/register').post(validateUser, user.create);
router.route('/login').post(user.login);
router.route('/logout').get(isAuthenticated, user.logout);
router.route('/profile').get(isAuthenticated, user.getUserProfile);
router.route('/profile/update').put(isAuthenticated, user.update);
router.route('/password/update').put(isAuthenticated, user.updatePassword);
router.route('/password/forgot').post(user.forgotPassword);
router.route('/password/reset/:token').put(user.resetPassword);

module.exports = router