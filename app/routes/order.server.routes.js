//var Router = require('koa-router');
var orders = require('../../app/controllers/order.server.controller');
var config = require('../../config/config');
var Router = require('koa-router');
var passport = require('passport');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/ord';

	router.get(apiversion + '/companies/:companyId/units/:unitId/active_orders', requireJWT, orders.getActiveOrders);
	router.get(apiversion + '/companies/:companyId/units/:unitId/closed_orders', requireJWT, orders.getClosedOrders);
	
  router.param('companyId', orders.getCompany);
  router.param('unitId', orders.getUnit);

	router.get(apiversion + '/customers/:customerId/active_orders', requireJWT, orders.getCustomerActiveOrders);
	router.get(apiversion + '/customers/:customerId/closed_orders', requireJWT, orders.getCustomerClosedOrders);
	
	router.param('customerId', orders.getCustomer);

	app.use(router.routes());
  app.use(router.allowedMethods())
};
