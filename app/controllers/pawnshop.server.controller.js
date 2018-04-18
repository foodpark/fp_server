/**
 * @author Sávio Muniz
 */
var auth = require('./authentication.server.controller');
var Pawnshop = require('../models/pawnshop.server.model');
var QueryHelper = require('../utils/query-helper')
var debug   = require('debug')('auth');

exports.getAllRequests = function * (next) {
    var allRequests = (yield Pawnshop.getAllRequests());

    this.status = 200;
    this.body = (yield Pawnshop.getAllOffers(allRequests))
    return;
}

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
        param_array[6] = request.description;
        param_array[7] = request.condition;
        param_array[8] = request.buy_back_term;
        var errors = [];
        var regex = /^[-+]?\d+(\.\d+)?$/;

        if(checkArr.includes(param_array[1])){
            errors.push({ "field": "request_name", "error": "Invalid Request Name Provided"});
        }
        if(checkArr.includes(param_array[2])){
            errors.push({ "field": "request_photo", "error": "Invalid Request Photo Provided"});
        }
        if(checkArr.includes(param_array[3]) || Number.isInteger(param_array[3])){
            errors.push({ "field": "category_id", "error": "Invalid Category Id Provided"});
        }
        if(checkArr.includes(param_array[4]) || !regex.test(param_array[4]) ){
            errors.push({ "field": "latitude", "error": "Invalid Latitude Provided"});
        }
        if(checkArr.includes(param_array[5]) || !regex.test(param_array[5]) ){
            errors.push({ "field": "longitude", "error": "Invalid Longitude Provided"});
        }
        if(checkArr.includes(param_array[7])){
            errors.push({ "field": "Condition", "error": "Invalid Condition Provided"});
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

exports.updateRequest = function * (next){
    var requestCheck = yield getRequest(this.params.request_id);  
    if (!requestCheck) {
        this.status = 404;
        this.body = {error : 'Invalid Request id'};
        return;
    }

    var request = this.body;
    var param_array = [request.customer_id ,request.request_name ,request.request_photo ,request.category_id , request.latitude ,request.longitude,request.description ,request.condition ,request.buy_back_term ];
    var keys_array = [ "customer_id", "request_name", "request_photo", "category_id", "latitude", "longitude", "description", "condition", "buy_back_term"];
    var errors = [];
    var regex = /^[-+]?\d+(\.\d+)?$/;
    var checkArr = [undefined,null,''];

    if(!checkArr.includes(param_array[3]) && Number.isInteger(param_array[3])){
        errors.push({ "field": "category_id", "error": "Invalid Category Id Provided"});
    }
    if(!checkArr.includes(param_array[4]) && !regex.test(param_array[4]) ){
        errors.push({ "field": "latitude", "error": "Invalid Latitude Provided"});
    }
    if(!checkArr.includes(param_array[5]) && !regex.test(param_array[5]) ){
        errors.push({ "field": "longitude", "error": "Invalid Longitude Provided"});
    }

    if(errors.length > 0){
        this.status = 415;
        this.body = {status: false, error : errors};
        return;
    } 

    var passed_arr = [];
    var key = {};
    for (var i = param_array.length - 1; i >= 0; i--) {
        if(!checkArr.includes(param_array[i])) {
            key[keys_array[i]] = param_array[i];
        }
    }

    this.status = 201;
    this.body = (yield Pawnshop.updateRequest(this.params.request_id ,key));
    return;
}

exports.deleteRequest = function * (next){
    var request = yield getRequest(this.params.request_id);  
    if (!request) {
        this.status = 404;
        this.body = {error : 'Invalid Request id'};
        return;
    }

    this.status = 200;
    this.body = (yield Pawnshop.deleteSingleRequest(this.params.request_id));
    return;
}

exports.getOffersByCompany = function * (next) {
    var company = yield getSingleCompany(this.params.company_id);
    if(!company){
        this.status = 404;
        this.body = {error : 'Invalid Company id'};
        return;
    }

    var request_ids = (yield Pawnshop.getRequestsByCompany(this.params.company_id));

    this.status = 200;
    this.body = (yield Pawnshop.getOffersByCompany(request_ids));
    // this.body = request_ids;
    return;
}

// exports.createOffer = function * (next) {
//     var request = this.body;
//     var customer = yield getCustomer(request.customer_id);

//     if(!customer){
//         this.status = 404;
//         this.body = {error: 'Invalid Customer id'};
//         return;
//     }

//     var checkArr = [undefined,null,''];
//     var param_array = [ request.request_id,
//                         request.request_name,
//                         request.company_id,
//                         request.pawn_poc,
//                         request.unit_id,
//                         request.cash_offer,
//                       ];
       
//     if ( param_array.includes(undefined) || param_array.includes(null) || param_array.includes('') ) {          
//         this.status = 415;
//         this.body = {error : 'Missing Required Fields'};
//         return;
//     }else{
//         param_array[6] = request.pawn_name;
//         param_array[7] = request.pawn_address;
//         param_array[8] = request.pawn_phone;
//         param_array[9] = request.buy_back_amount;###
//         param_array[10] = request.tax_amount;###
//         param_array[11] = request.offer_term;
//         param_array[12] = request.offer_accepted;
//         param_array[13] = request.total_redemption;###
//         param_array[14] = request.maturity_date;###
//         param_array[15] = request.interest_rate;###
//         param_array[16] = request.rating;###
//         param_array[17] = request.distance;###

//         var errors = [];
//         var regex = /^[-+]?\d+(\.\d+)?$/;

//         if(checkArr.includes(param_array[0]) || Number.isInteger(param_array[0])){
//             errors.push({ "field": "request_id", "error": "Invalid Request ID Provided"});
//         }
//         if(checkArr.includes(param_array[1])){
//             errors.push({ "field": "request_name", "error": "Invalid Request Name Provided"});
//         }
//         if(checkArr.includes(param_array[2]) || Number.isInteger(param_array[2])){
//             errors.push({ "field": "company_id", "error": "Invalid Company ID Provided"});
//         }
//         if(checkArr.includes(param_array[3])){
//             errors.push({ "field": "pawn_poc", "error": "Invalid Pawn POC Provided"});
//         }
//         if(checkArr.includes(param_array[4]) || Number.isInteger(param_array[4])){
//             errors.push({ "field": "unit_id", "error": "Invalid Unit ID Provided"});
//         }
//         if(checkArr.includes(param_array[5]) || !regex.test(param_array[5]) ){
//             errors.push({ "field": "cash_offer", "error": "Invalid Cash Offer Provided"});
//         }

//         if(checkArr.includes(param_array[9]) && !regex.test(param_array[9]) ){
//             errors.push({ "field": "buy_back_amount", "error": "Invalid Buy Back Amount Provided"});
//         }
//         if(checkArr.includes(param_array[10]) && !regex.test(param_array[10]) ){
//             errors.push({ "field": "tax_amount", "error": "Invalid Tax Amount Provided"});
//         }
//         if(checkArr.includes(param_array[13]) && !regex.test(param_array[13]) ){
//             errors.push({ "field": "total_redemption", "error": "Invalid Total Redemption Provided"});
//         }
//         if(checkArr.includes(param_array[14]) && !regex.test(param_array[14]) ){
//             errors.push({ "field": "maturity_date", "error": "Invalid Maturity Date Provided"});
//         }
//         if(checkArr.includes(param_array[15]) && !regex.test(param_array[15]) ){
//             errors.push({ "field": "interest_rate", "error": "Invalid Interest Rate Provided"});
//         }
//         if(checkArr.includes(param_array[16]) && !regex.test(param_array[16]) ){
//             errors.push({ "field": "rating", "error": "Invalid Rating Provided"});
//         }
//         if(checkArr.includes(param_array[17]) && !regex.test(param_array[17]) ){
//             errors.push({ "field": "distance", "error": "Invalid Distance Provided"});
//         }

//         if(errors.length > 0){
//             this.status = 415;
//             this.body = {status: false, error : errors};
//             return;
//         }

//         var response = yield saveRequest(param_array);
//         this.status = 201;
//         this.body = {message : 'request created', data : response};
//         return;
//     }
// }

function getSingleCompany(company){
    try{
        return Pawnshop.getSingleCompany(company);
    } catch(err) {
        logger.error('Error Getting Company');
        debug('Error Getting company');
        throw(err);
    }
}

function saveRequest(request) {
  try {
      return Pawnshop.createRequest(request);
  } catch (err) {
      logger.error('Error saving request');
      debug('Error saving request');
      throw (err);
  }
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