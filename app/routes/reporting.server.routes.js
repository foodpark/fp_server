var Router = require('koa-router');
var config = require('../../config/config');
var passport = require('koa-passport');
var reports = require('../controllers/reporting.server.controller');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();

  var apiPath = '/api/' + config.apiVersion + '/rel';
  router.use(passport.authenticate(['jwt'], {session:false}));
  // <baseurl>/api/<version>/rel/food_parks/30125/reports?start=123456.78&end=123458.78
  router.get(apiPath + '/food_parks/:foodParkId/reports', requireJWT, reports.getFoodParkReport);
  router.get(apiPath + '/territories/:territoryId/graphreports', requireJWT, reports.getTerritoryReport);
  

  app.use(router.routes());
  app.use(router.allowedMethods());
};
