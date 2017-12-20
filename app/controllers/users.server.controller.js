/**
 * @author Sávio Muniz
 */

var Users = require('../models/user.server.model');
var QueryHelper = require('../utils/query-helper')

exports.getUsersByCustomId = function * (next) {
  var jsonQuery = QueryHelper.getJsonQuery('custom_id', this.query);

  var users = yield Users.getByCustomId(jsonQuery);
  this.status = 200;
  this.body = users;
};
