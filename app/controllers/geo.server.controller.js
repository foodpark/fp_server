var Unit = require ('../models/unit.server.model');
var debug = require('debug')('geo.server.controller');
var winston = require('winston');

var logger = new winston.Logger({transports : winston.loggers.options.transports});

exports.searchUnits=function *(next) {
	var date = new Date();
	var units = Unit.findByCheckinTimebox(parseFloat(this.query.latitude), parseFloat(this.query.longitude), parseFloat(this.query.distance), date).then( function (result) {
		console.log(result);
		return result;
	}).catch(console.log.bind(console));
	this.body = yield units;
};

exports.searchPostal=function *(next) {
	var date = new Date();
	var units = []
	Unit.findByCheckinTimebox(parseFloat(this.query.latitude), parseFloat(this.query.longitude), parseFloat(this.query.distance), date).then( function (result) {
    units = result
		console.log(units);
		this.body = units;
	});
};
