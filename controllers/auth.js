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
    if (ctx.isAuthenticated()) { // return !!ctx.state.user;
      ctx.body = ctx.render('welcome.pug');
    } else {
      ctx.body = ctx.render('login.pug');
    }
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
    const { email, name, password } = ctx.request.body;
    await SignUpUser.remove();

    const newUser = new SignUpUser({ email, name });

    await newUser.setPassword(password);

    await newUser.save();

    ctx.redirect('/login');
  }

  async signIn(ctx, next) {
    await passport.authenticate('local',
      async function(err, user, info) {
      if (err) throw err;

      if (user) {
        try {
          await ctx.login(user);

          ctx.redirect('/')
        } catch (err) {
          throw err;
        }
      } else {
        ctx.status = 401;
        ctx.body = info;
      }
    })(ctx, next);
  }
}

module.exports = new UserController();
