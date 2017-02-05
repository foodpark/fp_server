var knex = require('../../config/knex');

exports.getForCustomer = function(id) {
  return knex('favorites').select().where('customer_id',id);
};

exports.getForCompany = function(id) {
  return knex('favorites').select().where('company_id', id)
};

exports.getForUnit = function(id) {
  return knex('favorites').select().where('unit_id', id)
};

