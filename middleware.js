const { itemSchema } = require('./schemas.js');
const AppError = require('./AppError');


module.exports.validateItem = (req, res, next) => {
    const { error } = itemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400)
    } else {
        next()
    }
}