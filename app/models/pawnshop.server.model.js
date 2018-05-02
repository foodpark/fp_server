var knex = require('../../config/knex');
// var debug = require('debug')('events.model');

const REQUEST_TABLE = "requests";
const OFFER_TABLE = "offers";
const CUSTOMER_TABLE = "customers";
const COMPANY_TABLE = "companies";
const CONTRACT_TABLE = "contracts";
const TERRITORY_TABLE = "territories";
const UNITS_TABLE = "units";

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
					request_description: request[6],
					condition: request[7],
					buy_back_term: request[8],
					country: request[9],
					state: request[10],
					territory: request[11]
				};
    return knex(REQUEST_TABLE).insert(params).returning('*');
};

exports.createOffer = function (request) {
	var params = {
					request_id: request[0],
					request_name: request[1],
					company_id: request[2],
					pawn_poc: request[3],
					unit_id: request[4],
					cash_offer: request[5],
					pawn_name: request[6],
					pawn_address: request[7],
					pawn_phone: request[8],
					buy_back_amount: request[9],
					tax_amount: request[10],
					offer_term: request[11],
					offer_accepted: request[12],
					total_redemption: request[13],
					maturity_date: request[14],
					interest_rate: request[15],
					rating: request[16],
					distance: request[17]
				};
	return knex(OFFER_TABLE).insert(params).returning('*');
}

exports.createContract = function (request) {
	var params = {
					company_id: request[0],
					unit_id: request[1],
					customer_id: request[2],
					offer_id: request[3],
					request_name: request[4],
					request_photo: request[5],
					cash_offer: request[6],
					buy_back_amount: request[7],
					tax_amount: request[8],
					term_months: request[9],
					qr_code: request[10]
				};
	return knex(CONTRACT_TABLE).insert(params).returning('*');
}

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

exports.updateOffer = function * (offer_id, params) {
	return knex(OFFER_TABLE).where('id', '=', offer_id).update(params);
}

exports.getAllRequests =  function(){
	var request_ids = knex(REQUEST_TABLE).select();
	return request_ids;
}

exports.deleteSingleRequest = function(id){
	return knex(REQUEST_TABLE).where('id', '=', id).update({  is_deleted: true});
}

exports.deleteSingleOffer = function(id) {
	return knex(OFFER_TABLE).where('id', '=', id).update({is_deleted: true});
}

exports.getSingleRequest = function (id) {
    return knex(REQUEST_TABLE).select('id').where('id', id).first();
};

exports.getSingleCustomer = function(id) {
	return knex(CUSTOMER_TABLE).select('id').where('id', id).first();
}

exports.getSingleCompany = function(id){
	return knex(COMPANY_TABLE).select('*').where('id', id).first();
}

exports.getPawnPoc = function(unit_id){
	return knex(UNITS_TABLE).select('username').where('id', unit_id).first();
	// return {"id":0};
}

exports.getRequestsByCompany = function(id){
	return knex(REQUEST_TABLE).distinct('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.company_id', id);
}

exports.getRequestsByCompanyMultiple = function(ids){
	return knex(REQUEST_TABLE).distinct('requests.*').join(OFFER_TABLE, 'offers.request_id', 'requests.id').where('offers.company_id','in' , ids);
}

exports.getSingleOffer = function(id) {
	return knex(OFFER_TABLE).select('id').where('id', id).first();
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

exports.getCompanyByUnit = function(company_id, unit_id) {
	return knex(COMPANY_TABLE).select('id').where({id: company_id, default_unit: unit_id});
}

exports.getSingleContract = function(id) {
	return knex(CONTRACT_TABLE).select('*').where('id', id);
}

exports.getSingleContractId = function(id) {
	return knex(CONTRACT_TABLE).select('id').where('id', id);
}

exports.getSingleContractByQrCode = function(qr_code) {
	return knex(CONTRACT_TABLE).select('*').where('qr_code', qr_code);
}

exports.getContractsByCustomer = function(id) {
	return knex(CONTRACT_TABLE).select('*').where('customer_id', id);
}

exports.getContractsByCompany = function(id, offer_approved) {
	if(offer_approved) return knex(CONTRACT_TABLE).select('*').where({'company_id': id, 'offer_approved': true});
	else return knex(CONTRACT_TABLE).select('*').where('company_id', id);
}

exports.checkContractOfferFlag = function(id) {
	return knex(CONTRACT_TABLE).select('*').where({'id': id, 'offer_approved': false});
}

exports.deleteSingleContract = function(id) {
	return knex(CONTRACT_TABLE).where('id', '=', id).update({is_deleted: true});
}
 
exports.getPawnshopsListByTerritory = function * (lat, long) {
	var result = knex(COMPANY_TABLE)
				.select('companies.*')
				.join(TERRITORY_TABLE, 'territories.id', 'companies.territory_id')
				.where('territories.latitude', '<=', lat[0])
				.andWhere('territories.longitude', '<=', long[0])
				.orWhere('territories.latitude', '>=', lat[1])
				.andWhere('territories.longitude', '>=', long[1]);
	// var result = knex.raw("select companies.* from companies left join territories on territories.id = companies.territory_id where territories.latitude <= "+lat[0]+" and territories.longitude <= "+long[0]+" or territories.latitude >= "+lat[1]+" and territories.longitude >= "+long[1]);
	return result;
}

exports.getCountByContext = function(params) {
    var splitId = params[0].substring(0, params[0].length-1) + "_id";
	return knex(params[2]).count(params[2]+'.id').join(params[0], params[0]+'.id', params[2]+"."+splitId).where(params[0]+".id", params[1]);
}

exports.getQRCode = function (qrcode) {
  	return knex(CONTRACT_TABLE).select('id').where('qr_code', qrcode);
};