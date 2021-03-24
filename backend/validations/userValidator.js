const { check, validationResult } = require('express-validator');

exports.validateUser = [
    check('name').not().isEmpty().withMessage('User cannot be empty').bail(),
    check('email').not().isEmpty().isEmail().withMessage('Invalid email address').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]