var Unit = require ('../models/unit.server.model');
var debug = require('debug')('geo.server.controller');
var logger = require('winston');


exports.searchUnits=function *(next) {
	meta={
		fn:'searchUnits',
		latitude:this.query.latitude,
		longitude:this.query.longitude,
		distance:this.query.distance
	};
	logger.info('Searching Unit checkins', meta);
	var date = new Date();
	meta.date=date;
	var units = Unit.findByCheckinTimebox(parseFloat(this.query.latitude), parseFloat(this.query.longitude), parseFloat(this.query.distance), date).then( function (result) {
		debug(result);
		logger.info('Unit checkins found', meta);
		return result;
	}).catch(
		function (err){
			meta.error=err;
			logger.error('error while searching for unit checkins', meta);
			throw err;
		});
	this.body = yield units;
};

exports.searchPostal=function *(next) {
	meta={
		fn:'searchPostal',
		latitude:this.query.latitude,
		longitude:this.query.longitude,
		distance:this.query.distance
	};
	logger.info('Searching Unit checkins by postal', meta);
	var date = new Date();
	meta.date=date;
	var units = []
	Unit.findByCheckinTimebox(parseFloat(this.query.latitude), parseFloat(this.query.longitude), parseFloat(this.query.distance), date).then( function (result) {
    units = result;
		logger.info('Unit checkins found', meta);
		this.body = units;
	}).catch(
		function (err){
			meta.error=err;
			logger.error('error while searching for unit checkins by postal', meta);
			throw err;
		});
};
