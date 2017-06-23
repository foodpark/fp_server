var config  = require('../../config/config');
var auth = require('./authentication.server.controller');
var Company = require ('../models/company.server.model');
var Customer = require ('../models/customer.server.model');
var User = require('../models/user.server.model')
var moltin  = require('./moltin.server.controller');
var orderhistory  = require('../models/orderhistory.server.model');
var Unit    = require ('../models/unit.server.model');
var debug   = require('debug')('orders');
var logger = require('winston');


var ORDER = '/orders';

exports.getOrders = function*(next){
  logger.info('Getting Orders',{fn:'getOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  var search = this.query;
  var query = '';
  for(var q in search){
    query = (query)? query + '&'+ q + '=' + search[q]:'?'+ q + '=' + search[q];
  }
  logger.info('Order Query',{fn:'getOrders',query:query});
  var orders = {};
  try{
    var flow = ORDER + '/' + 'search' + query
    orders = yield moltin.getOrder(flow);
  }catch(e){
    logger.error('Error retrieving Query',{fn:'getOrders',query:query,error:err});
    throw(e);
  }
  logger.info('Orders retrieved',{fn:'getOrders',orders:orders});
  this.body = orders;
}



exports.getActiveOrders = function * (next) {
  logger.info('Getting Active Orders',{fn:'getActiveOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  debug('getActiveOrders');
  if (!this.company || !this.unit) {
    logger.error('Company/unit id missing',{fn:'getActiveOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company/unit id missing'});
    throw new Error('Company/unit id missing', 422);
  }
  logger.info('checking authorization');
  debug('..check authorization');
  var user = this.passport.user;
  var orders = {};
  var unit_manager_fbid = user.fbid;
  var returnBody = {};
  logger.info(user);
  logger.info(this.unit);
  if (user.role == 'OWNER' && user.id == this.company.user_id ||
      user.role == 'UNITMGR' && user.id == this.unit.unit_mgr_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      logger.info("UM FBID: " + unit_manager_fbid);
      orders = yield orderhistory.getActiveOrders(this.company.id, this.unit.id);
      logger.info("UM ORDERS: " + orders);
    } catch (err) {
      logger.error('Error getting active orders',{fn:'getActiveOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    // order.unit_manager_fbid = unit_manager_fbid;
    if (orders) {
      for (i = 0; i < orders.length; i++) {
        logger.info("Order customerID: " + orders[i].customer_id);
        orders[i].unit_manager_fbid = unit_manager_fbid;
        orders[i].customer_fbid = (yield User.getFBID(orders[i].customer_id))[0].fbid;
      }
    }
    else {
      orders = [];
    }
    this.body = orders;
    logger.info("Return: " + orders);
    return;
  } else {
    logger.error('User not authorized',{fn:'getActiveOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getClosedOrders = function * (next) {
  debug('getClosedOrders');
  logger.info('Getting Closed Orders',{fn:'getClosedOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  if (!this.company || !this.unit) {
    logger.error('Company/unit id missing',{fn:'getClosedOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company/unit id missing'});
    throw new Error('Company/unit id missing', 422);
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'OWNER' && user.id == this.company.user_id ||
      user.role == 'UNITMGR' && user.id == this.unit.unit_mgr_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      var orders = yield orderhistory.getClosedOrders(this.company.id, this.unit.id);
    } catch (err) {
      logger.error('Error getting closed orders',{fn:'getClosedOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    logger.info("Closed Orders retrieved", {fn:'getClosedOrders',orders:orders});
    this.body = orders;
    return;
  } else {
    logger.error('User not authorized',{fn:'getClosedOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getRequestedOrders = function * (next) {
  debug('getRequestedOrders');
  logger.info('Getting Requested Orders',{fn:'getRequestedOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  if (!this.company || !this.unit) {
    logger.error('Company/unit id missing',{fn:'getRequestedOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company/unit id missing'});
    throw new Error('Company/unit id missing', 422);
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'OWNER' && user.id == this.company.user_id ||
      user.role == 'UNITMGR' && user.id == this.unit.unit_mgr_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      var orders = yield orderhistory.getRequestedOrders(this.company.id, this.unit.id);
    } catch (err) {
      logger.error('Error getting requested orders',{fn:'getRequestedOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    logger.info("Requested Orders retrieved", {fn:'getRequestedOrders',orders:orders});
    this.body = orders;
    return;
  } else {
    logger.error('User not authorized',{fn:'getRequestedOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerActiveOrders = function * (next) {
  debug('getCustomerActiveOrders');
  logger.info('Getting Customer Active Orders',{fn:'getCustomerActiveOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  if (!this.customer) {
    logger.error('Company id missing',{fn:'getCustomerActiveOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company id missing'});
    this.status= 422;
    this.body = {error: 'Customer id missing'};
    return;
  }
  debug('..check authorization');
  var user = this.passport.user;
  var customer_fbid = user.fbid;
  if (user.role == 'CUSTOMER' && user.id == this.customer.user_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      orders = yield orderhistory.getCustomerActiveOrders(this.customer.id);
      if (orders) {
        for (i = 0; i < orders.length; i++) {
          logger.info("Order unitId: " + orders[i].unit_id);
          orders[i].unit_manager_fbid = (yield User.getUserIdForUnitMgrByUnitId(orders[i].unit_id))[0].fbid;
          orders[i].customer_fbid = customer_fbid;
        }
      }
      else {
        orders = [];
      }
    } catch (err) {
      logger.error('Error getting customer active orders',{fn:'getCustomerActiveOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    logger.info("Return: " + orders);
    return;
  } else {
    logger.error('User not authorized',{fn:'getCustomerActiveOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerClosedOrders = function * (next) {
  debug('getCustomerClosedOrders');
  logger.info('Getting Customer Closed Orders',{fn:'getCustomerClosedOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  if (!this.customer) {
    logger.error('Company id missing',{fn:'getCustomerClosedOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company id missing'});
    this.status= 422;
    this.body = {error: 'Customer id missing'};
    return;
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'CUSTOMER' && user.id == this.customer.user_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      var orders = yield orderhistory.getCustomerClosedOrders(this.customer.id);
    } catch (err) {
      logger.error('Error getting customer closed orders',{fn:'getCustomerClosedOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    logger.info("Customer Closed Orders retrieved", {fn:'getCustomerClosedOrders',orders:orders});
    this.body = orders;
    return;
  } else {
    logger.error('User not authorized',{fn:'getCustomerClosedOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerRequestedOrders = function * (next) {
  debug('getCustomerRequestedOrders');
  logger.info('Getting Customer Requested Orders',{fn:'getCustomerRequestedOrders'}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  if (!this.customer) {
    logger.error('Company id missing',{fn:'getCustomerRequestedOrders'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:'Company id missing'});
    this.status= 422;
    this.body = {error: 'Customer id missing'};
    return;
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'CUSTOMER' && user.id == this.customer.user_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try {
      var orders = yield orderhistory.getCustomerRequestedOrders(this.customer.id);
    } catch (err) {
      logger.error('Error getting customer requested orders',{fn:'getCustomerRequestedOrders'}); //, user_id: this.passport.user.id,
        // role:this.passport.user.role, error:err});
      throw err;
    }
    debug('..orders');
    debug(orders);
    logger.info("Customer Requested Orders retrieved", {fn:'getCustomerRequestedOrders',orders:orders});
    this.body = orders;
    return;
  } else {
    logger.error('User not authorized',{fn:'getCustomerRequestedOrders',user_id: this.passport.user.id,
      role: this.passport.user.role, error:'User not authorized'});
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCompany=function *(id, next) {
  logger.info('Getting Company',{fn:'getCompany',id:id}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  debug('getCompany');
  debug('id ' + id);
  var company = '';
  try {
    company = (yield Company.getSingleCompany(id))[0];
  } catch (err) {
    logger.error('Error getting company',{fn:'getCompany'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:err});
    throw(err);
  }
  debug(company);
  logger.info('Company retrieved',{fn:'getCompany',company:company});
  this.company = company;
  yield next;
}

exports.getCustomer=function *(id, next) {
  logger.info('Getting Customer',{fn:'getCustomer',id:id, pp : this.passport});// user_id: this.passport.user.id, role: this.passport.user.role});
  debug('getCustomer');
  debug('id ' + id);
  var customer = '';
  try {
    customer = (yield Customer.getSingleCustomer(id))[0];
  } catch (err) {
    logger.error('Error getting customer',{fn:'getCustomer'}); //}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:err});
    throw(err);
  }
  debug(customer);
  logger.info('Customer retrieved',{fn:'getCustomer',customer:customer});
  this.customer = customer;
  yield next;
}

exports.getUnit=function *(id, next) {
  logger.info('Getting Unit',{fn:'getUnit',id:id}); //, user_id: this.passport.user.id,
    // role:this.passport.user.role});
  debug('getUnit');
  debug('id ' + id);
  var unit = '';
  try {
    unit = (yield Unit.getSingleUnit(id))[0];
  } catch (err) {
    logger.error('Error getting unit',{fn:'getUnit'}); //, user_id: this.passport.user.id,
      // role:this.passport.user.role, error:err});
    throw(err);
  }
  debug(unit);
  logger.info('Unit retrieved',{fn:'getUnit',unit:unit});
  this.unit = unit;
  yield next;
}
