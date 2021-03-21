const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const sendToken = require('../utils/sendToken');
const db = require('../models');
const User = db.user;

exports.create = asyncHandler(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })
    res.status(201).json({
        success: true
    })
})

exports.login = asyncHandler(async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user === null) {
        res.status(401)
        throw new Error('email not found');
    }
    //compare password
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
        return res.status(401).json({
            token: null,
            message: 'Invalid password'
        })
    };

    sendToken(user, 201, res);

})

exports.logout = asyncHandler(async (req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})