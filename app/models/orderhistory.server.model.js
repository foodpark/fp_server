var knex = require('../../config/knex');
var debug = require('debug')('orders.model');

exports.getStatus = function(id) {
  return knex('order_history').select('status').where('id', id);
}

exports.updateOrder = function(id, hash) {
  return knex('order_history').update(hash).where('id',id).returning('*');
};

exports.getActiveOrders = function(companyId, unitId) {
  if (!companyId || !unitId) {
    console.error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
    throw new Error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
  }
  return knex('order_history').select('*').
    whereRaw("status \\? ? and not (status \\?| ?) "+
    " and company_id = ? and unit_id = ?",
    ['order_paid', ['order_picked_up', 'order_delivered', 'no_show'], companyId, unitId]).returning('*');
};

exports.getClosedOrders = function(companyId, unitId) {
  if (!companyId || !unitId) {
    console.error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
    throw new Error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
  }
  return knex('order_history').select('*').
    whereRaw("company_id = ? and unit_id = ? and status \\?| ?",
    [companyId, unitId,['order_picked_up', 'order_delivered', 'no_show']]).returning('*');
};
