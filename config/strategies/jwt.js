
var passport = require('passport'),
    config = require('../config'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require ('../../app/models/user.server.model');


module.exports = function() {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeader(),
      secretOrKey: config.secret
    };

    const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
      User.getSingleUser(payload._id, function(err, user) {
        if (err) { return done(err, false); }
        if (user) {
          done(null, user);
        } else {
          done(null, false);
        }
      });
    });

    passport.use(jwtLogin);
};
