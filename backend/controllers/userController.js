const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');


//register user => /api/v1/users/register
exports.registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'svdt8ocmiucedxcafs2o',
            url: 'https://res.cloudinary.com/dscvv9wpd/image/upload/v1615904616/svdt8ocmiucedxcafs2o.png'
        }

    })

    sendToken(user, 200, res)
})

//login user => /api/v1/login   
exports.loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    //check email and password enter by user
    if (!email || !password) {
        return next(new ErrorHandler('email or password cannot be empty', 400));
    }
    //find user email in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Email not found'), 401);
    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid password'), 401);
    }

    sendToken(user, 200, res)
})

//logout user   => /api/v1/logout
exports.logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out'
    })
})

exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('email not found'), 401);
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false })

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\n
        tong rea lila klik wae lah`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'e-shop password recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500))

    }
})