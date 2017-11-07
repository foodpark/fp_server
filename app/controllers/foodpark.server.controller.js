var User = require('../models/user.server.model');
var FoodPark = require('../models/foodpark.server.model');
var auth = require('./authentication.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var debug = require('debug')('storefront');
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


