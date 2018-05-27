var knex = require('../../config/knex');
// var debug = require('debug')('events.model');

const REQUEST_TABLE = "requests";
const OFFER_TABLE = "offers";

exports.createRequest = function (request) {
    return knex(REQUEST_TABLE).insert(request).returning('*');
};

exports.updateRequest = function * (request_id, params) {
	return knex(REQUEST_TABLE).where('id', '=', request_id).update(params);
}

exports.deleteSingleRequest = function(id){
	return knex(REQUEST_TABLE).where('id', '=', id).update({is_deleted: true});
}

exports.getSingleRequest = function (id) {
    return knex(REQUEST_TABLE).select('id').where('id', id).first();
};

exports.getRequest = function (id) {
    return knex(REQUEST_TABLE).select('*').where('id', id).first();
};

exports.getRequestsByCompany = function(id){
	return knex(REQUEST_TABLE).distinct('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.company_id', id).andWhere('requests.is_deleted', false);
}

exports.getRequestsByCompanyMultiple = function(ids){
	return knex(REQUEST_TABLE).distinct('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.company_id','in' , ids);
}

exports.getRequestsByOffer = function(offer_id) {
	return knex(REQUEST_TABLE).distinct('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.id', offer_id);
}

exports.getRequestsByOfferList = function(offer_list) {
	var returnArr = [];
	
	for (var i = 0; i < offer_list.length; i++) {
		var requestArr = knex(REQUEST_TABLE).select().where('id', offer_list[i].request_id).first();
		returnArr.push({"request": requestArr, "offers": offer_list[i]});
	}

	return returnArr;
}

exports.getRequestByCustomerId = function (customer_id) {
    return knex(REQUEST_TABLE).where('customer_id', customer_id).andWhere('is_deleted', false);
};