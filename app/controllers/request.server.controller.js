var auth = require('./authentication.server.controller');
var Company = require('../models/company.server.model');
var Customer = require('../models/customer.server.model');
var Categories = require('../models/categories.server.model');
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
        var categories = yield Categories.getCategory(request.category_id);
        request.category = categories.category;
        request.category_photo = categories.category_photo;
    } catch (err) {
        logger.error("Invalid Category ID provided. Cannot create request.");
        this.status = 404;
        this.body = {error: 'Invalid Category provided.'};
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
    var requestCheck = yield Request.getRequestByCustomer(this.params.request_id, this.params.customer_id);

    if (!requestCheck) {
        logger.error("Invalid Request data provided. Cannot update the request.");
        this.status = 404;
        this.body = {error: 'Invalid Request data provided. Cannot update the request.'};
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
    var requestData = yield Request.getRequestByCustomer(this.params.request_id, this.params.customer_id);
    
    if (!requestData)
    {
        logger.error("Request not found with the Request ID and Customer ID provided.");
        this.status = 404;
        this.body = {error: 'Request not found with the Request ID and Customer ID provided.'};
        return;
    }
  
    this.status = 200;
    this.body = (yield Offer.getAllOffersByRequest(requestData));
    return;
};

exports.getAllRequestsByCustomerId = function * (next) {
    try {
        var customerCheck = yield Customer.getSingleCustomer(this.params.customer_id);
    } catch (err) {
        logger.error("Invalid Customer ID provided. Cannot get the request.");
        this.status = 404;
        this.body = {error: 'Invalid Customer ID.'};
        return;
    }
  
    try {
        var allRequests = (yield Request.getRequestsByCustomerId(this.params.customer_id)).rows;
        
        this.status = 200;
        this.body = (yield Offer.getAllOffersRequestList(allRequests))
    } catch (err) {
        logger.error('Error getting request by customer ID.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error getting request by customer ID.'};
        throw (err);
    }
    return;
}

exports.deleteRequest = function * (next){
    var requestCheck = yield Request.getRequestByCustomer(this.params.request_id, this.params.customer_id);

    if (!requestCheck) {
        logger.error("Invalid Request data provided. Cannot delete the request.");
        this.status = 404;
        this.body = {error: 'Invalid Request data provided. Cannot delete the request.'};
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