var Customer = require ('../models/customer.server.model');

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
