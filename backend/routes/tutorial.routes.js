const express = require('express');
const { create, findAll, findOne, update, deleteOne, findAllPublished, deleteAll } = require('../controllers/tutorialController');

const router = express.Router();

router.route('/tutorial/').get(findAll).post(create)
router.route('/tutorial/published/').get(findAllPublished)
router.route('/tutorial/:id').get(findOne).put(update).delete(deleteOne)
router.route('/tutorials/deleteAll/').delete(deleteAll)

module.exports = router