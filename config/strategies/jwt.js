
var passport = require('passport');
var config = require('../config');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../../app/models/user.server.model');

module.exports = function() {
  const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: config.secret,
    };

  const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
    User.getSingleUser(payload.id).asCallback(function(err, users) {
      if (err) {
        return done(err, false);
      }

      var user = users[0];

      if (user) {
        done(null, user);
      } else {
        done(null, {});
      }
    });
  });

  passport.use(jwtLogin);
};

