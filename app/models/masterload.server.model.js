var knex = require('../../config/knex');
var debug = require('debug')('master_loads.model');


exports.getAllMasterLoads = function(id) {
  return knex('master_loads');
}

exports.getDonations = function(masterLoadId) {
  return  knex('donation_orders').where('master_load_id', masterLoadId);
}
