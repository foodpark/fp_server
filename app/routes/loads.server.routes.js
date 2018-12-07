var Router = require('koa-router');
var config = require('../../config/config');
var loads = require('../controllers/loads.server.controller');
var passport = require('koa-passport');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/' + config.apiVersion + '/rel/loads/';
  // router.put(apiPath + ':churchId', requireJWT, churches.updateChurch);
  router.get(apiPath, requireJWT, loads.fetchLoads);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
