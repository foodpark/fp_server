var User = require('../models/user.server.model');
var FoodPark = require('../models/foodpark.server.model');
var auth = require('./authentication.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var debug = require('debug')('storefront');
var _ = require('lodash');
var logger = require('winston');

const getErrorMessage = (err) => {
  let message = '';
  for (let errName in err.errors) {
    if (err.errors[errName].message)
      message = err.errors[errName].message;
  }
  return message;
};

const sendErrorResponse = (err, res, status) => {
  if (!status) status = 500
  return res.status(status).send({
    'error': err
  })
};

exports.getFoodParkCheckins = function * (id, next) {
  var user = this.passport.user

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
