const db = require('../models');
const asyncHandler = require('express-async-handler');
const { parse: uuidParse } = require('uuid');
const { sequelize } = require('../models');
const Review = db.review;
const Product = db.product;

exports.create = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    const { rating, comment, productId } = req.body;
    const isReviewed = await Review.findOne({
        where: { productId: req.body.productId, userId: req.user.id }
    });
    try {
        if (isReviewed) {
            await Review.update({
                rating: Number(rating),
                comment
            }, {
                where: { productId: req.body.productId, userId: req.user.id }
            },
                { transaction: t }
            )
        } else {
            await Review.create({
                rating: Number(rating),
                comment,
                productId: uuidParse(productId),
                userId: uuidParse(req.user.id),

            }, { transaction: t }
            )
        }

        const ratingAverage = await Review.findAll({
            attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'rating']],
            where: { productId: productId }, raw: true
        }, { transaction: t })

        const reviewCount = await Review.count({ where: { productId: productId } },
            { transaction: t })

        await Product.update({
            numOfReviews: reviewCount,
            rating: Number(ratingAverage[0].rating)
        }, { where: { id: productId } },
            { transaction: t }
        )

        await t.commit();

        return res.status(201).send({
            success: 'true',

        })

    } catch (error) {
        console.log(error);
        await t.rollback();
        res.status(500).send({
            message: 'shit happen'
        })
    }
})

exports.delete = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    const { reviewId, productId } = req.query
    if (!reviewId || !productId) {
        return res.status(401).send({ message: 'params is empty' });
    }
    await Review.destroy({
        where: { id: req.query.reviewId }
    })

    const ratingAverage = await Review.findAll({
        attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'rating']],
        where: { productId: productId }, raw: true
    })
    const reviewCount = await Review.count({
        where: { productId: productId }
    });

    await Product.update({
        numOfReviews: reviewCount,
        rating: Number(ratingAverage[0].rating)

    }, { where: { id: productId } });

    res.status(201).send({
        success: true
    })
})

