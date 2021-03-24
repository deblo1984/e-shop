const db = require('../models');
const Tutorial = db.tutorial;
const Op = db.Sequelize.Op;
const asyncHandler = require('express-async-handler')


exports.create = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400).json({
            message: 'content cannot be empty'
        });
        return;
    }
    const tutorial = {
        title: req.body.title,
        description: req.body.description,
        published: req.body.published ? req.body.published : false
    };

    const data = await Tutorial.create(tutorial)
    console.log(data);

    return res.status(201).json({
        sucess: true,
        data
    })
});

exports.findAll = asyncHandler(async (req, res) => {
    const tutorial = await Tutorial.findAll({ attributes: ['title', 'description'] })
    if (tutorial.length <= 0) {
        return res.status(401).json({
            success: false,
            message: 'there is no data'
        })
    }
    return res.json({
        success: true,
        count: tutorial.length,
        tutorial
    })
})

exports.findOne = asyncHandler(async (req, res) => {
    const tutorial = await Tutorial.findByPk(req.params.id);
    return res.json({
        success: true,
        tutorial
    })

})

exports.update = asyncHandler(async (req, res) => {
    const result = await Tutorial.update(req.body, {
        where: { id: req.params.id }
    })
    if (result) {
        res.json({
            success: true
        })
    } else {
        res.status(400).json({
            success: false,
            message: 'cannot update data'
        })
    }
})

exports.deleteOne = asyncHandler(async (req, res) => {
    const result = await Tutorial.destroy({
        where: { id: req.params.id }
    })
    if (result) {
        res.json({
            success: true
        })
    } else {
        res.status(401).json({
            success: false,
            message: 'Cannot delete data'
        })
    }
})

exports.deleteAll = (req, res) => {
    const result = Tutorial.destroy({
        where: {},
        truncate: false
    })
    if (result) {
        res.json({
            success: true,
            message: 'all data has been deleted'
        })
    }
}

exports.findAllPublished = asyncHandler(async (req, res) => {
    const result = await Tutorial.findAll({ where: { published: req.body.publish } })
    if (result) {
        res.json({
            success: true,
            result
        })
    } else {
        res.status(400).json({
            success: false,
            message: 'error'
        })
    }
})