var config  = require('../../config/config');
var auth = require('./authentication.server.controller');
var Company = require ('../models/company.server.model');
var Customer = require ('../models/customer.server.model');
var moltin  = require('./moltin.server.controller');
var orderhistory  = require('../models/orderhistory.server.model');
var Unit    = require ('../models/unit.server.model');
var debug   = require('debug')('orders');
var winston = require('winston');

var logger = new winston.Logger({transports : winston.loggers.options.transports});

var ORDER = '/orders';

exports.getOrders = function*(next){
  var search = this.query;
  var query = '';
  for(var q in search){
    query = (query)? query + '&'+ q + '=' + search[q]:'?'+ q + '=' + search[q];
  }
  console.log(query);
  try{
    var flow = ORDER + '/' + 'search' + query
    var orders = yield moltin.getOrder(flow);
  }catch(e){
    throw(e);
  }
  console.log(orders.length)
  this.body = orders;
}

exports.getActiveOrders = function * (next) {
  debug('getActiveOrders');
  if (!this.company || !this.unit) {
    console.error('getActiveOrders: Company/unit id missing');
    throw new Error('Company/unit id missing');
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'OWNER' && user.id == this.company.user_id || 
      user.role == 'UNITMGR' && user.id == this.unit.unit_mgr_id ||
      user.role == 'ADMIN') {
    debug('..authorized');
    try { 
      var orders = yield orderhistory.getActiveOrders(this.company.id, this.unit.id);
    } catch (err) {
      console.error('getActiveOrders: error getting active orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('get active orders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getClosedOrders = function * (next) {
  debug('getClosedOrders');
  if (!this.company || !this.unit) {
    console.error('getClosedOrders: Company/unit id missing');
    throw new Error('Company/unit id missing');
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
      console.error('getClosedOrders: error getting closed orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('get closed orders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getRequestedOrders = function * (next) {
  debug('getRequestedOrders');
  if (!this.company || !this.unit) {
    console.error('getRequestedOrders: Company/unit id missing');
    throw new Error('Company/unit id missing');
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
      console.error('getRequestedOrders: error getting requested orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('getRequestedOrders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerActiveOrders = function * (next) {
  debug('getCustomerActiveOrders');
  if (!this.customer) {
    console.error('getCustomerActiveOrders: Customer id missing');
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
      var orders = yield orderhistory.getCustomerActiveOrders(this.customer.id);
    } catch (err) {
      console.error('getCustomerActiveOrders: error getting customer active orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('get customer active orders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerClosedOrders = function * (next) {
  debug('getCustomerClosedOrders');
  if (!this.customer) {
    console.error('getCustomerClosedOrders: Customer id missing');
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
      console.error('getCustomerClosedOrders: error getting customer closed orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('get customer closed orders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCustomerRequestedOrders = function * (next) {
  debug('getCustomerRequestedOrders');
  if (!this.customer) {
    console.error('getCustomerRequestedOrders: Customer id missing');
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
      console.error('getCustomerRequestedOrders: error getting customer requested orders');
      console.error(err)
      throw err;
    }
    debug('..orders');
    debug(orders);
    this.body = orders;
    return;
  } else {
    console.error('getCustomerRequestedOrders: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.getCompany=function *(id, next) {
  debug('getCompany');
  debug('id ' + id);
  var company = '';
  try {
    company = (yield Company.getSingleCompany(id))[0];
  } catch (err) {
    console.error('error getting company');
    throw(err);
  }
  debug(company);
  this.company = company;
  yield next;
}

exports.getCustomer=function *(id, next) {
  debug('getCustomer');
  debug('id ' + id);
  var customer = '';
  try {
    customer = (yield Customer.getSingleCustomer(id))[0];
  } catch (err) {
    console.error('error getting customer');
    throw(err);
  }
  debug(customer);
  this.customer = customer;
  yield next;
}

exports.getUnit=function *(id, next) {
  debug('getUnit');
  debug('id ' + id);
  var unit = '';
  try {
    unit = (yield Unit.getSingleUnit(id))[0];
  } catch (err) {
    console.error('error getting unit');
    throw(err);
  }
  debug(unit);
  this.unit = unit;
  yield next;
}