var knex = require('../../config/knex');
var debug = require('debug')('loads.model');


exports.getAllLoads = function(id) {
  return knex('loads');
}
