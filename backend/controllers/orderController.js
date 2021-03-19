const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const user = require('../models/user');

//create new order => /api/v1/order/create
exports.CreateOrder = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo

    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})

//get single order => /api/v1/admin/order/details/:id
exports.getUserOrderDetails = asyncHandler(async (req, res, next) => {
    const order = await Order.find({ _id: req.params.id, user: req.user.id }).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler('Order not found', 404))
    }

    res.status(200).json({
        success: true,
        order
    })


})

//get logged in user order => /api/v1/order/user
exports.getUserListOrder = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })


})

//@admin
//get all orders
//@ /api//v1/admin/orders
exports.getOrderList = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

//@admin
//get details order
//@ /api/v1/admin/orders/:id

exports.getOrderDetails = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(ErrorHandler('Order not found', 401))
    }

    res.status(200).json({
        success: true,
        order
    })
})

//@admin
// update order proccess
//@ /api/v1/admin/order/:id
exports.updateOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id)

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('You have already delivered this order', 400))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
        order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    product.stock = product.stock - quantity;

    await product.save({ validateBeforeSave: false })
}

//@admin
// delete order 
//@ /api/v1/admin/order/:id

exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(ErrorHandler('Order not found', 400));
    }

    await order.remove();

    res.status(200).json({
        success: true
    })
})
