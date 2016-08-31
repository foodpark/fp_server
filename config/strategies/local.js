var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require ('../../app/models/user.server.model');

module.exports = function() {
    const localLogin = new LocalStrategy(function(username, password, done) {
        console.log('logging in user '+ username)
        User.getUserByUsername(username, function(err, results) {
          if (err) {
            console.error('error during login: '+ err)
            return done(err);
          }
          var user = results[0]
          console.log(user)
          if (!user) {
            console.error('error during login: could not find user')
            return done(null, false, {message: 'We could not verify your login details. Really sorry. Please try again.'});
          }
          if (!User.authenticate(user.password, password)) {
            console.error('error during login: authentication failed')
            return done(null, false, {message: 'Invalid password'});
          }
          this.user = user
          return done(null, user);
        });
    });

    passport.use(localLogin);
};
