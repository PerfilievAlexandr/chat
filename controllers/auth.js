const passport = require('../libs/passport')
const { SignUpUser } = require('../models/User');

class UserController {
  renderRegistration(ctx) {
    ctx.body = ctx.render('registration.pug')
  }

  renderLogin(ctx) {
    ctx.body = ctx.render('login.pug')
  }

  renderPrivate(ctx) {
    ctx.body = ctx.render('index.pug')
  }

  async getUsers(ctx) {
    ctx.body = await SignUpUser.find();
  }

  async logout(ctx) {
    ctx.logout();

    ctx.redirect('/login');
  };

  async delete(ctx) {
    const {id} = ctx.request.params;

    const {deletedCount} = await SignUpUser.deleteOne({_id: id});

    if (deletedCount === 0) {
      ctx.body = `Если юзера с id: ${id} нет`;
      ctx.status = 404;
      return;
    }

    ctx.body = 'ok';
  }

  async signUp(ctx) {
    const {email, name, password} = ctx.request.body;
    await SignUpUser.remove();

    const newUser = new SignUpUser({ email, name });

    await newUser.setPassword(password);

    ctx.body = await newUser.save();
  }

  async signIn(ctx, next) {
    await passport.authenticate('local', (err, user, info) => {

      if (err) {
        return next(err);
      }

      if (!user) {
        return ctx.redirect('/login');
      }

      ctx.logIn(user, (err) => {
        if (err) {
          return next(err);
        }

        console.log('++++++');

        return ctx.redirect('/');
      });
    })(ctx, next);
  }
}

module.exports = new UserController();
