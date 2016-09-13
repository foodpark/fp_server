var Unit = require ('../models/unit.server.model'),
		debug = require('debug')('units.server.controller');

exports.searchUnits=function(req, res, next) {
	Unit.findByCheckinTimebox(req.params.latitude, req.params.longitude, req.params.distance, req.params.time,function(err,units) {
		if (err) {
			return next(err);
		} else {
			res.json(units);
		}
	});
};
