var Favorite = require ('../models/favorite.server.model');

exports.create=function(req,res,next) {
	var favorite = new Favorite(req.body);
	favorite.save(function(err) {
		if(err) {
			return next(err);
		}
		else {
			res.json(favorite);
		}
	});
};
exports.list=function(req,res,next) {
	Favorite.find({}, function(err,favorites) {
		if(err) {
			return next(err);
		}
		else {
			res.json(favorites);
		}
	});
};
exports.read=function(req,res,next) {
	res.json(req.favorite);
};
exports.listFavoritesForCompany=function(req,res,next,companyId) {
	Favorite.find({'unit.company':companyId}, function(err,favorites) {
		if (err) {
			return next(err);
		} else {
      res.json(favorites);
		}
	});
};
exports.listFavoritesForCustomer=function(req,res,next,customerId) {
	Favorite.find({'customer':customerId}, function(err,favorites) {
		if (err) {
			return next(err);
		} else {
			res.json(favorites);

		}
	});
};
exports.listFavoritesForUnit=function(req,res,next,unitId) {
	Favorite.find({'unit':unitId}, function(err,favorites) {
		if (err) {
			return next(err);
		} else {
      res.json(favorites);
		}
	});
};
exports.delete = function(req, res) {
    var favorite = req.favorite;
    favorite.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(favorite);
        }
    });
};

// Favorites don't have an _id attribute as they are retrieved by customer,
// unit,and company
// exports.listFavoriteById=function(req,res,next,id) {}

// Favorites are not updated
// exports.update=function(req,res,next) {}
