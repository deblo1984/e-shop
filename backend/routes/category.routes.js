const express = require('express');
const { validateCategory } = require('../validations/categoryValidator');
const category = require('../controllers/categoryController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/admin/categories').get(isAuthenticated, authorizeRoles('admin'), category.findAll);
router.route('/admin/category/:id').get(category.findOne);
router.route('/admin/category').post(isAuthenticated, authorizeRoles('admin'),
    validateCategory, category.create);
router.route('/admin/category/:id').put(isAuthenticated, authorizeRoles('admin'),
    validateCategory, category.update);
router.route('/admin/category/:id').delete(isAuthenticated, authorizeRoles('admin'),
    category.delete);

module.exports = router