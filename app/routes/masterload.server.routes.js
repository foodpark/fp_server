var Router = require('koa-router');
var config = require('../../config/config');
var masterload = require('../controllers/masterload.server.controller');
var passport = require('koa-passport');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/' + config.apiVersion + '/rel/master_loads/';
  router.get(apiPath, requireJWT, masterload.fetchLoads);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
