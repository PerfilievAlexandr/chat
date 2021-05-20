const mongoose = require('../libs/mongoose');

const catchLoadByIdErrors = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      ctx.throw(400, 'Invalid ObjectId')
    }

    if (err.name !== 'ValidationError') {
      throw err;
    }

    const error = Object.keys(err.errors).map(key => ({ field: key, error: err.errors[key].message}));
    ctx.status = 400;
    ctx.body = { errors: error }
  }
};

module.exports = {
  catchLoadByIdErrors,
}
