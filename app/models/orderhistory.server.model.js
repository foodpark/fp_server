var knex = require('../../config/knex');

exports.getStatus = function(id) {
  return knex('order_history').select('status').where('id', id);
}
