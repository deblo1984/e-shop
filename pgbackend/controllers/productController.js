const db = require('../models');
const asyncHandler = require('express-async-handler');

const Product = db.product;
const Photo = db.photo;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const product = await Product.create(req.body
        , {
            include: [Photo]
        })


    if (!product) {
        return res.status(401).json({
            message: 'failed create product'
        })
    }
    return res.status(201).json({
        success: true
    })

})

exports.findAll = asyncHandler(async (req, res) => {
    const products = await Product.findAll({ include: Photo })
    return res.json({
        success: true,
        products
    })
})

exports.findOne = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id, { include: Photo })
    return res.json({
        success: true,
        product
    })
})

exports.delete = asyncHandler(async (req, res) => {
    const result = await Product.destroy({
        where: { id: req.params.id }
    })
    if (result) {
        res.status(201).json({
            status: true
        })
    } else {
        res.status(401).json({
            status: false,
            message: 'cannot delete product'
        })
    }
})