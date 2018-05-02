/**
 * @author Sávio Muniz
 */

var Users = require('../models/user.server.model');
var Customers = require('../models/customer.server.model');
var QueryHelper = require('../utils/query-helper')

exports.getUsersByCustomId = function * (next) {
  var jsonQuery = QueryHelper.getJsonQuery('custom_id', this.query);

  var users = yield Users.getByCustomId(jsonQuery);
  this.status = 200;
  this.body = users;
};

exports.getUser = function *(next) {
  var user = (yield Users.getSingleUser(this.params.userId))[0];

  if (user.role === 'CUSTOMER') {
    var customer = (yield Customers.getForUser(user.id))[0];
    user.customer_id = customer.id;
  }

  this.status = 200;
  this.body = user;
};
