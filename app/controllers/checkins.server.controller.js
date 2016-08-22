var Checkin = require ('../models/checkin.server.model');

exports.create=function(req,res,next) {
	var checkin = new Checkin(req.body);
	checkin.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(checkin);
		}
	});
};
exports.list=function(req,res,next) {
	Checkin.find({}, function(err,checkins) {
		if(err) {
			return next(err);
		}
		else {
			res.json(checkins);
		}
	});
};
exports.listCheckinsForCompany=function(req,res,next,companyId) {
	Checkin.find({'site.company':companyId}, function(err,checkins) {
		if (err) {
			return next(err);
		} else {
			res.json(checkins);
		}
	});
};
exports.listCheckinsForCustomer=function(req,res,next,customerId) {
	Checkin.find({'customer':customerId}, function(err,checkins) {
		if (err) {
			return next(err);
		} else {
			res.json(checkins);
		}
	});
};
exports.listCheckinsForSite=function(req,res,next,siteId) {
	Checkin.find({'site':siteId}, function(err,checkins) {
		if (err) {
			return next(err);
		} else {
			res.json(checkins);
		}
	});
};
// Checkins don't have an _id attribute as they are retrieved by user, site,
// and company
// exports.listCheckinById=function(req,res,next,id) {}

// Checkins are not updated
// exports.update=function(req,res,next) {}

// Checkins are not deleted
// exports.delete = function(req, res) {}
