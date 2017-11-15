var knex = require('../../config/knex');
var debug = require('debug')('food_parks.model');

exports.getAllFoodParks = function() {
  return knex('food_parks').select();
};

exports.getSingleFoodPar = function(id) {
  return knex('food_parks').select().where('id', id);
};

exports.getFoodParkCheckins = function(id) {
  return knex.raw(`select u.id, u.name, u.type, u.company_id from units as u inner join
    (select distinct unit_id from checkins where food_park_id = ${id}) as c
    on u.id = c.unit_id`);
}

exports.getFoodParkUnits = function(id) {
  return knex('food_park_management').where('id_food_park', id);
}

exports.addFoodParkUnits = function(b) {
  return knex('food_park_management').insert(b);
}

exports.removeFoodParkUnits = function(b) {
  return knex('food_park_management').where(b).delete();
}

