var Router = require('koa-router');
var config = require('../../config/config');
var loads = require('../controllers/loads.server.controller');
var passport = require('koa-passport');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/' + config.apiVersion + '/rel';
  
  router.get(apiPath + '/loads/', requireJWT, loads.fetchLoads);
  router.get(apiPath + '/churches/:churchId/loads', requireJWT, loads.fetchPodLoads);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
