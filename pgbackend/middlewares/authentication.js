const jwt = require('jsonwebtoken');
const asynHandler = require('express-async-handler');
const ErrorHandler = require('../utils/errorHandler');
const db = require('../models');

exports.isAuthenticatedUser = asynHandler(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await db.user.findByPk(decode.id);

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) not allowed`, 403))
        }
        next()
    }
}