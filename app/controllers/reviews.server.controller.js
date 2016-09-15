var Review = require ('../models/review.server.model');

exports.create=function *(req,res,next) {
	try {
		var reviewId = (yield Review.createReview(error,
			req.user.id,req.review.companyId,req.review.unitId,
			req.review.comment, req.review.answers, req.review.rating))[0];
	}
	catch (err) {
		console.error('Error creating review for company ' + req.review.companyId + ' by user ' + req.user.id);
		throw err;
	}
	this.body = reviewId;
	return;
};

exports.listReviewsByStatus = function *(req,res,next) {
	try {
		var reviews = (yield Review.getReviewsByStatus(req.status))[0];
	}
	catch (err) {
		console.error('Error getting reviews with status '+ req.status);
		throw err;
	}
	this.body = reviews;
	return;
}

exports.listReviewsForCompany=function *(req,res,next) {
	try {
		var reviews = (yield Review.getReviewsForCompany(req.companyId))[0];
	}
	catch (err) {
		console.err('Error listing reviews for company ' + req.companyId);
		throw(err);
	};
	this.body = reviews;
	return;
};

exports.listReviewsForCompanyAndUser=function *(req,res,next) {
	try {
		var reviews = (yield Review.getReviewsForCompanyAndUser(req.companyId, req.user.id))[0];
	}
	catch (err) {
		console.err('Error listing reviews for company ' + req.companyId + ' and user ' + req.user.id);
		throw(err);
	};
	this.body = reviews;
	return;
};

exports.listReviewsForUser=function *(req,res,next) {
	try {
		var reviews = (yield Review.getReviewsForUser(req.user.id))[0];
	}
	catch (err) {
		console.error('Error getting list of reviews for user ' + req.user.id);
		throw err;
	}
	this.body = reviews;
	return;
};

exports.update=function *(req,res,next) {
	try {
		var updateResult = (yield Review.updateReview(error, req.review.id, req.user.id, req.review.comment))[0];
	}
	catch (err) {
		console.error('Error updating review ' + req.review.id);
		throw err;
	}
	this.body = updateResult;
	return;
};

exports.updateApproval = function *(req,res,next) {
	try {
		// the user ID here is the approver of a customer's review
		// Status can be 'Approved', 'Rejected', etc.
		var updateResult = (yield Review.updateReviewApproval(req.review.id,req.user.id,req.review.status))[0];
	}
	catch (err) {
		console.error('Error updating approval entry for review ' + req.review.id);
		throw err;
	}
	this.body = updateResult;
	return;
}

exports.deleteReview = function*(req, res, next) {
	try {
		var deletionResult = (yield Review.deleteReview(req.review.id))[0];
	}
	catch (err) {
		console.error('Error deleting review ' + req.review.id);
		throw err;
	}
	this.body = deletionResult;
	return;
};

exports.validateId = function(req, res, next) {
	var retVal = Review.validateReviewId(error, req.param.id);
	if (error) {
		next(error);
	}
	else {
		return retVal;
	}
};
