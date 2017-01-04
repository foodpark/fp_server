//var Router = require('koa-router');
var payment = require('../../app/controllers/payment.server.controller');
var push = require('../../app/controllers/push.server.controller');
var Router = require('koa-router');


module.exports=function(app) {
	var router = new Router();

  /*
	router.post('/oauth/payment/token', payment.createCheckout);
	router.get('/oauth/push/sendPush', push.sendPush);
  */ 
	
	app.use(router.routes());
  app.use(router.allowedMethods())
};
