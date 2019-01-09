var Router = require('koa-router');
var config = require('../../config/config');
var passport = require('koa-passport');
var podmanager = require('../controllers/podmanager.server.controller');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();

  var apiPath = '/api/' + config.apiVersion + '/rel';
  router.use(passport.authenticate(['jwt'], {session:false}));
  
  router.get(apiPath + '/food_parks/:foodParkId/podmanagers', requireJWT, podmanager.getPodManagersInMainHub);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
