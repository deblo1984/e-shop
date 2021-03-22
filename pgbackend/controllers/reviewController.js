const db = require('../models');
const asyncHandler = require('express-async-handler');
const { parse: uuidParse } = require('uuid');
const Op = db.Sequelize.Op;
const Review = db.review;
const Product = db.product;

exports.create = asyncHandler(async (req, res) => {
    const { rating, comment, productId } = req.body;
    const isReviewed = await Review.findAll({
        where: { productId: req.body.productId, userId: req.user.id }
    });
    console.log(isReviewed);
    if (isReviewed.length > 0) {
        return res.status(200).send({ message: 'you already reviewed this product' });
    }
    await Review.create({
        rating: Number(rating),
        comment,
        productId: uuidParse(productId),
        userId: uuidParse(req.user.id),

    })
    const reviewCount = await Review.count({ where: { product_id: productId } })
    const ratingTotal = await Product.findByPk(productId, { attributes: ['rating'] })

    await Product.update({
        numOfReviews: reviewCount,
        rating: (ratingTotal.rating + rating) / reviewCount
    }, { where: { id: productId } })

    return res.status(201).send({
        success: 'true',
    })


})