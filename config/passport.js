var passport = require('passport'),
    User = require ('../app/models/user.server.model');

module.exports = function() {
    const localOptions = { usernameField: 'username' };

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.getSingleUser(id,
            function(err, user) {
                done(err, user);
            }
        );
    });

    require('./strategies/local.js')();
    require('./strategies/jwt.js')();
};
