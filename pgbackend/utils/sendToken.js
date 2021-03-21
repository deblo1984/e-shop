const generateToken = require('./generateToken');

//create and send token save in cookie
const sendToken = (user, statusCode, res) => {
    const token = generateToken(user.id);

    //options for cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken