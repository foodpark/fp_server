var Site = require ('../models/site.server.model'),
		debug = require('debug')('sites.server.controller');

exports.createSite = function(name, type, username, pass, company, callback) {
	var site = new Site(
		{
			name: name,
			user: username,
			password: pass,
			type: type,
			company: company
		}
	)
	site.save(function(err) {
		if (err) {
			return callback(err)
		} else {
			var user = new User (
				{
					name: name,
					username: username,
					password: pass,
					email: company.email,
					role: 'SiteMgr',
					roleid: site.id
				}
			)
			user.save(function (err) {
				if (err) {
					return callback(err)
				}
				return callback(site)
			})
		}
	})

}
exports.create=function(req,res,next) {
	var company = req.company
	var type = req.body.type
	var username = req.body.username
	var pass = req.body.password

	if (!type) {return res.status(422).send({ error: 'Please specify site type (truck, cart).'});}
	if (!username) {return res.status(422).send({ error: 'Please enter a user name.'});}
	if (!password) {return res.status(422).send({ error: 'Please enter a password.'});}

	var name = company.name
	site.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			// create a new user
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
