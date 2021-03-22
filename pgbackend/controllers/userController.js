const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const db = require('../models');
const generateToken = require('../utils/generateToken');
const Role = db.role;
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    })

    if (req.body.roles) {
        roles = await Role.findAll({
            where: {
                name: { [Op.or]: req.body.roles }
            }
        })
        await user.setRoles(roles)
        return res.status(201).json({
            success: true,
            message: 'user was registered succesfully'
        })
    } else {
        await user.setRoles([1])
        return res.status(201).json({
            success: true,
            message: 'user was registered succesfully'
        })
    }

})

exports.login = (req, res) => {
    User.findOne({
        where: { email: req.body.email }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: 'Email not found' })
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        )
        if (!passwordIsValid) {
            return res.status(404).send({ message: 'invalid password' })
        }
        const token = generateToken(user.id);
        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push('ROLE_' + roles[i].name.toUpperCase());
            }
            res.status(200).cookie('token', token, options).send({
                success: true,
                id: user.id,
                name: user.name,
                email: user.email,
                roles: authorities,
                token
            })
        })
    }).catch(err => {
        res.status(500).send({ message: err.message })
    })
}

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