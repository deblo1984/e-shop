const jwt = require('jsonwebtoken');
const asynHandler = require('express-async-handler');
const ErrorHandler = require('../utils/errorHandler');
const db = require('../models');

exports.isAuthenticated = asynHandler(async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await db.user.findByPk(decode.id, { include: [db.role] });
    if (req.user === null) {
        return next(new ErrorHandler('Invalid token', 401));
    }
    //console.log(req.user)

    next()
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        auth = req.user.roles
        let hasil = []
        for (let i = 0; i < auth.length; i++) {
            //console.log(auth[i].name)
            hasil.push(auth[i].name)
        }
        var intersections = roles.filter(e => hasil.indexOf(e) !== -1);
        //console.log(intersections);
        if (intersections.length <= 0) {
            return next(
                new ErrorHandler(`Role not allowed`, 403))
        }
        next()
    }
}