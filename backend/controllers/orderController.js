const db = require('../models');
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');

const { sequelize } = require('../models');
const { getPagination } = require('../utils/pagination');

const Order = db.order;
const OrderItems = db.orderItems;
const Product = db.product;
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const id = uuidv4();
    const t = await sequelize.transaction();
    const {
        address,
        phone,
        postalCode,
        province,
        country,
        itemsPrice,
        taxPrice,
        shippingPrice,
        orderStatus
    } = req.body;

    const userId = req.user.id;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;
    const orderItems = req.body.orderItems;

    try {
        const order = await Order.create({
            id, address, phone, postalCode, province, country, itemsPrice,
            taxPrice, shippingPrice, totalPrice, orderStatus, userId
        }, { transaction: t });

        for (let i = 0; i < orderItems.length; i++) {
            await OrderItems.create({
                orderId: id,
                quantity: orderItems[i].quantity,
                price: orderItems[i].price,
                total: orderItems[i].price * orderItems[i].quantity,
                productId: orderItems[i].productId,
            }, { transaction: t })
        }
        await t.commit();

        return res.status(201).send({
            success: true,
            message: 'Berhasil berhasil uhuuuuyy'
        })
    } catch (error) {
        console.log(error.message);
        await t.rollback();
        return res.status(500).send({
            message: 'shit happen'
        })
    }
})

exports.findAll = (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);

    Order.findAndCountAll({
        distinct: true, order: [['created_at', 'desc']], limit, offset,
        include: [{
            model: OrderItems, required: true, separate: true,
            attributes: { exclude: ['createdAt', 'updatedAt', 'orderId'] },
            include: [{ model: Product, attributes: ['name', 'id'] }]
        }, { model: User, attributes: ['id', 'name'] }]
    })
        .then(data => {
            const { count: totalItems, rows: orders } = data;
            const currentPage = page ? +page : 1;
            const totalPages = Math.ceil(totalItems / limit);

            res.status(200).send({
                totalItems,
                orders,
                totalPages,
                currentPage
            })
        }).catch(err => {
            res.status(500).send({
                message: 'shit happens'
            })
        })
}

exports.findOne = (req, res) => {
    Order.findByPk(req.params.id,
        {
            include: [{
                model: OrderItems, include: [{ model: Product }]
            }, { model: User }],
        }).then(order => {
            res.status(200).send({
                success: true,
                order
            })
        }).catch(err => {
            console.log(err.message);
            res.status(500).send({
                success: false,
                message: 'shit happen'
            })
        })
}

exports.updateDelivered = (req, res) => {
    Order.findByPk(req.params.id,
        {
            include: [{
                model: OrderItems, include: [{ model: Product }]
            }, { model: User }]
        }).then(order => {
            if (order.orderStatus === 'Delivered') {
                return res.send({
                    message: 'Order has been delivered'
                })
            }
            //console.log(order)
            Order.update({ orderStatus: 'Delivered' }, {
                where: { id: req.params.id }
            })
            //console.log(order.orderItems)
            order.orderItems.forEach(item => {
                //console.log(item.productId)
                Product.findByPk(item.productId)
                    .then(product => {
                        const value = product.stock - item.quantity;
                        console.log(product.stock)
                        Product.update({ stock: value }, { where: { id: product.id } })
                    }).catch(err => {
                        res.status(500).send({
                            message: 'shit happen'
                        })
                    })
            })
            res.status(200).send({
                success: true
            })
        }).catch(err => {
            console.log(err.message);
            res.status(500).send({
                success: false,
                message: 'shit happen'
            })
        })
}

function updateStock(id, quantity) {
    Product.findByPk(id, { attributes: ['id', 'stock', 'name'] })
}