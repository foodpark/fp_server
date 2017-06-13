var knex  = require('../../config/knex');
var debug = require('debug')('customer.model');

exports.getAllCustomers = function() {
  return knex('customers').select()
};

exports.getSingleCustomer = function(id) {
  return knex('customers').select().where('id', id)
};

exports.getForUser = function(userId) {
  return knex('customers').select().where('user_id', userId)
};

exports.verifyUser = function(customerId, userId) {
  return knex('customers').select().where({
    id: customerId,
    user_id: userId
  })
};

exports.getCustomerIdForUser = function(userId) {
  return knex('customers').select('id').where('user_id', userId);
}

exports.createCustomer = function(userId) {
  return knex('customers').insert(
    {
      user_id: userId
    }).returning('*')
};
