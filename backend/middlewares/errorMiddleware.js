const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        })
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err }

        error.message = err.message

        //wrong mongoose objectId error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`
            error = new ErrorHandler(message, 400)
        }

        //handling mongoose validation error
        if (err.name === 'ValidationError') {
            const message = 'Json Web Token invalid';
            error = new ErrorHandler(message, 400)
        }

        //handling mongoose duplicate error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }

        //Handling wrong jwt error
        if (err.name === 'JsonWebTokenError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(messsage, 400)
        }

        //Handling Expired jwt error
        if (err.name === 'TokenExpiredError') {
            const message = 'Json Web Token is Expired';
            error = new ErrorHandler(messsage, 400)
        }


        res.status(err.statusCode).json({
            success: false,
            message: error.message || 'Internal server error'
        })
    }
}