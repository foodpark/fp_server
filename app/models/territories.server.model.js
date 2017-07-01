var knex  = require('../../config/knex');
var debug = require('debug')('territories.model');

exports.getAllTerritories = function() {
  return knex('territories').select();
};

exports.getSingleTerritory = function(id) {
  return knex('territories').select().where('id', id);
};
