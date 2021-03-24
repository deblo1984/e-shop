const express = require('express');
const { validateCategory } = require('../validations/categoryValidator');
const category = require('../controllers/categoryController');
const { isAuthenticated, authorizeRoles } = require('../middlewares/authentication');

const router = express.Router();

router.route('/category').get(category.findAll);
router.route('/category/:id').get(category.findOne);
router.route('/admin/category').post(isAuthenticated, authorizeRoles('admin'),
    validateCategory, category.create);
router.route('admin/category/:id').put(isAuthenticated, authorizeRoles('admin'),
    validateCategory, category.update);
router.route('/category/:id').delete(isAuthenticated, authorizeRoles('admin'),
    category.delete);

module.exports = router