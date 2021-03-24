const { check, validationResult } = require('express-validator');

exports.validateProduct = [
    check('name').not().isEmpty().withMessage('Product name required').bail(),
    check('description').not().isEmpty().withMessage('Description required').bail(),
    check('categoryId').not().isEmpty().withMessage('Category required').bail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(422).json({ errors: errors.array() });
        next();
    }
]