var knex  = require('../../config/knex');
var debug = require('debug')('driver.model');

exports.getDriversForUnit = function(customerId) {
  return knex('drivers').select().where('unit_id', customerId);
};

exports.getSingleDriver = function(id) {
  return knex('drivers').select().where('id', id);
};

exports.createDriver = function(hash) {
  debug('createDriver');
  debug(hash);
  return knex('drivers').insert(hash).returning('*');
};

exports.updateDriver = function(id, hash) {
  debug('updateDriver');
  debug(hash);
  return knex('drivers').update(hash).where('id',id).returning('*');
};

exports.deleteDriver = function(id) {
  return knex('drivers').where('id', id).del()
};

exports.getDriversByUser = function(id) {
  return knex('drivers').where('user_id',id);
};