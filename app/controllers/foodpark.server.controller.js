var User = require('../models/user.server.model');
var FoodPark = require('../models/foodpark.server.model');
var auth = require('./authentication.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var debug = require('debug')('storefront');
var OrderHistory  = require('../models/orderhistory.server.model');
var _ = require('lodash');
var logger = require('winston');

exports.getFoodPark = function * (id, next) {
  this.foodpark = {id: id};
  yield next;
}

exports.getFoodParkUnitId = function * (id, next) {
  this.foodpark.id_units = id;
  yield next;
}

exports.getFoodParkCheckins = function * (next) {
  console.log('aqui')
  var user = this.passport.user
  var id = this.foodpark.id

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401
    return
  }

  debug('authorized...')
  debug('getFoodParkCheckins')
  debug('id ' + id)

  if (!id || isNaN(id)) {
    this.status = 400;
    return
  }

  try {
    var units = yield FoodPark.getFoodParkCheckins(id)
    this.body = units.rows;
  } catch (err) {
    console.error('error getting foodpark checkins')
    throw(err)
  }

  debug(units.rows)
  return;
}

exports.getFoodParkUnits = function * (id, next) {
  var user = this.passport.user
  var id = this.foodpark.id

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401
    return
  }

  debug('authorized...')
  debug('getFoodParkCheckins')
  debug('id ' + id)

  if (!id || isNaN(id)) {
    this.status = 400;
    return
  }

  try {
    var units = yield FoodPark.getFoodParkUnits(id)
    this.body = units.rows;
  } catch (err) {
    console.error('error getting foodpark units')
    throw(err)
  }

  debug(units.rows)
  return;
}

exports.addFoodParkUnits = function * (id, next) {
  var user = this.passport.user

  if (!user || !user.role == 'FOODPARKMGR' || !user.role == 'UNITMGR') {
    this.status = 401
    return
  }

  if (!this.body) {
    this.status = 400;
    return
  }

  var id = this.foodpark.id
  var id_unit = this.body.id_unit

  if (!id || isNaN(id)) {
    this.status = 400;
    return
  }

  if (id_unit === undefined) {
    this.status = 400;
    return
  }

  debug('authorized...')
  debug('addFoodParkUnits')
  debug('id ' + id)

  var b = {
    id_unit: id_unit,
    id_food_park: id
  }

  try {
    yield FoodPark.addFoodParkUnits(b)
  } catch (err) {
    console.error('error adding foodpark units')
    throw(err)
  }

  return
}

exports.removeFoodParkUnits = function * (id, next) {
  var user = this.passport.user
  var id = this.foodpark.id
  var id_units = this.foodpark.id_units

  if (!user || !user.role == 'FOODPARKMGR' || !user.role == 'UNITMGR') {
    this.status = 401
    return
  }

  debug('authorized...')
  debug('addFoodParkUnits')
  debug('id ' + id)

  if (!id || isNaN(id)) {
    this.status = 400;
    return
  }

  if (!id_units || isNaN(id_units)) {
    this.status = 400;
    return
  }

  try {
    b = {'id_food_park': id, 'id_units': id_units}
    yield FoodPark.removeFoodParkUnits(b)
    this.body = {"message": "successfully deleted"};
  } catch (err) {
    console.error('error removing foodpark units')
    throw(err)
  }

  return
}


exports.getUnitsActiveOrders = function * (next) {
  var user = this.passport.user;
  var food_park_id = this.params.foodParkId;

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401
    return
  }

  debug('authorized...');
  debug('getUnitsActiveOrders');

  if (!food_park_id || isNaN(food_park_id)) {
    this.status = 400;
    return;
  }

  try {
    debug('getActiveOrders');

    var units = yield FoodPark.getFoodParkCheckins(food_park_id);
    var response = [];
    
    logger.info(user);
    
    for (var i in units.rows) {
      let unit = units.rows[i];
      unit.orders = yield OrderHistory.getActiveOrders(unit.company_id, unit.id);
      response.push(unit);
    };
    
    this.body = response;
  } catch (err) {
    console.error('error getting foodpark active units orders');
    throw(err);
  }

  return;
};
