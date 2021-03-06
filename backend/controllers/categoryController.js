const db = require('../models');
const asyncHandler = require('express-async-handler');
const Category = db.category;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res, next) => {
    if (!req.body.name) {
        res.status(400).json({
            success: false,
            message: 'name cannot empty'
        })
    }
    const result = await Category.create({ name: req.body.name })
    if (!result) {
        return res.send({
            success: false,
            message: 'cannot create category'
        })
    }
    return res.status(201).json({
        success: true,
        category: result,
        message: 'Category created successfully'
    })
})

exports.findAll = asyncHandler(async (req, res) => {
    const categories = await Category.findAll({});
    return res.json({
        success: true,
        count: categories.length,
        categories
    })
})

exports.findOne = asyncHandler(async (req, res) => {
    const category = await Category.findByPk(req.params.id)
    if (!category) {
        res.status(404).json({
            status: false,
            message: 'Not found'
        })
    }
    return res.send({
        success: true,
        category
    })
})

exports.update = asyncHandler(async (req, res) => {
    const result = await Category.update(req.body, {
        where: { id: req.params.id }
    })
    if (result) {
        res.status(201).json({
            success: true,
            message: 'category updated successfully'
        })
    } else {
        res.status(400).json({
            success: false,
            message: 'cannot update category'
        })
    }
})

exports.delete = asyncHandler(async (req, res) => {
    const result = await Category.destroy({
        where: { id: req.params.id }
    })
    if (result) {
        res.status(201).json({
            success: true,
            message: 'category deleted'
        })
    } else {
        res.status(400).json({
            suceess: false,
            message: 'cannot delete category data'
        })
    }
})
