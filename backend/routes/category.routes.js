const express = require('express');
const category = require('../controllers/categoryController');

const router = express.Router();

router.route('/category').get(category.findAll);
router.route('/category/:id').get(category.findOne);
router.route('/category').post(category.create);
router.route('/category/:id').put(category.update);
router.route('/category/:id').delete(category.delete);

module.exports = router