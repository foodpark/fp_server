var auth = require('./authentication.server.controller');
var Pawnshop = require('../models/pawnshop.server.model');
var Customer = require('../models/customer.server.model');
var Company = require('../models/company.server.model');
var Request = require('../models/request.server.model');
var Offer = require('../models/offer.server.model');
var QueryHelper = require('../utils/query-helper')
var debug   = require('debug')('auth');
var ParseUtils = require('../utils/parseutils');
var logger = require('winston');

exports.getOffersByCompany = function * (next) {
    try {
        var companyCheck = yield Company.getSingleCompany(this.param.company_id);
    } catch (err) {
        logger.error("Invalid Company ID provided. Cannot get offers.");
        this.status = 404;
        this.body = {error: 'Invalid Company ID.'};
        return;
    }
    
    var request_ids = (yield Request.getRequestsByCompany(this.params.company_id));

    this.status = 200;
    this.body = (yield Offer.getOffersByRequest(request_ids));
    return;
}

exports.getOffersByUnit = function * (next) {
    try {
        var companyCheck = yield Company.getSingleCompany(this.param.company_id);
    } catch (err) {
        logger.error("Invalid Company ID provided. Cannot get offers.");
        this.status = 404;
        this.body = {error: 'Invalid Company ID.'};
        return;
    }

    var company_ids = null;
    try{
        company_ids = yield Company.getCompanyByUnit(this.params.company_id ,this.params.unit_id);
    } catch(err) {
        logger.error('Error while retrieving company IDs by Unit.');
        this.status = 404;
        this.body = {error: 'Error while retrieving company IDs by Unit.'};
        return;
    }

    var arrIds = [];
    for (var i = company_ids.length - 1; i >= 0; i--) {
        arrIds.push(company_ids[i].id);
    }

    var request_ids = (yield Request.getRequestsByCompanyMultiple(arrIds));
    this.status = 200;
    this.body = (yield Offer.getOffersByRequest(request_ids));
    return;
}

exports.createOffer = function * (next) {
    var request = this.body;

    var company = null;
    try {
        var company = yield Company.getSingleCompany(request.company_id);
    } catch (err) {
        logger.error("Invalid Company ID provided.");
        this.status = 404;
        this.body = {error: 'Invalid Company ID.'};
        return;
    }

    var pawnPoc = null;
    try {
        pawnPoc = yield Pawnshop.getPawnPoc(request.unit_id);
    } catch (err) {
        logger.error("Invalid Unit ID provided.");
        this.status = 404;
        this.body = {error: 'Invalid Unit ID.'};
        throw(err);
    }

    if(pawnPoc) {
        request.pawn_poc = pawnPoc.username;
    } 

    var errors = validateOfferData(request);
    if (errors.length > 0) {
        this.status = 422; // Unprocessable Entity
        this.body = {status: false, error : errors};
        return;
    }

    request.pawn_name = company[0].name;
    request.pawn_address = company[0].business_address;
    request.pawn_phone = company[0].phone;

    // TODO: Evaluate the proper place to make these validations.
    /*
    var total_days = parseInt(request.offer_term)*30;
    var date = new Date();
    var newDate = new Date(date.setTime( date.getTime() + total_days * 86400000 ));
    request.maturity_date = newDate;

    if(request.buy_back_amount > request.cash_offer) {
        var interest_rate = (1/request.offer_term)*(request.buy_back_amount/request.cash_offer - 1);
        request.interest_rate = interest_rate*100;
    } else {
        this.status = 422; // Unprocessable Entity
        this.body = {status: false, error : { "field": "interest_rate", "error": "Cash offer should be less than buy back amount."}};
        return;
    }
    */

    try {
        var response = yield Offer.createOffer(request);
        this.status = 201;
        this.body = {message : 'Request created.', data : response};
    } catch (err) {
        logger.error('Error saving offer');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error saving offer.'};
        throw (err);
    }
    return;
}

exports.updateOffer = function * (next) {
    var request = this.body;

    try{
        var offerCheck = yield Offer.getSingleOffer(this.params.offer_id);
    } catch(err){
        logger.error('Error while retrieving offer.');
        this.status = 404;
        this.body = {error: 'Invalid Offer ID.'};
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
    this.body = (yield Offer.updateOffer(this.params.offer_id ,key));
    return;
    
}

function validateOfferData(requestBody) {
    var errors = [];

    Object.keys(requestBody).forEach(function eachKey(key) {
        if (typeof requestBody[key] == "undefined" || requestBody[key] == null || requestBody[key] === '') {
            errors.push({ "field": key, "error": "The field is required."});
        } else if (key == "offer_term" || key == "cash_offer"
         || key == "buy_back_amount" || key == "tax_amount"
         || key == "total_redemption" || key == "rating"
         || key == "distance") {
            if (!Number.isFinite(requestBody[key])) {
                errors.push({ "field": key, "error": "Invalid value provided for the field."});
            }
        } else if (key == "request_id" || key == "company_id" || key == "unit_id") {
            if (!Number.isInteger(requestBody[key])) {
                errors.push({ "field": key, "error": "Invalid value provided for the field."});
            }
        }
    });

    return errors;
}

exports.deleteOffer = function * (next) {
    try{
        var offerCheck = yield Offer.getSingleOffer(this.params.offer_id);
    } catch(err){
        logger.error('Error while retrieving offer.');
        this.status = 404;
        this.body = {error: 'Invalid Offer ID.'};
        return;
    } 

    this.status = 200;
    this.body = (yield Offer.deleteSingleOffer(this.params.offer_id));
    return;
}
