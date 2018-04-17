/**
 * @author Sávio Muniz
 */
var auth = require('./authentication.server.controller');
var Pawnshop = require('../models/pawnshop.server.model');
var QueryHelper = require('../utils/query-helper')
var debug   = require('debug')('auth');

exports.getRequestsById = function * (next) {
  var request = yield getRequest(this.params.request_id);  
  if (!request) {
    this.status = 404;
    this.body = {error : 'Invalid Request id'};
    return;
  }
  
  this.status = 200;
  this.body = (yield Pawnshop.getOffersByRequestId(this.params.request_id));
  return;
};

exports.getRequestsByCustomerId = function * (next) {
    var customer = yield getCustomer(this.params.customer_id);

    if(!customer){
        this.status = 404;
        this.body = {error: 'Invalid Customer id'};
        return;
    }

    this.status = 200;
    this.body = (yield Pawnshop.getOffersByCustomerId(this.params.customer_id))
    return;
}

function getRequest(id) {
  try {
    return Pawnshop.getSingleRequest(id);
  }
  catch (err) {
    logger.error('Error while retrieving request');
    debug('Error while retrieving request');
    throw (err);
  }
}

function getCustomer(id) {
  try {
    return Pawnshop.getSingleCustomer(id);
  }
  catch (err) {
    logger.error('Error while retrieving request');
    debug('Error while retrieving request');
    throw (err);
  }
}

exports.createRequest = function * (next) {
    var request = this.body;
    var customer = yield getCustomer(request.customer_id);

    if(!customer){
        this.status = 404;
        this.body = {error: 'Invalid Customer id'};
        return;
    }

    var checkArr = [undefined,null,''];
    var param_array = [request.customer_id ,request.request_name ,request.request_photo ,request.category_id , request.latitude ,request.longitude ];
       
    if ( param_array.includes(undefined) || param_array.includes(null) || param_array.includes('') ) {          
        this.status = 415;
        this.body = {error : 'All Fields are Required'};
        return;
    }else{
        var errors = [];
        var regex = /^[-+]?\d+(\.\d+)?$/;

        if(checkArr.includes(param_array[1])){
            errors.push({ "field": "request_name", "error": "Invalid Request Name Provided"});
        }else if(checkArr.includes(param_array[2])){
            errors.push({ "field": "request_photo", "error": "Invalid Request Photo Provided"});
        }else if(checkArr.includes(param_array[3]) || Number.isInteger(param_array[3])){
            errors.push({ "field": "category_id", "error": "Invalid Category Id Provided"});
        }else if(checkArr.includes(param_array[4]) || !regex.test(param_array[4]) ){
            errors.push({ "field": "latitude", "error": "Invalid Latitude Provided"});
        }else if(checkArr.includes(param_array[5]) || !regex.test(param_array[5]) ){
            errors.push({ "field": "longitude", "error": "Invalid Longitude Provided"});
        }

        if(errors.length > 0){
            this.status = 415;
            this.body = {status: false, error : errors};
            return;
        }

        var response = yield saveRequest(param_array);
        this.status = 201;
        this.body = {message : 'request created', data : response};
        return;
    }
};

function saveRequest(request) {
  try {
      return Pawnshop.createRequest(request);
  } catch (err) {
      logger.error('Error saving request');
      debug('Error saving request');
      throw (err);
  }
}