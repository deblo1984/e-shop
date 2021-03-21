const express = require('express');
const user = require('../controllers/userController');

const router = express.Router();

router.route('/user/register').post(user.create);

module.exports = router