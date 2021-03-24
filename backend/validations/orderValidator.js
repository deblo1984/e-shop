const { check, validationResult } = require('express-validator');

exports.validateOrder = [
    check('address').not().isEmpty().withMessage('Address cannot null').bail(),
    check('phone').not().isEmpty().withMessage('Phone number required ').bail(),
    check('city').not().isEmpty().withMessage('City is required').bail(),
    check('province').not().isEmpty().withMessage('Province is required').bail(),
    check('country').not().isEmpty().withMessage('Country is required').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]