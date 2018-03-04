var knex  = require('../../config/knex');
var debug = require('debug')('reviews.model');

exports.getPointBalance = function(customerId, companyId) {
  var custId = parseInt(customerId);
  var coId = parseInt(companyId);
  return knex('loyalty').select('id', 'balance').where({company_id: coId, customer_id: custId});
};

exports.createNew = function(customerId, companyId, initBalance) {
  var custId = parseInt(customerId);
  var coId = parseInt(companyId);
  var initBal = parseInt(initBalance);
  return knex('loyalty').insert({company_id: coId, customer_id: custId, balance: initBal});
};

exports.updateLoyalty = function (customer, company, updatedLoyalty) {
  return knex('loyalty').where({'company_id' : company, 'customer_id' : customer}).update(updatedLoyalty);
};

exports.getTierPackage = function (company, tier) {
  return knex('loyalty_packages').select('*').where({company_id : company, tier : tier}).first();
};
