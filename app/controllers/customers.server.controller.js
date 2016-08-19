var Customer = require('mongoose').model('Customer'),
debug = require('debug')('customer.server.controller');

exports.create=function(req,res,next) {
	var customer = new Customer(req.body);
	customer.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(customer);
		}
	});
};
exports.list=function(req,res,next) {
	Customer.find({}, function(err,customers) {
		if(err) {
			return next(err);
		}
		else {
			res.json(customers);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.customer);
};
exports.customerById=function(req,res,next,id) {
	Customer.findOne({_id:id},
	function(err,customer) {
		if (err) {
			return next(err);
		}
		else {
			req.customer=customer;
			next();
		}
	}
	);
};

exports.update=function(req,res,next) {
	Customer.findByIdAndUpdate(req.customer.id, req.body,function(err,customer) {
		if (err) {
			return next(err);
		}
		else {
			res.json(customer);
		}
	});
};
exports.delete = function(req, res) {
    var customer = req.customer;
    customer.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(customer);
        }
    });
};
