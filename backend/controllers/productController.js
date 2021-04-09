const db = require('../models');
const asyncHandler = require('express-async-handler');
const { getPagination } = require('../utils/pagination');
const cloudinary = require('cloudinary')
const { sequelize } = require('../models');

const Product = db.product;
const Photo = db.photo;
const Review = db.review;
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            publicId: result.public_id,
            url: result.secure_url
        })
    }

    const {
        name,
        description,
        price,
        stock,
    } = req.body
    const userId = req.user.id
    const photo = imagesLinks;
    //console.log(photo[0].publicId)

    const t = await sequelize.transaction();

    try {
        const product = await Product.create({
            name, description, price, stock, userId
        }, /*{
            include: [Photo]
        },*/ { transaction: t })
        //console.log(product)
        for (let i = 0; i < photo.length; i++) {
            await Photo.create({
                publicId: photo[i].publicId,
                url: photo[i].url,
                productId: product.id

            }, { transaction: t })
        }

        await t.commit();

        return res.status(201).json({
            success: true,
            product: product
        })
    } catch (error) {
        //console.log(error);
        await t.rollback
        return res.status(500).send({
            success: false,
            message: error
        })
    }
})

exports.findAll = (req, res) => {

    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAndCountAll({
        distinct: true, order: [['created_at', 'desc']], where: condition, limit, offset,
        include: { model: Photo, required: true, separate: true },
    })
        .then(data => {
            //const response = getPagingData(products, page, limit);
            const { count: productsCount, rows: products } = data;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(productsCount / limit);
            res.send({
                success: true,
                productsCount,
                limit,
                products,
                totalPages,
                currentPage
            });
        }).catch(err => {
            res.status(500).send({
                message: 'awww shit happen'
            })
        })
}

exports.adminFindAll = asyncHandler(async (req, res) => {
    const { page, size, name } = req.query;
    const { limit, offset } = getPagination(page, size);
    const condition = name ? { name: { [Op.like]: `%${name}%` } } : null;

    Product.findAndCountAll({
        distinct: true, order: [['created_at', 'desc']], where: condition, limit, offset,
        include: { model: Photo, required: true, separate: true },
    })
        .then(data => {
            //const response = getPagingData(products, page, limit);
            const { count: productsCount, rows: products } = data;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(productsCount / limit);
            res.send({
                success: true,
                productsCount,
                limit,
                products,
                totalPages,
                currentPage
            });
        }).catch(err => {
            res.status(500).send({
                message: 'awww shit happen'
            })
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

    const product = await Product.findByPk(req.params.id, {
        include: [{ model: Photo }]
    })

    if (product.photos.length > 0) {
        for (let i = 0; i < product.photos.length; i++) {
            const deleted = await cloudinary.v2.uploader.destroy(product.photos[i].publicId)
        }
    }

    const result = await Product.destroy({
        where: { id: req.params.id }
    })
    if (result) {
        res.status(201).send({
            success: true,
            message: 'Product deleted'
        })
    } else {
        res.status(400).send({
            success: false,
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