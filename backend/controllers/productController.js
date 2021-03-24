const db = require('../models');
const asyncHandler = require('express-async-handler');
const { getPagination } = require('../utils/pagination');
const { sequelize } = require('../models');

const Product = db.product;
const Photo = db.photo;
const Review = db.review;
const User = db.user;;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    const {
        name,
        description,
        price,
        stock,
    } = req.body
    const userId = req.user.id
    photo = req.body.photos;

    try {
        const product = await Product.create({
            name, description, price, stock, userId
        }, /*{
            include: [Photo]
        },*/ { transaction: t })
        for (let i = 0; i < photo.length; i++) {
            await Photo.create({
                publicId: photo[i].publicId,
                url: photo[i].url,
                productId: product.id

            }, { transaction: t })
        }

        await t.commit();

        return res.status(201).json({
            success: true
        })
    } catch (error) {
        console.log(error.message);
        await t.rollback
        return res.status(500).send({
            message: 'shit happen'
        })
    }
})

exports.findAll = (req, res) => {
    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAndCountAll({
        distinct: true, order: [['created_at', 'desc']], condition, limit, offset,
        include: { model: Photo, required: true, separate: true },
    })
        .then(data => {
            //const response = getPagingData(products, page, limit);
            const { count: totalItems, rows: products } = data;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(totalItems / limit);
            res.send({
                totalItems,
                products,
                totalPages,
                currentPage
            });
        }).catch(err => {
            res.status(500).send({
                message: 'shit happen'
            })
        })
}

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
            { exclude: ['createdAt', 'updatedAt'] },
        include: {
            model: Review,
            attributes: ['rating', 'comment'],
            include: {
                model: User,
                attributes: ['id', 'name']
            }
        }
    })

    res.status(200).send({
        product
    })

})