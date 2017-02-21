var config  = require('../../config/config');
var auth = require('./authentication.server.controller');
var Company = require ('../models/company.server.model');
var Customer = require ('../models/customer.server.model');
var Favorite = require ('../models/favorites.server.model');
var Unit    = require ('../models/unit.server.model');
var debug   = require('debug')('favorites');


exports.getCompanyFavorites = function * (next) {
  debug('getCompanyFavorites');
  if (!this.company) {
    console.error('getCompanyFavorites: Company id missing');
    throw new Error('Company id missing');
  }
  debug('..no authorization check required on GET');
  var faves = '';
  try { 
    faves = yield Favorite.getForCompany(this.company.id);
  } catch (err) {
    console.error('getCompanyFavorites: error getting favorites');
    console.error(err)
    throw err;
  }
  debug('..favorites');
  debug(faves);
  this.body = faves;
  return;
}

exports.getCompanyUnitFavorites = function * (next) {
  debug('getCompanyUnitFavorites');
  if (!this.company || !this.unit) {
    console.error('getCompanyUnitFavorites: Company/unit id missing');
    throw new Error('Company/unit id missing');
  }
  debug('..no authorization check required on GET');
  var faves = '';
  try { 
    faves = yield Favorite.getForCompanyUnit(this.company.id, this.unit.id);
  } catch (err) {
    console.error('getCompanyUnitFavorites: error getting favorites');
    console.error(err)
    throw err;
  }
  debug('..favorites');
  debug(faves);
  this.body = faves;
  return;
}

exports.getCustomerFavorites = function * (next) {
  debug('getCustomerFavorites');
  if (!this.customer) {
    console.error('getCustomerFavorites: Customer id missing');
    throw new Error('Customer id missing');
  }
  debug('..no authorization check required on GET');
  var faves = '';
  try { 
    faves = yield Favorite.getForCustomer(this.customer.id);
  } catch (err) {
    console.error('getCustomerFavorites: error getting favorites');
    console.error(err)
    throw err;
  }
  debug('..favorites');
  debug(faves);
  this.body = faves;
  return;
}

exports.toggleCustomerFavorite = function * (next) {
  debug('toggleCustomerFavorite');
  if (!this.customer) {
    console.error('toggleCustomerFavorite: Customer id missing');
    this.status= 422;
    this.body = {error: 'Customer id missing'};
    return;
  }
  if (!this.body.company_id) {
    console.error('toggleCustomerFavorite: Company id missing');
    this.status= 422;
    this.body = {error: 'Company id missing'};
    return;
  }
  if (!this.body.unit_id) {
    console.error('toggleCustomerFavorite: Unit id missing');
    this.status= 422;
    this.body = {error: 'Unit id missing'};
    return;
  }
  debug('..check authorization');
  var user = this.passport.user;
  if (user.role == 'CUSTOMER' && user.id == this.customer.user_id) {
    debug('..authorized');
    var faves = '';
    try { 
      faves = yield Favorite.toggleFavorite(this.body.company_id, this.customer.id, this.body.unit_id);
    } catch (err) {
      console.error('toggleCustomerFavorite: Error toggling favorite');
      console.error(err)
      throw err;
    }
    debug('..faves');
    debug(faves);
    this.body = faves;
    return;
  } else {
    console.error('toggleCustomerFavorite: User not authorized')
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