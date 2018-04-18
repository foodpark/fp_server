var knex = require('../../config/knex');
// var debug = require('debug')('events.model');

const REQUEST_TABLE = "requests";
const OFFER_TABLE = "offers";
const CUSTOMER_TABLE = "customers";
const COMPANY_TABLE = "companies";

exports.getOffersByRequestId = function(id) {
	return knex(OFFER_TABLE).select().where('request_id', id);
}

exports.getOffersByCustomerId = function(id){
	return knex(OFFER_TABLE).join(REQUEST_TABLE, 'offers.request_id', 'requests.id').select('offers.*').where('requests.customer_id', id);
}

exports.createRequest = function (request) {
	var params = {
					customer_id: request[0],
					request_name: request[1],
					request_photo: request[2],
					category_id: request[3],
					latitude: request[4],
					longitude: request[5],
					description: request[6],
					condition: request[7],
					buy_back_term: request[8]
				};
    return knex(REQUEST_TABLE).insert(params).returning('*');
};

exports.getAllOffers = function (request) {
	var returnArr = [];
	var offersArr = [];
	
	for (var i = request.length - 1; i >= 0; i--) {
		offersArr = knex(OFFER_TABLE).select().where('request_id', request[i].id);
		returnArr.push({"request": request[i], "offers": offersArr});
	}

	return returnArr;
}

exports.updateRequest = function * (request_id, params) {
	return knex(REQUEST_TABLE).where('id', '=', request_id).update(params);
}

exports.getAllRequests =  function(){
	var request_ids = knex(REQUEST_TABLE).select();
	return request_ids;
}

exports.deleteSingleRequest = function(id){
	return knex(REQUEST_TABLE).where('id', '=', id).update({  is_deleted: true});
}

exports.getSingleRequest = function (id) {
    return knex(REQUEST_TABLE).select('id').where('id', id).first();
};

exports.getSingleCustomer = function(id) {
	return knex(CUSTOMER_TABLE).select('id').where('id', id).first();
}

exports.getSingleCompany = function(id){
	return knex(COMPANY_TABLE).select('id').where('id', id).first();
}

exports.getRequestsByCompany = function(id){
	return knex(REQUEST_TABLE).select('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.company_id', id);
}

exports.getOffersByCompany = function(request_ids) {
	var returnArr = [];
	var offersArr = [];
	
	for (var i = request_ids.length - 1; i >= 0; i--) {
		console.log(request_ids[i]);
		offersArr = knex(OFFER_TABLE).select().where('request_id', request_ids[i].id);
		returnArr.push({"request": request_ids[i], "offers": offersArr});
	}

	return returnArr;
}