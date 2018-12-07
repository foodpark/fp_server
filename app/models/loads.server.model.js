var knex = require('../../config/knex');
var debug = require('debug')('loads.model');


exports.getAllLoads = function(id) {
  return knex('loads');
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
