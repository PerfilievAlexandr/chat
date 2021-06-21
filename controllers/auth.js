const config = require('config');
const uuid4 = require('uuid4');

const passport = require('../libs/passport')
const sendMail = require('../libs/sendMail')
const { User } = require('../models/User');

class UserController {
  renderRegistration(ctx) {
    ctx.body = ctx.render('registration.pug')
  }

  renderLogin(ctx) {
    ctx.body = ctx.render('login.pug')
  }

  renderPrivate(ctx) {
    if (ctx.isAuthenticated()) {
      ctx.body = ctx.render('chat.pug');
    } else {
      ctx.body = ctx.render('login.pug');
    }
  }

  async getUsers(ctx) {
    ctx.body = await User.find();
  }

  async logout(ctx) {
    ctx.logout();
    ctx.redirect('/login');
  };

  async delete(ctx) {
    const {id} = ctx.request.params;

    const { deletedCount } = await User.deleteOne({ _id: id });

    if (deletedCount === 0) {
      ctx.body = `Если юзера с id: ${id} нет`;
      ctx.status = 404;
      return;
    }

    ctx.body = 'ok';
  }

  async confirmEmail(ctx) {
    const { verifyEmailToken } = ctx.request.params;
    const user = await User.findOne({ verifyEmailToken });

    if (!user) {
      ctx.throw(404, 'Ссылка подтверждения недействительна или устарела.');
    }

    if (!user.verifiedEmail) {
      user.verifiedEmail = true;
    }

    user.verifyEmailToken = null;

    await user.save();

    await ctx.login(user);

    ctx.redirect('/');
  }

  async signUp(ctx) {
    const { email, name, password } = ctx.request.body;
    const verifyEmailToken = uuid4();

    try {
      const newUser = new User({
        email,
        name,
        verifyEmailToken,
        verifiedEmail: false,
      });

      await newUser.setPassword(password);

      await newUser.save();

      await sendMail({
        subject : 'Please confirm your Email account',
        to: 'perfiliev29@yandex.ru',
        name: 'Alexandr',
        link: `${config.get('server.site.host')}:${config.get('server.site.port')}/confirm/${verifyEmailToken}`,
      });

      ctx.redirect('/login');
    } catch (err) {
      if (err.name === 'ValidationError') {
        let errorMessages = '';
        for(let key in err.errors) {
          errorMessages += `${key}: ${err.errors[key].message}<br>`;
        }
        ctx.flash('error', errorMessages);
        ctx.redirect('/registration');
      } else {
        throw err;
      }
    }

  }

  async signIn(ctx, next) {
    await passport.authenticate('local',
      async (err, user, info) => {
      if (err) throw err;

        try {
          await ctx.login(user);

          ctx.flash('success', info.message);
          ctx.redirect('/')
        } catch (err) {
          ctx.flash('error', info.message);
          ctx.redirect('/login');
        }
    })(ctx, next);
  }

  async signInGithub(ctx, next) {
    await passport.authenticate('github',
      async (err, user, info) => {
        if (err) throw err;

        if (user) {
          try {
            await ctx.login(user);

            ctx.flash('success', info.message);
            ctx.redirect('/')
          } catch (err) {
            throw err;
          }
        } else {
          ctx.flash('error', info.message);
          ctx.redirect('/login');
        }
      })(ctx, next);
  }

  async githubLogin(ctx, next) {
    passport.authenticate('github', config.get('providers.github.passportOptions'))(ctx, next);
  }
}

module.exports = new UserController();
