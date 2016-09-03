var Unit = require ('../models/unit.server.model'),
		debug = require('debug')('units.server.controller');

exports.createUnit = function(name, type, username, pass, company, callback) {
	var unit = new Unit(
		{
			name: name,
			user: username,
			password: pass,
			type: type,
			company: company
		}
	)
	unit.save(function(err) {
		if (err) {
			return callback(err)
		} else {
			var user = new User (
				{
					name: name,
					username: username,
					password: pass,
					email: company.email,
					role: 'UnitMgr',
					roleid: unit.id
				}
			)
			user.save(function (err) {
				if (err) {
					return callback(err)
				}
				return callback(unit)
			})
		}
	})

}
exports.create=function(req,res,next) {
	var company = req.company
	var type = req.body.type
	var username = req.body.username
	var pass = req.body.password

	if (!type) {return res.status(422).send({ error: 'Please specify unit type (truck, cart).'});}
	if (!username) {return res.status(422).send({ error: 'Please enter a user name.'});}
	if (!password) {return res.status(422).send({ error: 'Please enter a password.'});}

	var name = company.name
	unit.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			// create a new user
			res.json(unit);
		}
	});
};
exports.list=function(req,res,next) {
	Unit.find({}, function(err,units) {
		if(err) {
			return next(err);
		}
		else {
			res.json(units);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.unit);
};
exports.unitById=function(req,res,next,id) {
	Unit.findOne({_id:id}, function(err,unit) {
		if (err) {
			return next(err);
		} else {
			req.unit=unit;
			next();
		}
	});
};
exports.listUnitsForCompany=function(req,res,next,companyId) {
	Unit.find({'company':companyId}).populate('company')
	.exec(function(err,units) {
		if (err) {
			return next(err);
		} else {
			res.json(units);
		}
	});
};
exports.searchUnits=function(req, res, next) {
	Unit.findByCheckinTimebox(req.params.latitude, req.params.longitude, req.params.distance, req.params.time,function(err,units) {
		if (err) {
			return next(err);
		} else {
			res.json(units);
		}
	});
};
exports.update=function(req,res,next) {
	Unit.findByIdAndUpdate(req.unit.id, req.body,function(err,unit) {
		if (err) {
			return next(err);
		}
		else {
			res.json(unit);
		}
	});
};
exports.delete = function(req, res) {
    var unit = req.unit;
    unit.remove(function(err) {
        if (err) {
						console.log(err.stack);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(unit);
        }
    });
};
