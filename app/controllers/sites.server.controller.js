var Site = require('mongoose').model('Site');

exports.create=function(req,res,next) {
	var site = new Site(req.body);
	site.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(site);
		}
	});
};
exports.list=function(req,res,next) {
	Site.find({}, function(err,sites) {
		if(err) {
			return next(err);
		}
		else {
			res.json(sites);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.site);
};
exports.siteById=function(req,res,next,id) {
	Site.findOne({_id:id}, function(err,site) {
		if (err) {
			return next(err);
		} else {
			req.site=site;
			next();
		}
	});
};
exports.listSitesForCompany=function(req,res,next,companyId) {
	Site.find({'company':companyId}).populate('company')
	.exec(function(err,sites) {
		if (err) {
			return next(err);
		} else {
			res.json(sites);
		}
	});
};
exports.update=function(req,res,next) {
	Site.findByIdAndUpdate(req.site.id, req.body,function(err,site) {
		if (err) {
			return next(err);
		}
		else {
			res.json(site);
		}
	});
};
exports.delete = function(req, res) {
    var site = req.site;
    site.remove(function(err) {
        if (err) {
						console.log(err.stack);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(site);
        }
    });
};
