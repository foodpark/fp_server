var knex = require('../../config/knex');
var debug = require('debug')('master_loads.model');


exports.getAllMasterLoads = function() {
  return knex('master_loads');
}

exports.getMasterLoadsInMainHub = function(mainHubId) {
  return knex('master_loads').where('main_hub_id', mainHubId);
}

exports.getMasterLoad = function(load_name, main_hub_id) {
  return knex('master_loads').where('name', load_name).andWhere('main_hub_id', main_hub_id);
}

exports.createMasterLoad = function (load) {
  return knex('master_loads').insert(load).returning('*');
};

exports.deleteMasterLoad = function(masterLoadID) {
  return knex('master_loads').where('id', masterLoadID).del();
}

exports.getDonations = function(masterLoadId) {
  return  knex('donation_orders').where('master_load_id', masterLoadId);
}
