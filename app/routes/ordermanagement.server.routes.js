var Router = require('koa-router');
var config = require('../../config/config');
var passport = require('koa-passport');
var ordermanagement = require('../controllers/ordermanagement.server.controller');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();

  var apiPath = '/api/' + config.apiVersion + '/rel';
  router.use(passport.authenticate(['jwt'], {session:false}));
  
  router.get(apiPath + '/food_parks/:foodParkId/ordermanagement', requireJWT, ordermanagement.getMainHubOrderManagementDetails);
  router.get(apiPath + '/churches/:churchId/ordermanagement', requireJWT, ordermanagement.getPodOrderManagementDetails);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
