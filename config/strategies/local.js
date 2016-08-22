var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require ('../../app/models/user.server.model');

module.exports = function() {
    const localLogin = new LocalStrategy(function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false, {message: 'We could not verify your login details. Really sorry. Please try again.'});}
          if (!User.authenticate(user.password, password)) { return done(null, false, {message: 'Invalid password'});}

          return done(null, user);
        });
    });

    passport.use(localLogin);
};
