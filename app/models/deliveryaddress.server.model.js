var knex  = require('../../config/knex');
var debug = require('debug')('deliveryaddress.model');

exports.getAddressesForCustomer = function(customerId) {
  return knex('delivery_addresses').select().where('customer_id', customerId);
};

exports.getSingleAddress = function(id) {
  return knex('delivery_addresses').select().where('id', id);
};

exports.createAddress = function(hash) {
  debug('createAddress');
  debug(hash);
  return knex('delivery_addresses').insert(hash).returning('*');
};

exports.updateAddress = function(id, hash) {
  debug('updateAddress');
  debug(hash);
  return knex('delivery_addresses').update(hash).where('id',id).returning('*');
};

exports.deleteAddress = function(id) {
  return knex('delivery_addresses').where('id', id).del()
};

