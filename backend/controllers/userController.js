const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');
const { sequelize } = require('../models');
const db = require('../models');
const Role = db.role;
const User = db.user;
const UserAvatar = db.userAvatar;
const Op = db.Sequelize.Op;

exports.create = asyncHandler(async (req, res) => {

    const t = await sequelize.transaction();
    try {

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }, { transaction: t });

        if (req.body.avatar !== '') {
            // for cloudinary upload purpose
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatar',
                width: 150,
                crop: 'scale'
            })

            avatar = await UserAvatar.create({
                userId: user.id,
                publicId: result.public_id,
                url: result.secure_url
            }, { transaction: t })
        }
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
            roles: authorities,
            token
        })

    } catch (error) {
        t.rollback();
        console.log(error);
        return res.status(500).send({
            message: 'shit happen',
        })
    }

})

/*exports.update = (req, res) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    try {
        const user = await User.update({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }, { transaction: t });

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

        if (req.body.avatar !== '') {
            // for cloudinary upload purpose
            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatar',
                width: 150,
                crop: 'scale'
            })

            avatar = await UserAvatar.create({
                userId: user.id,
                publicId: result.public_id,
                url: result.secure_url
            }, { transaction: t })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'shit happen'
        })
    }

}
*/

exports.update = asyncHandler(async (req, res) => {
    const t = await sequelize.transaction();
    try {

    } catch (error) {
        t.rollback();
        console.log(error);
        return res.send({
            success: false,
            message: 'shit happens'
        })

    }
    const user = await User.findByPk(req.user.id, { transaction: t });
    await user.removeRoles({ transaction: t });
    await user.update(req.body, { where: { id: req.user.id } })
    if (req.body.roles) {
        roles = await Role.findAll({
            where: {
                name: { [Op.or]: req.body.roles }
            }
        })
        await user.setRoles(updatedRoles)
    } else {
        roles = await Role.findAll({
            where: {
                name: { [Op.or]: ['user'] }
            }
        })
        await user.setRoles(roles)
    }
    return res.status(201).send({
        success: true,
        message: 'user has been updated'
    })
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

    const resetToken = crypto.randomBytes(20).toString('hex');
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

        return res.status(201).json({
            success: true,
            message: `email sent to ${req.body.email}`
        })

    } catch (error) {
        console.log(error)
        User.update({
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, { where: { email: req.body.email } })
        return res.status(500).send({ message: 'shit happens' })

    }
})

exports.resetPassword = asyncHandler(async (req, res) => {
    //not implemented yet
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        where: {
            [Op.and]: [
                { resetPasswordToken },
                { resetPasswordExpires: { [Op.gt]: Date.now() } }
            ]
        }
    })

    if (!user) {
        return res.status(404).send({
            success: false,
            message: 'user not found'
        })
    }

    if (!req.body.password && !req.body.confirmPassword) {
        return res.send({
            message: 'password cannot be blank'
        })
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(404).send({
            success: false,
            message: 'password not match'
        })
    }

    try {
        await User.update({
            resetPasswordToken: null,
            resetPasswordExpires: null,
            password: bcrypt.hashSync(req.body.password, 8)
        }, {
            where: {
                [Op.and]: [
                    { resetPasswordToken: resetPasswordToken },
                    { resetPasswordExpires: user.resetPasswordExpires }
                ]
            }
        })

        res.status(201).send({
            success: true,
            message: 'Password has been change'
        })

    } catch (error) {
        console.log(error);
        res.send({
            success: false,
            message: 'cannot change password at the moment'
        })
    }

})

