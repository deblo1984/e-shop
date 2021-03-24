const asyncHandler = require('express-async-handler');
const { sequelize } = require('../models');
const db = require('../models');
const Photo = db.photo;

exports.create = asyncHandler(async (req, res) => {
    const { publicId, url, isMain } = req.body;
    const result = await Photo.create({
        publicId,
        url,
        isMain,
        productId: req.params.id
    })


    if (!result) {
        res.status(404).send({
            success: false,
            message: 'failed upload photo'
        })
    }

    res.status(201).send({
        success: true
    })
})

exports.setMain = asyncHandler(async (req, res) => {
    const { isMain } = req.body
    const t = await sequelize.transaction();
    try {
        await Photo.update({
            isMain: false
        },
            { where: { productId: req.body.productId } },
            { transaction: t });

        await Photo.update({
            isMain: true
        },
            { where: { id: req.params.id } },
            { transaction: t })
        await t.commit();
    } catch (err) {
        console.log(error);
        res.status(401).send({ message: 'error updating photo' })
        await t.rollback();
    }
    res.status(201).send({
        success: true
    })
})