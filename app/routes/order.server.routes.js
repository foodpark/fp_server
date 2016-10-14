//var Router = require('koa-router');
var order = require('../../app/controllers/order.server.controller');
var Router = require('koa-router');


module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.get(apiversion + '/orders', order.getOrders);

	app.use(router.routes());
  app.use(router.allowedMethods())
};
