var Router = require('koa-router');
var config = require('../../config/config');
// var churches = require('../controllers/churches.server.controller');
var passport = require('koa-passport');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/' + config.apiVersion + '/rel/churches/';
  // router.put(apiPath + ':churchId', requireJWT, churches.updateChurch);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
