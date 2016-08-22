var Company = require ('../models/company.server.model'),
debug = require('debug')('companies.server.controller');

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
	Company.findOne({_id:id},function(err,company) {
		if (err) {
			return next(err);
		}
		else {
			req.company=company;
			next();
		}
	});
};
exports.update=function(req,res,next) {
	Company.findByIdAndUpdate(req.company.id, req.body,function(err,company) {
		if (err) { return next(err);}
		res.json(company);
		});
};
exports.delete = function(req, res) {
    var company = req.company;
    company.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(company);
        }
    });
};
exports.listTags=function(req,res,next) {
	var company = req.company
	debug(company)
	var tags = company.tags
	res.json(tags);
};
exports.addTag=function(req,res,next) {
	var company = req.company;
	var tag = req.body.tag;
	company.tags.push(tag);
	company.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(company);
		}

	})
};
exports.deleteTag=function(req,res,next) {
	var company = req.company;
	var tag = req.body.tag;
	company.tags.remove({_id: tag});
	company.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(company);
		}

	})
};
