var knex = require('../../config/knex');
var debug = require('debug')('food_parks.model');

exports.getAllFoodParks = function() {
  return knex('food_parks').select();
};

exports.getSingleFoodPar = function(id) {
  return knex('food_parks').select().where('id', id);
};

exports.getFoodParkCheckins = function(id) {
  return knex.raw(`select units.* from food_park_management fm right join units on fm.unit_id = units.id where fm.food_park_id = ${id};`);
};

exports.getFoodParkUnits = function(id) {
  return knex('food_park_management').where('food_park_id', id);
};

exports.addFoodParkUnits = function(b) {
  return knex('food_park_management').insert(b);
};

exports.removeFoodParkUnits = function(b) {
  return knex('food_park_management').where(b).delete();
};

exports.setManager = function (foodParkId, userId) {
  return knex('food_parks').where('id', foodParkId).update('foodpark_mgr', userId);
};

exports.getAllDrivers = function (foodParkId) {
  return knex.raw(`select users.*, df.available from drivers_foodpark df right join users on df.user_id = users.id where df.food_park_id = ${foodParkId};`);
};

exports.setAvailable = function (foodParkId, driverId, available) {
  console.log('setting availability');
  return knex('drivers_foodpark').update({available : available}).where({food_park_id : foodParkId, user_id : driverId });
};

exports.addDriver = function (driverFoodpark) {
  console.log('adding driver');
  return knex('drivers_foodpark').insert(driverFoodpark);
};

exports.deleteDriver = function (driverFoodpark) {
  console.log('deleting driver');
  return knex('drivers_foodpark').where(driverFoodpark).del();
}

