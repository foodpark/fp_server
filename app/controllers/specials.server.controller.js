var config  = require('../../config/config');
var auth = require('./authentication.server.controller');
var msc  = require('./moltin.server.controller');
var Company = require ('../models/company.server.model');
var Unit    = require ('../models/unit.server.model');
var payload  = require('../utils/payload');
var debug   = require('debug')('specials');
var winston = require('winston');

var logger = new winston.Logger({transports : winston.loggers.options.transports});


exports.getSpecials = function * (next) {
  debug('getSpecials');
  debug(this.body);
  var date  = new Date();
  var units = '';
  var lat = this.body.latitude;
  var lon = this.body.longitude;
  var dis = this.body.distance;
  if (!lat) {
    this.status = 422
    this.body = {error: 'Please enter latitude'}
    return;
  }
  if (!lon) {
    this.status = 422
    this.body = {error: 'Please enter longitude'}
    return;
  }
  if (!dis) {
    this.status = 422
    this.body = {error: 'Please enter distance'}
    return;
  }

  try { 
	  units = yield Unit.findByCheckinTimebox(parseFloat(lat), parseFloat(lon), parseFloat(dis), date);
  } catch (err) {
    console.error('getSpecials: Error getting units');
    console.error(err);
  }
  debug('..units');
  debug(units);
  var specials = [];
  var companies = [];
  for (i=0;i<units.length;i++) {
    var unit = units[i];
    debug('..unit');
    debug(unit);
    debug('..check company '+ unit.company_id +' needs to be processed');
    debug(companies);
    if (companies.indexOf(unit.company_id) !== -1) {
      debug('..already processed. Skipping');
      continue;
    }
    debug('..company '+ unit.company_id +' not processed. Adding...');
    companies.push(unit.company_id);
    debug(companies);
    var company = '';
    try {
      company = (yield Company.getSingleCompany(unit.company_id))[0];
    } catch (err) {
      console.error('getSpecials: Error getting company');
      console.error(err);
    }
    if (company) { 
      debug('..company '+ company.name + ' ' +company.id);
      if (!company.daily_special_item_id) {
        debug('..no daily special defined');
        continue;
      }
      debug('..special '+ company.daily_special_item_id);
      var special = '';
      try {
        special = yield msc.findMenuItem(company.daily_special_item_id);
        debug('..from moltin');
        debug(special);
      } catch (err) {
        console.error('getSpecials: Error getting special');
        console.error(err);
      }
      try {
        special = yield payload.simplifySpecial(special);
        debug('..simplified');
        debug(special);
      } catch (err) {
        console.error('getSpecials: Error getting special');
        console.error(err);
      }
      if (special) {
        special.company_id = company.id;
        special.company_name = company.name;
        specials.push(special);
      }
    }
  }
  this.body = specials;
  return;
}
