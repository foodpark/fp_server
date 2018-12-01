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
    var units = yield FoodPark.getFoodParkUnits(id);
    this.body = units.rows;
  } catch (err) {
    console.error('error getting foodpark units')
    throw(err)
  }

  debug(units.rows)
  return;
}

exports.getFoodParkCompanies = function * (next) {
  var user = this.passport.user
  var foodParkId = this.params.foodParkId;

  if (!user || !user.role === 'FOODPARKMGR') {
    this.status = 401;
    return
  }

  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return
  }

  try {
    var companies = yield FoodPark.getFoodParkCompanies(foodParkId);
    this.body = companies.rows;
  } catch (err) {
    console.error('error getting foodpark companies');
    throw(err)
  }

  debug(companies.rows);
};

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
  var foodParkId = this.params.foodParkId;
  var unit_id = this.params.fpUnitId;

  if (!user || !user.role == 'FOODPARKMGR' || !user.role == 'UNITMGR') {
    this.status = 401
    return
  }

  debug('authorized...')
  debug('addFoodParkUnits')
  debug('id ' + foodParkId)

  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return
  }

  console.log(unit_id);

  if (!unit_id || isNaN(unit_id)) {
    this.status = 400;
    return
  }

  try {
    b = {'food_park_id': foodParkId, 'unit_id': unit_id}
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

    var units = yield FoodPark.getFoodParkUnits(food_park_id);
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

exports.setAvailable = function * (next) {
    var user = this.passport.user;
    var foodParkId = this.params.foodParkId;
    var driverId = this.params.userId;

    var driver = yield User.getSingleUser(driverId);

    var available = this.body.available;

    if (!user || !user.role === 'FOODPARKMGR') {
      this.status = 401;
      return;
    }

    if (!driver || driver[0].role !== 'DRIVER') {
      this.status = 400;
      this.body = {message : 'invalid driver'};
      return;
    }

    try {
      var drivers = yield FoodPark.setAvailable(foodParkId, driverId, available);
      this.body = {message : 'update was successful'};
    } catch (err) {
      console.error ('failed on getting drivers');
      this.body = 'failed on getting drivers';
      throw(err);
    }
};

exports.getDrivers = function * (next) {
    var foodParkId = this.params.foodParkId;
    var user = this.passport.user;

    if (!user || user.role !== 'FOODPARKMGR' && user.role !== 'ADMIN' && user.role != 'HUBMGR') {
        this.status = 401;
        return;
    }

    try {
      var drivers = yield FoodPark.getAllDrivers(foodParkId);
      this.body = drivers.rows;
    } catch (err) {
      console.error ('failed on getting drivers');
      this.body = 'failed on getting drivers';
      throw(err);
    }
};

exports.addDriver = function * (next) {
    var foodParkId = this.params.foodParkId;
    var user = this.passport.user;

    var driverId = this.body.user_id;

    var driver = yield User.getSingleUser(driverId);

    if (!user || user.role !== 'FOODPARKMGR' && user.role !== 'ADMIN') {
        this.status = 401;
        return;
    }

    if (!driver || driver[0].role !== 'DRIVER') {
        this.status = 400;
        this.body = {message : 'invalid driver'};
        return;
    }

    try {
        var foodpark_driver = {
            user_id : driverId,
            food_park_id : foodParkId
        };

        yield FoodPark.addDriver(foodpark_driver);
        this.status = 200;
        this.body = { message : 'driver-foodpark relationship created!', data : driver};

    } catch (err) {
        console.error('failed to create driver');
        this.body = {message : 'failed to create driver'};
        throw(err);
    }
}
;

exports.getUser = function * (id, next) {
    this.user = {id: id};
    yield next;
};

exports.deleteDriver = function * (next, req) {
    var foodParkId = this.params.foodParkId;
    var user = this.passport.user;

    var driverId = this.params.userId;
    var driver = yield User.getSingleUser(driverId);

    if (!user || user.role !== 'FOODPARKMGR') {
        this.status = 401;
        return;
    }

    if (!driverId || driver[0].role !== 'DRIVER') {
        this.status = 400;
        this.body = {message : 'invalid driver'};
        return;
    }

    try {
        var deleteDriverRelationship = { food_park_id : foodParkId, user_id : driverId};
        var deleted = yield FoodPark.deleteDriver(deleteDriverRelationship);
        this.body = {message : 'deleted successfully'};
        return;
    } catch (err) {
        console.error('failed to delete driver');
        this.body = {message : 'failed to delete driver'};
        throw(err);
    }
};

exports.getDriverByOrder = function *(next) {
  var user = this.passport.user;
  var food_park_id = this.params.foodparkId;
  var order_id = this.params.orderId;
  var driver_id = this.params.driverId;

  if (!user || !user.role == 'FOODPARKMGR') {
    this.status = 401;
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
