const User = require('../models/User');
const mongoose = require('../libs/mongoose');

class UsersController {
  async find(ctx) {
    ctx.body = await User.find();
  }

  async findById(ctx) {
    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      ctx.throw(400, 'Invalid ObjectId')
    }

    const user = await User.findById(ctx.params.id);

    if (Array.isArray(user) && !user.length) {
      ctx.body = 'not found';
      ctx.status = 404;
      return;
    }

    ctx.body = user;
  }

  async add(ctx) {
    const { email, displayName } = ctx.request.body;

    ctx.body = await User.create({ email, displayName });
  }

  async delete(ctx) {
    const { id } = ctx.request.params;

    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      ctx.throw(400, 'Invalid ObjectId')
    }

    const { deletedCount } = await User.deleteOne({ _id: id });

    if (deletedCount === 0) {
      ctx.body = `Если юзера с id: ${id} нет`;
      ctx.status = 404;
      return;
    }

    ctx.body = 'ok';
  }

  async update(ctx) {
    const { id } = ctx.params;

    if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
      ctx.throw(400, 'Invalid ObjectId')
    }

     ctx.body = await User.findOneAndUpdate(
       { _id: id },
       ctx.request.body,
       { new: true, runValidators: true },
     );
  }
}

module.exports = new UsersController();
