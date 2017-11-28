var knex  = require('../../config/knex');
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

exports.getRequestedOrders = function(companyId, unitId) {
  if (!companyId || !unitId) {
    console.error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
    throw new Error('Missing company id ('+ companyId+') or unit id ('+ unitId +')');
  }
  return knex('order_history').select('*').
    whereRaw("status \\? ? and not (status \\?| ?) "+
    " and company_id = ? and unit_id = ?",
    ['order_requested', ['order_accepted', 'order_declined'], companyId, unitId]).returning('*');
};

exports.getCustomerActiveOrders = function(customerId) {
  if (!customerId) {
    console.error('Missing customer id ('+ customerId+')');
    throw new Error('Missing customer id ('+ customerId+')');
  }
  return knex('order_history').select('*').
    whereRaw("status \\? ? and not (status \\?| ?) and customer_id = ?",
    ['order_paid', ['order_picked_up', 'order_delivered', 'no_show'], customerId]).returning('*');
};

exports.getCustomerClosedOrders = function(customerId) {
  if (!customerId) {
    console.error('Missing customer id ('+ customerId+')');
    throw new Error('Missing customer id ('+ customerId+')');
  }
  return knex('order_history').select('*').
    whereRaw("customer_id = ? and status \\?| ?",
    [customerId,['order_picked_up', 'order_delivered', 'no_show']]).returning('*');
};

exports.getCustomerRequestedOrders = function(customerId) {
  if (!customerId) {
    console.error('Missing customer id ('+ customerId+')');
    throw new Error('Missing customer id ('+ customerId+')');
  }
  return knex('order_history').select('*').
    whereRaw("status \\? ? and not (status \\?| ?) "+
    " and customer_id = ? ",
    ['order_requested', ['order_paid', 'pay_fail'], customerId]).returning('*');
};


exports.getDriverActiveOrders = function(driverIds) {
  if (!driverIds) {
    console.error('Missing driver ids ('+ driverIds+')');
    throw new Error('Missing driver ids ('+ driverIds+')');
  }
  var query= knex('order_history').select('*').
    whereRaw("status \\? ? and not (status \\?| ?) and driver_id in (??) and for_delivery=true",
    ['order_paid', ['order_picked_up', 'order_delivered', 'no_show'], driverIds]).returning('*');
  return query;
};
