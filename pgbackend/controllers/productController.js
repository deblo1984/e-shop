const db = require('../models');
const asyncHandler = require('express-async-handler');
const { getPagination, getPagingData } = require('../utils/pagination');

const Product = db.product;
const Photo = db.photo;
const Review = db.review;
const User = db.user;;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const {
        name,
        description,
        price,
        stock
    } = req.body
    const userId = req.user.id

    const product = await Product.create({
        name, description, price, stock, userId
    }, {
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
    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
    const products = await Product.findAndCountAll(
        { where: condition, limit, offset, include: [Photo] })

    const response = getPagingData(products, page, limit);

    return res.send({
        success: true,
        response
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
        res.status(400).json({
            status: false,
            message: 'cannot delete product'
        })
    }
})

exports.update = asyncHandler(async (req, res) => {
    const product = await Product.update(req.body, {
        where: { id: req.params.id }
    })

    if (product) {
        res.status(201).json({
            success: true
        })
    } else {
        res.status(400).json({
            success: false,
            message: 'Failed update product'
        })
    }

})

exports.productReviews = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
        attributes:
            { exclude: ['created_at', 'updated_at'] },
        include: {
            model: Review,
            attributes: ['rating', 'comment', 'updated_at'],
            include: {
                model: User,
                attributes: ['name']
            }
        }
    })

    res.status(200).send({
        product
    })

})