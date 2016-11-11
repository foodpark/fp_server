var knex = require('../../config/knex');

exports.getStatus = function(id) {
  return knex('order_history').select('status').where('id', id);
}

exports.updateOrder = function(id, hash) {
  return knex('order_history').update(hash).where('id',id).returning('*');
};
