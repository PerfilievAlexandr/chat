const User = require('../models/User');

class UsersController {
  async find(ctx) {
    ctx.body = await User.find();
  }

  async findById(ctx) {
    const { id } = ctx.request.params;
    try {
      const user = await User.find({ _id: id });

      if (Array.isArray(user) && !user.length) {
        ctx.body = 'not found';
        ctx.status = 404;
        return;
      }

      ctx.body = user;
    } catch (err) {
      if (err.kind === 'ObjectId') {
        ctx.body = `Если юзера с id: ${id} нет`;
        ctx.status = 404;
        return;
      }

      ctx.body = 'Error 500';
      ctx.status = 500;
    }
  }

  async add(ctx) {
    const { email, displayName } = ctx.request.body;

    try {
      if (email && displayName) {
        ctx.body = await User.create({ email, displayName });
        return;
      }

      ctx.body = `введите email и displayName`;
      ctx.status = 400;

    } catch (err) {
      const error = Object.keys(err.errors).map(key => ({ field: key, error: err.errors[key].message}));
      ctx.status = 400;
      ctx.body = { errors: error }
    }
  }

  async delete(ctx) {
    const { id } = ctx.request.params;

    try {
      const { deletedCount } = await User.deleteOne({ _id: id });

      if (deletedCount === 0) {
        ctx.body = `Если юзера с id: ${id} нет`;
        ctx.status = 404;
        return;
      }

      ctx.body = 'ok';
    } catch (err) {
      if (err.kind === 'ObjectId') {
        ctx.body = `Если юзера с id: ${id} нет`;
        ctx.status = 404;
        return;
      }

      const error = Object.keys(err.errors).map(key => ({ field: key, error: err.errors[key].message}));
      ctx.status = 404;
      ctx.body = { errors: error }
    }
  }

  async update(ctx) {
    const { id } = ctx.request.params;

    const updateData = Object.entries(ctx.request.body).reduce((acc, [key, value]) => {
      return key ? ({ ...acc, [key]: value }) : acc
    }, {});

    try {
      ctx.body = await User.findOneAndUpdate( { _id: id }, updateData, { new: true, runValidators: true});
    } catch (err) {
      console.log('err', err);
      if (err.kind === 'ObjectId') {
        ctx.body = `Если юзера с id: ${id} нет`;
        ctx.status = 404;
        return;
      }

      const error = Object.keys(err.errors).map(key => ({ field: key, error: err.errors[key].message}));
      ctx.status = 404;
      ctx.body = { errors: error }
    }
  }
}

module.exports = new UsersController();
