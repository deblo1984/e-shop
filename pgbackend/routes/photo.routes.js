const express = require('express');
const photo = require('../controllers/photoController');

const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');
const router = express.Router();

router.route('/product/photo').post(isAuthenticated, authorizeRoles('admin'), photo.create);
router.route('/product/photo/:id/setMain').put(isAuthenticated, authorizeRoles('admin'), photo.setMain);

module.exports = router