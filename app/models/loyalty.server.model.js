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
