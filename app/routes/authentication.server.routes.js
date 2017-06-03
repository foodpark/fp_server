var auth = require('../../app/controllers/authentication.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');

var requireAuth = passport.authenticate('jwt', { session: false });
var requireLogin = passport.authenticate('local', { session: false });


module.exports = function(app) {
  var router = new Router();

  router.get('/auth/register', auth.renderRegister);
  router.post('/auth/register', auth.register);

  router.get('/auth/login', auth.renderLogin);
  router.post('/auth/login', requireLogin, auth.login);

  router.get('/auth/logout', auth.logout);

  router.get('/auth/fbRegister', auth.fbRegister);
  router.get('/auth/fb', auth.fbAuth);

  router.get('/oauth/facebook', passport.authenticate('facebook', {
      failureRedirect: '/login',
      scope:['email'],
    }));

  router.get('/oauth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/login',
    successRedirect: '/',
    scope:['email'],
  }));

  app.use(router.routes())
  app.use(router.allowedMethods())
};
