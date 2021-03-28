const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const db = require('../models');
const generateToken = require('../utils/generateToken');
const { sequelize } = require('../models');
const Role = db.role;
const User = db.user;
const UserAvatar = db.userAvatar;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {

    const t = await sequelize.transaction();
    try {
        // for cloudinary upload purpose
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatar',
            width: 150,
            crop: 'scale'
        })

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }, { transaction: t });

        avatar = await UserAvatar.create({
            userId: user.id,
            publicId: result.public_id,
            url: result.secure_url
        }, { transaction: t })

        const token = generateToken(user.id)

        const options = {
            expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
            httpOnly: true
        }

        if (req.body.roles) {
            roles = await Role.findAll({
                where: {
                    name: { [Op.or]: req.body.roles }
                }
            }, { transaction: t })
            await user.setRoles(roles, { transaction: t })
        } else {
            roles = await Role.findAll({
                where: {
                    name: { [Op.or]: ['user'] }
                }
            }, { transaction: t })
            await user.setRoles(roles, { transaction: t })
        }

        var authorities = [];

        for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].name)
        }

        await t.commit();

        return res.status(200).cookie('token', token, options).send({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: avatar,
            roles: authorities,
            token
        })

    } catch (error) {
        t.rollback();
        return res.status(500).send({ message: 'shit happen' })
    }

})

exports.login = (req, res) => {
    User.findOne({
        where: { email: req.body.email }, attributes: ['id', 'name', 'email', 'password'],
        include: [
            { model: UserAvatar, attributes: ['publicId', 'url'] }
        ]
    }).then(user => {
        //console.log(user);
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
        user.getRoles({ attributes: ['name'] }).then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push(roles[i].name);
            }
            res.status(200).cookie('token', token, options).send({
                success: true,
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.userAvatar,
                roles: authorities,
                token
            })
        })
    }).catch(err => {
        res.status(500).send({ message: 'shit happen' })
    })
}

exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email'],
        include: [
            { model: UserAvatar, attributes: ['publicId', 'url'] }
        ]
    });
    var authorities = [];
    roles = await user.getRoles({ attributes: ['name'] });
    for (let i = 0; i < roles.length; i++) {
        authorities.push(roles[i].name)
    }
    res.status(200).send({
        success: true,
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.userAvatar,
        roles: authorities
    })

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

exports.forgotPassword = asyncHandler(async (req, res) => {

    const resetToken = crypto.randomBytes(20).toString(hex);
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 30 * 60 * 1000;

    await User.update({
        resetPasswordToken,
        resetPasswordExpires
    }, { where: { email: req.body.email } })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;
    const message = `mangga ieu password reset na :\n\n${resetUrl}\n\n
        tong rea lila klik wae lah`;

    try {
        await sendEmail({
            email: req.body.email,
            subject: 'e-shop password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${req.body.email}`
        })

    } catch (error) {
        User.update({
            resetPasswordToken: undefined,
            resetPasswordExpire: undefined
        }, { where: { email: req.body.email } })
        return res.status(500).send({ message: 'shit happens' })

    }
})

