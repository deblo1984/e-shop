const { check, validationResult } = require('express-validator');

exports.validateCategory = [
    check('name').not().isEmpty().withMessage('Category name required').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]