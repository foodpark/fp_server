var square = require('../controllers/square.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

var requireLogin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    var router = new Router();
    var apiversion = '/api/'+ config.apiVersion + '/square';

    router.post(apiversion + '/:userId', square.setupToken);

    router.param('userId', square.setUser);

    app.use(router.routes());
    app.use(router.allowedMethods());
};
