var auth = require('./authentication.server.controller');
var Company = require('../models/company.server.model');
var Customer = require('../models/customer.server.model');
var Request = require('../models/request.server.model');
var Offer = require('../models/offer.server.model');
var debug   = require('debug')('auth');
var logger = require('winston');
var ParseUtils = require('../utils/parseutils');

exports.createRequest = function * (next) {
    var request = this.body;
    request.customer_id = this.params.customer_id;

    try {
        var customer = yield Customer.getSingleCustomer(request.customer_id);
    } catch (err) {
        logger.error("Invalid Customer ID provided. Cannot create request.");
        this.status = 404;
        this.body = {error: 'Invalid Customer ID.'};
        return;
    }

    var errors = validateRequestData(request);
    if (errors.length > 0) {
        this.status = 422; // Unprocessable Entity
        this.body = {status: false, error : errors};
        return;
    }
   
    try {
        var response = yield Request.createRequest(request);
        this.status = 201;
        this.body = {message : 'Request created.', data : response};
    } catch (err) {
        logger.error('Error saving request.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error saving the request.'};
        throw (err);
    }
    return;
}

exports.updateRequest = function * (next) {
    try {
        var requestCheck = yield Request.getSingleRequest(this.params.request_id);
    } catch (err) {
        logger.error("Invalid Request ID provided. Cannot update the request.");
        this.status = 404;
        this.body = {error: 'Invalid Request ID.'};
        return;
    }
    
    var request = this.body;
    var errors = validateRequestData(request);
    if (errors.length > 0) {
        this.status = 422; // Unprocessable Entity
        this.body = {status: false, error : errors};
        return;
    }
   
    try {
        var response = yield Request.updateRequest(this.params.request_id, request);
        this.status = 201;
        this.body = {message : 'Request updated.', data : response};
    } catch (err) {
        logger.error('Error updating request.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error saving the request.'};
        throw (err);
    }
    return;


    this.status = 201;
    this.body = (yield Request.updateRequest(this.params.request_id ,key));
    return;
}

function validateRequestData(requestBody) {
    var errors = [];

    Object.keys(requestBody).forEach(function eachKey(key) {
        if (typeof requestBody[key] == "undefined" || requestBody[key] == null || requestBody[key] === '') {
            errors.push({ "field": key, "error": "The field is required."});
        } else if (key == "latitude" || key == "longitude") {
            if (!Number.isFinite(requestBody[key])) {
                errors.push({ "field": key, "error": "Invalid value provided for the field."});
            }
        } else if (key == "category_id") {
            if (!Number.isInteger(requestBody[key])) {
                errors.push({ "field": key, "error": "Invalid value provided for the field."});
            }
        }
    });

    return errors;
}

exports.getRequestsById = function * (next) {
    try {
        var requestCheck = yield Request.getSingleRequest(this.params.request_id);
    } catch (err) {
        logger.error("Invalid Request ID provided. Cannot update the request.");
        this.status = 404;
        this.body = {error: 'Invalid Request ID.'};
        return;
    }
  
    this.status = 200;
    this.body = (yield Offer.getOffersByRequestId(this.params.request_id));
    return;
};

exports.getRequestsByCustomerId = function * (next) {
    try {
        var customerCheck = yield Customer.getSingleCustomer(this.params.customer_id);
    } catch (err) {
        logger.error("Invalid Customer ID provided. Cannot get the request.");
        this.status = 404;
        this.body = {error: 'Invalid Customer ID.'};
        return;
    }
  
    try {
        var allRequests = (yield Request.getRequestByCustomerId(this.params.customer_id)).rows;
        
        this.status = 200;
        this.body = (yield Offer.getAllOffers(allRequests))
    } catch (err) {
        logger.error('Error getting request by customer ID.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error getting request by customer ID.'};
        throw (err);
    }
    return;
}

exports.deleteRequest = function * (next){
    try {
        var requestCheck = yield Request.getSingleRequest(this.params.request_id);
    } catch (err) {
        logger.error("Invalid Request ID provided. Cannot delete the request.");
        this.status = 404;
        this.body = {error: 'Invalid Request ID.'};
        return;
    }

    try {
        this.status = 200;
        this.body = (yield Request.deleteSingleRequest(this.params.request_id));
    } catch (err) {
        logger.error('Error deleting request.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error deleting request.'};
        throw (err);
    }
    return;
}

exports.getRequestsContractApprovedByCompany = function * (next) {
    try {
        var companyCheck = yield Company.getSingleCompany(this.params.company_id);
    } catch (err) {
        logger.error("Invalid Company ID provided. Cannot get offers.");
        this.status = 404;
        this.body = {error: 'Invalid Company ID.'};
        return;
    }
  
    try {
        this.status = 200;
        this.body = (yield Request.getRequestsByCompanyContractApproved(this.params.company_id));
    } catch (err) {
        logger.error('Error getting request by company ID.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error getting request by company ID.'};
        throw (err);
    }
    return;
}

exports.getRequestsContractApprovedByCustomer = function * (next) {
    try {
        var customerCheck = yield Customer.getSingleCustomer(this.params.customer_id);
    } catch (err) {
        logger.error("Invalid Customer ID provided. Cannot get the request.");
        this.status = 404;
        this.body = {error: 'Invalid Customer ID.'};
        return;
    }
  
    try {
        this.status = 200;
        this.body = (yield Request.getRequestByCustomerContractApproved(this.params.customer_id));
    } catch (err) {
        logger.error('Error getting request by customer ID.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error getting request by customer ID.'};
        throw (err);
    }
    return;
}