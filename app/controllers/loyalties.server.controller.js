var Loyalty = require ('../models/loyalty.server.model');

exports.create=function(req,res,next) {
	var loyalty = new Loyalty(req.body);
	Loyalty.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(loyalty);
		}
	});
};
exports.list=function(req,res,next) {
	Loyalty.find({}, function(err,loyalties) {
		if(err) {
			return next(err);
		}
		else {
			res.json(loyalties);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.loyalty);
};
exports.loyaltyById=function(req,res,next,id) {
	Loyalty.findOne({_id:id},
	function(err,loyalty) {
		if (err) {
			return next(err);
		}
		else {
			req.loyalty=loyalty;
			next();
		}
	});
};
exports.listLoyaltiesForCompany=function(req,res,next,companyId) {
	Loyalty.find({'unit.company':companyId}, function(err,loyalties) {
		if (err) {
			return next(err);
		} else {
			res.json(loyalties);
		}
	});
};
exports.listLoyaltiesForCustomer=function(req,res,next,customerId) {
	Loyalty.find({'customer':customerId}, function(err,loyalties) {
		if (err) {
			return next(err);
		} else {
      res.json(loyalties);
		}
	});
};
exports.listLoyaltiesForUnit=function(req,res,next,unitId) {
	Loyalty.find({'unit':unitId}, function(err,loyalties) {
		if (err) {
			return next(err);
		} else {
      res.json(loyalties);
		}
	});
};
exports.update=function(req,res,next) {
	Loyalty.findByIdAndUpdate(req.loyalty.id, req.body,function(err,loyalty) {
		if (err) {
			return next(err);
		}
		else {
			res.json(loyalty);
		}
	});
};
// Loyaltys don't have an _id attribute as they are retrieved by user, unit,
// and company
// exports.listLoyaltyById=function(req,res,next,id) {}

// Loyaltys are not deleted
// exports.delete = function(req, res) {}
