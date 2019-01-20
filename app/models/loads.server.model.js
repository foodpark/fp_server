var knex = require('../../config/knex');
var debug = require('debug')('loads.model');


exports.getAllLoads = function(id) {
  return knex('loads');
}

exports.getAvailableLoadsForPod = function(churchId) {
  let customQuery = `select distinct(loads.id), loads.name, loads.created_at, loads.updated_at, loads.church_id, loads.status, loads.driver_id, loads.driver_name from loads inner join churches on churches.id = loads.church_id and churches.id = ${churchId} WHERE NOT EXISTS (select load_id as id from donation_orders where loads.id = donation_orders.load_id)`;
  return knex.raw(customQuery);
}

exports.getAllLoadsForRegionalHub = function(regionalHubId) {
  let customQuery = `select distinct(loads.id), loads.name, loads.created_at, loads.updated_at, loads.church_id, loads.status, loads.driver_id, loads.driver_name from loads inner join churches on churches.id = loads.church_id and churches.regional_hub_id = ${regionalHubId} WHERE NOT EXISTS (select load_id as id from donation_orders where loads.id = donation_orders.load_id)`;
  return knex.raw(customQuery);
}

exports.getAllLoadsForMainHub = function(mainHubId) {
  let customQuery = `select loads.* from loads inner join churches on churches.id = loads.church_id and churches.main_hub_id = ${mainHubId}`;
  return knex.raw(customQuery);
}

exports.getLoadsForPod = function(churchId) {
  return knex('loads').select().where('church_id', churchId);
}

exports.getAllLoadItems = function(loadId) {
  return knex('load_items').select().where('load_id', loadId);
}

exports.getPallets = function(loadId) {
  return knex('load_items').select().where('load_id', loadId).where('load_type', "PALLET");
}

exports.getBoxes = function(loadId) {
  return knex('load_items').select().where('load_id', loadId).where('load_type', "BOX");
}

exports.getItems = function(loadId) {
  return knex('load_items').select().where('load_id', loadId).where('load_type', "ITEM");
}
