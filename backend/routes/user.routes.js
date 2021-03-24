const express = require('express');
const { validateUser } = require('../validations/userValidator');
const user = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(validateUser, user.create);
router.route('/login').post(user.login);
router.route('/logout').get(user.logout)

module.exports = router