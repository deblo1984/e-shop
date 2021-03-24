const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name cannot empty'],
        maxlength: [30, 'Name max length 30 '],
    },
    email: {
        type: String,
        required: [true, 'Enter your email address'],
        unique: true,
        validate: [validator.isEmail, 'Not valid email address']
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        minlength: [6, 'Password minimal 6 character'],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

//compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

//return jwt token
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    });
}

//generate reset password token
userSchema.methods.getResetPasswordToken = function () {
    //generate token 
    const resetToken = crypto.randomBytes(20).toString('hex');
    //hash and set to resetPasswordToken
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    //setToken Exipired time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000

    return resetToken;
}

module.exports = mongoose.model('User', userSchema)