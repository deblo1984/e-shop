const express = require('express');
const review = require('../controllers/reviewController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/product/review').post(isAuthenticated, authorizeRoles('admin'), review.create);

module.exports = router