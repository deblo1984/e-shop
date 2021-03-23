const express = require('express');
const review = require('../controllers/reviewController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/product/review').post(isAuthenticated, authorizeRoles('admin', 'user'), review.create);
router.route('/product/review/delete').delete(isAuthenticated, review.delete);

module.exports = router