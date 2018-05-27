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

exports.getRequestsByCompanyContractNotApproved = function(id){
	return knex.raw("SELECT requests.* FROM requests " +
						"WHERE requests.id IN " +
						"(SELECT DISTINCT offers.request_id FROM offers " + 
							"WHERE offers.company_id=" + id + " AND request_id IN " +
								"(SELECT DISTINCT offers.request_id FROM offers WHERE offers.is_deleted=false " +
									"AND request_id NOT IN " + 
										"(SELECT DISTINCT request_id FROM offers WHERE offers.contract_approved=true)))");
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

exports.getRequestByCustomer = function (request_id, customer_id) {
	return knex(REQUEST_TABLE).select('*').where('id', request_id).andWhere('is_deleted', false)
			.andWhere('customer_id', customer_id).first();
};

exports.getRequestsByCustomerId = function (customer_id) {
	return knex.raw("SELECT requests.* FROM requests " +
						"WHERE requests.customer_id=" + customer_id + " AND requests.is_deleted=false AND requests.id NOT IN " + 
   							"(SELECT DISTINCT offers.request_id AS id FROM offers " +
	   							"WHERE offers.is_deleted=false AND offers.contract_approved=true)");
}	

exports.getRequestByCustomerContractApproved = function (customer_id) {
	return knex(REQUEST_TABLE).join(OFFER_TABLE, 'offers.request_id', 'requests.id')
			.where('requests.customer_id', customer_id).andWhere('requests.is_deleted', false)
			.andWhere('contract_approved', true);
}

exports.getRequestsByCompanyContractApproved = function(id){
	return knex(REQUEST_TABLE).join(OFFER_TABLE, 'offers.request_id', 'requests.id')
			.where('offers.company_id', id).andWhere('requests.is_deleted', false)
			.andWhere('contract_approved', true);
}