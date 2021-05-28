const passport = require('passport');
const localStrategy = require('./stratagies/local');
const githubStrategy = require('./stratagies/github');
const { User } = require('../../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, done);
});

passport.use(localStrategy);
passport.use(githubStrategy);

module.exports = passport;
