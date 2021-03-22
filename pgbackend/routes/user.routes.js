const express = require('express');
const user = require('../controllers/userController');

const router = express.Router();

router.route('/register').post(user.create);
router.route('/login').post(user.login);
router.route('/logout').get(user.logout)

module.exports = router