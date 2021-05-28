const GithubStrategy = require('passport-github').Strategy;
const { User } = require('../../../models/User');
const config = require('config');

module.exports = new GithubStrategy(
  {
    clientID: config.get('providers.github.appId'),
    clientSecret: config.get('providers.github.appSecret'),
    callbackURL: `${config.get('server.site.host')}:${config.get('server.site.port')}/oauth/github`,
    scope: [ 'user:email' ],
  }, async (accessToken, refreshToken, profile, done) => {
    if (!profile.emails || !profile.emails.length) {
      return done(null, false, {message: 'Нет email!'});
    }
    const email = profile.emails[0].value;

    User.findOne({ email }, async (err, user) => {
      if (err) {
        return done(err)
      }

      if (!user) {
        try {
          await User.remove();

          const newUser = User.create({
            email,
            name: profile.displayName,
            providers: [{ id: 'github' }]
          });

          done(null, newUser, { message: 'Добро пожаловать'})
        } catch (err) {
          console.error(err);
          return done(err);
        }
      } else {
        if (user.providers.find(({ id }) => id === 'github')) {
          done(null, user, { message: 'Добро пожаловать'})
        } else {
          user.providers.push({ id: 'github', profile: user });
        }
      }
    });
  })
