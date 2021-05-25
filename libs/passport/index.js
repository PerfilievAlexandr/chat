const passport = require('passport');
const localStrategy = require('./stratagies/local');
const { SignUpUser } = require('../../models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  SignUpUser.findById(id, done);
});

passport.use('local', localStrategy);

module.exports = passport;
