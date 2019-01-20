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
  router.get(apiPath + '/foodparks/:mainHubId/loads', requireJWT, loads.fetchFoodParkLoads);
  router.get(apiPath + '/regionalhubs/:regionalHubId/loads', requireJWT, loads.fetchRegionalHubLoads);
  router.get(apiPath + '/churches/:churchId/available_loads', requireJWT, loads.fetchAvailablePodLoads);
  
  app.use(router.routes());
  app.use(router.allowedMethods());
};
