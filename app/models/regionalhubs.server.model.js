var knex  = require('../../config/knex');
var debug = require('debug')('regionalhubs.model');

exports.getAllRegionalHubs= function() {
  return knex('regionalhubs').select();
};

exports.getRegionalHub = function(id) {
  return knex('regionalhubs').select().where('id', id);
};

exports.getRegionalHubBasedOnMainHub = function(mainHubId) {
  return knex('regionalhubs').select().where('food_park_id', mainHubId);
}
