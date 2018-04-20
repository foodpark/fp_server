/**
 * @author Sávio Muniz
 */
var users = require('../controllers/users.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/'+ config.apiVersion + '/rel/users/';

  router.get(apiPath + 'custom_id/', users.getUsersByCustomId);
  router.get(apiPath + ':userId', users.getUser);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
