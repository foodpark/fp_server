var knex = require ('../../config/knex');

exports.getForUnit = function(id) {
  return knex('units').select('customer_order_window').where('id', parseInt(id));
}

exports.validateUnitId = function(id) {
  return knex('units').select('id').where('id', parseInt(id));
}
