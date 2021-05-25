const LocalStrategy = require('passport-local');
const { SignUpUser } = require('../../../models/User')

module.exports = new LocalStrategy(
  {
  usernameField: 'email',
  passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await SignUpUser.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Нет пользователя с таким email' });
      }

      const isValidPassword = await user.checkPassword(password);

      if (!isValidPassword) {
        return done(null, false, { message: 'Пароль не верный' });
      }

      return done(null, user, { message: 'Добро пожаловать' })
    } catch (err) {
      console.error(err);
      done(err);
    }
  })
