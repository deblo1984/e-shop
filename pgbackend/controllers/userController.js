const asyncHandler = require('express-async-handler');
const db = require('../models');
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name, email, password
    })
    res.status(201).json({
        success: true
    })
})
