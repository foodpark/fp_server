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
  this.foodpark.unit_id = id;
  yield next;
}

exports.getFoodParkCheckins = function * (next) {
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
  var unit_id = this.body.unit_id

  if (!id || isNaN(id)) {
    this.status = 400;
    return
  }

  if (unit_id === undefined) {
    this.status = 400;
    return
  }

  debug('authorized...')
  debug('addFoodParkUnits')
  debug('id ' + id)

  var b = {
    unit_id: unit_id,
    food_park_id: id
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
  var unit_id = this.params.unitId

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

  if (!unit_id || isNaN(unit_id)) {
    this.status = 400;
    return
  }

  try {
    b = {'food_park_id': id, 'unit_id': unit_id}
    console.log(b)
    let msg = yield FoodPark.removeFoodParkUnits(b)
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

exports.setDriverToOrder = function *(next) {
  var user = this.passport.user;
  var food_park_id = this.params.foodparkId;
  var order_id = this.params.orderId;
  var driver_id = this.body.driver_id;

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401
    return
  }

  if (driver_id === undefined || driver_id === null || isNaN(driver_id)) {
    this.status = 400;
    return;
  }

  try {
    this.body = yield OrderHistory.updateOrder(order_id ,{'driver_id': driver_id});
  } catch(err) {
    console.error('error seting driver by foodpark manager');
    throw(err);
  }

  return;
};

exports.getDriverByOrder = function *(next) {
  var user = this.passport.user;
  var food_park_id = this.params.foodparkId;
  var order_id = this.params.orderId;
  var driver_id = this.params.driverId;

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401
    return
  }

  if (!food_park_id || isNaN(food_park_id)) {
    this.status = 400;
    return;
  }

  if (!order_id || isNaN(order_id)) {
    this.status = 400;
    return;
  }

  if (!driver_id || isNaN(driver_id)) {
    this.status = 400;
    return;
  }

  try {
    this.body = yield OrderHistory.getDriverActiveOrders([parseInt(driver_id, 10)]);
  } catch(err) {
    console.error('error get driver by foodpark manager');
    throw(err);
  }

  return;
};
