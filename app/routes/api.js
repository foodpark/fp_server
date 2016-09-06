var passport = require('passport');
var api = require('koa')();
var Resteasy = require('koa-resteasy')(require('../../config/knex'));
var RestOptions = require('../rest_options');

api.use(passport.authenticate(['jwt','anonymous'], {session:false}));
/*api.use(function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.body = { status: 401,
                  statusText: 'Authorization Required',
                };
    return;
  } 
});*/

api.use(Resteasy(RestOptions));

module.exports = api;
