const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('express-async-handler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const user = require('../models/user');


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
        return next(new ErrorHandler('Email not found', 401));
    }

    //check if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid password', 401));
    }

    sendToken(user, 200, res)
})

//get currently logged in user details => /api/v1/user
exports.getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
})

//update user profile => /api/v1///user/update

exports.updateProfile = asyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //update avatar todo

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

//update/// change password => /api/v1/user/password
exports.updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    //check previous password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if (!isMatched) {
        return next(new ErrorHandler('old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

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

//forgot password => /api/v1/password/forgot
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('email not found', 401));
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

//reset password  => api/v1/password/reset:token
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user) {
        return next(new ErrorHandler('Password token is invalid or has been expired'), 400);
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

//@admin user routes **
exports.getAllUser = asyncHandler(async (req, res, next) => {

    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
})

//get user details => /api/admin/users/:id

exports.getUserDetails = asyncHandler(async (req, res, next) => {
    const users = await User.findById(req.params.id);

    if (!users) {
        return next(new ErrorHandler('user not found', 401))
    }

    res.status(200).json({
        success: true,
        users
    })
})

//update user by admin => PUT /api/v1/admin/users/:id

exports.updateUser = asyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    //update avatar todo

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })

})

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler('usr not found', 401))
    }

    await user.remove();

    res.status(200).json({
        success: true
    })
})
