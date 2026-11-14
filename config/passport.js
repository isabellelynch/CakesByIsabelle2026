const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

// How Passport checks a login: find the user by email, then compare the password
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user || !(await user.checkPassword(password))) {
        return done(null, false, { message: 'Incorrect email or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Store only the user's id in the session...
passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

// ...and load the full user (without the password hash) on each request
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select('-password');
    done(null, user || false);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;