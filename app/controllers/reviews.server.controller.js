var Review = require('mongoose').model('Review');

exports.create=function(req,res,next) {
	if (req.user) {
    var review = new Review(req.body);
    Review.save(function(err) {
      if(err) {
        return next(err);
      } else {
        res.json(review);
      }
    });
  } else {
    console.log('User not logged in');
    res.render('login', {
        title: 'Log-in Form',
        messages: req.flash('error') || req.flash('info')
    });
  }
};
exports.list=function(req,res,next) {
	Review.find({}, function(err,reviews) {
		if(err) {
			return next(err);
		}
		else {
			res.json(reviews);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.review);
};
exports.reviewById=function(req,res,next,id) {
	Review.findOne({_id:id}, function(err,review) {
		if (err) {
			return next(err);
		} else {
			req.review=review;
			next();
		}
	});
};
exports.listReviewsForCompany=function(req,res,next,companyId) {
	Review.find({'site.company':companyId}, function(err,reviews) {
		if (err) {
			return next(err);
		} else {
			res.json(reviews);
		}
	});
};
exports.listReviewsForCustomer=function(req,res,next,customerId) {
	Review.find({'customer':customerId}, function(err,reviews) {
		if (err) {
			return next(err);
		} else {
			res.json(reviews);
		}
	});
};
exports.listReviewsForSite=function(req,res,next,siteId) {
	Review.find({'site':siteId}, function(err,reviews) {
		if (err) {
			return next(err);
		} else {
			res.json(reviews);
		}
	});
};
exports.update=function(req,res,next) {
	Review.findByIdAndUpdate(req.review.id, req.body,function(err,review) {
		if (err) {
			return next(err);
		}
		else {
			res.json(review);
		}
	});
};
exports.delete = function(req, res) {
    var review = req.review;
    review.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(review);
        }
    });
};
