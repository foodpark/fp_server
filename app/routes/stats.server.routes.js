/**
 * @author Sávio Muniz
 */

var stats = require('../../app/controllers/stats.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');

const STATS_ENDPOINT = '/api/'+ config.apiVersion + '/stats/';

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports=function(app) {
  var router = new Router();

  router.get(STATS_ENDPOINT + 'company/:companyId/sum', stats.getVendorOrderCount);
  router.get(STATS_ENDPOINT + 'support/sum', stats.getSupportOrderCount);

  router.get(STATS_ENDPOINT + 'company/:companyId/percentage', stats.getVendorOrderPercentage);
  router.get(STATS_ENDPOINT + 'support/percentage', stats.getSupportOrderPercentage);


  app.use(router.routes());
  app.use(router.allowedMethods());
};
