/**
 * @author Sávio Muniz
 */
var pawnshop = require('../controllers/pawnshop.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/'+ config.apiVersion + '/rel/';

  router.get(apiPath + 'requests/:request_id/', pawnshop.getRequestsById);
  router.get(apiPath + 'customers/:customer_id/requests', pawnshop.getRequestsByCustomerId)
  router.post(apiPath + 'requests/create', pawnshop.createRequest)

  app.use(router.routes());	
  app.use(router.allowedMethods());
};
