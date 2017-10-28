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

exports.listFoodParks = * (next) => {
  let foodparks;
  try {
    foodparks = yield FoodPark.getAllFoodParks()
  } catch (err) {
    logger.error('[Error] - Get List of FoodParks')
    throw (err)
  }
  debug(foodparks)
  this.body = foodparks
  return;
}
