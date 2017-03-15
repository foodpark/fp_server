var knex = require('../../config/knex');

exports.getAddressesForCustomer = function(customerId) {
  return knex('delivery_addresses').select().where('customer_id', customerId);
};

exports.getSingleAddress = function(id) {
  return knex('delivery_addresses').select().where('id', id);
};

