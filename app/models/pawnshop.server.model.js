var knex = require('../../config/knex');
// var debug = require('debug')('events.model');

const REQUEST_TABLE = "requests";
const OFFER_TABLE = "offers";
const CUSTOMER_TABLE = "customers";

exports.getOffersByRequestId = function(id) {
	return knex(OFFER_TABLE).select().where('request_id', id);
}

exports.getOffersByCustomerId = function(id){
	// return knex.raw(`select offers.id from offers left join requests on offers.request_id = requests.id where requests.customer_id = ${id}`);
	return knex(OFFER_TABLE).join(REQUEST_TABLE, 'offers.request_id', 'requests.id').select('offers.*').where('requests.customer_id', id);
}

exports.createRequest = function (request) {
    return knex(REQUEST_TABLE).insert({customer_id: request[0],request_name: request[1],request_photo: request[2],category_id: request[3],latitude: request[4],longitude: request[5]}).returning('*');
};




exports.getSingleRequest = function (id) {
    return knex(REQUEST_TABLE).select('id').where('id', id).first();
};

exports.getSingleCustomer = function(id) {
	return knex(CUSTOMER_TABLE).select('id').where('id', id).first();
}