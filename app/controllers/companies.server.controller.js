var Company = require('mongoose').model('Company');

exports.create=function(req,res,next) {
	var company = new Company(req.body);
	company.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(company);
		}
	});
};
exports.list=function(req,res,next) {
	Company.find({}, function(err,companies) {
		if(err) {
			return next(err);
		}
		else {
			res.json(companies);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.company);
};
exports.companyById=function(req,res,next,id) {
	Company.findOne({_id:id},
	function(err,company) {
		if (err) {
			return next(err);
		}
		else {
			req.company=company;
			next();
		}
	}
	);
};

exports.update=function(req,res,next) {
	Company.findByIdAndUpdate(req.company.id, req.body,function(err,company) {
		if (err) {
			return next(err);
		}
		else {
			res.json(company);
		}
	});
};
