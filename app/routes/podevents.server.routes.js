/**
 * @author Sávio Muniz
 */

var events = require('../controllers/podevents.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

module.exports = function (app) {
    var router = new Router();
    var apiPath = '/api/' + config.apiVersion + '/rel/podevents/';

    router.post(apiPath, events.createEvent);

    app.use(router.routes());
    app.use(router.allowedMethods());
};
