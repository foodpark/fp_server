var knex = require('../../config/knex');
var debug = require('debug')('food_parks.model');

exports.getAllFoodParks = function() {
  return knex('food_parks').select();
};

exports.getSingleFoodPar = function(id) {
  return knex('food_parks').select().where('id', id);
};
