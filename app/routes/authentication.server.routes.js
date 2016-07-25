var auth = require('../../app/controllers/authentication.server.controller'),
    express = require('express'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });

var REQUIRE_ADMIN     = "Admin",
      REQUIRE_OWNER   = "Owner",
      REQUIRE_SITEMGR = "SiteMgr",
      REQUIRE_MEMBER  = "Member";

module.exports = function(app) {

    app.use('/api', requireAuth );

    app.route('/auth/register')
        .get(auth.renderRegister)
        .post(auth.register);

    app.route('/auth/login')
        .get(auth.renderLogin)
        .post(requireLogin, auth.login);

    app.route('/auth/logout').get(auth.logout);

    app.get('/oauth/facebook', passport.authenticate('facebook', {
      failureRedirect: '/login',
      scope:['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/login',
      successRedirect: '/',
      scope:['email']
    }));
};
