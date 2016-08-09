var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    debug = require('debug')('storefront.server.controller');


exports.createCategory=function(req,res,next) {
  debug(req.user)
  Company.findById(req.user.roleId, function(err,company) {
    if (err) { return next(err) }
    else {
      const title = req.body.title;
      if (!title) {return res.status(422).send({ error: 'Title is required.'});}
      return msc.createCategory(title, company, function(category) {
        if (category instanceof Error) return next (category)
        else res.json(category)
      })
    }
  });
};
exports.listCategories=function(req,res,next) {
  var data = req.body;
  msc.listCategories(data, function(categories) {
    debug(categories)
    if (categories instanceof Error) {
      return next(categories)
    } else {
      res.json(categories)
    }
  })
};exports.readCategory=function(req,res,next) {
	res.json(req.category);
};
exports.getCategory=function(req,res,next,id) {
  debug('category id: '+ id)
  msc.findCategory(id, function(category) {
    if (category instanceof Error) {
      return next(err)
    } else {
      req.category=category;
      next();
    }
  });
};
exports.updateCategory=function(req,res,next) {
  var data, callback;
  msc.updateCategory(data, callback)
};
exports.deleteCategory=function(req,res,next) {
  var data, callback;
  msc.deleteCategory(data, callback)
};

exports.createMenuItem=function(req,res,next) {
  var data, callback;
  msc.createMenuItem(data, callback)
};
exports.listMenuItems=function(req,res,next) {
  var data, callback;
  msc.listMenuItems(data, callback)
};
exports.readMenuItem=function(req,res,next) {
	res.json(req.menuItem);
};
exports.getMenuItem=function(req,res,next,id) {
  msc.findMenuItem(id, function(menuItem) {
    if (menuItem instanceof Error) {
      return next(err)
    } else {
      req.menuItem=menuItem;
      next();
    }
  });
};
exports.updateMenuItem=function(req,res,next) {
  var data, callback;
  msc.updateMenuItem(data, callback)
};
exports.deleteMenuItem=function(req,res,next) {
  var data, callback;
  msc.deleteMenuItem(data, callback)
};

exports.createOptionItem=function(req,res,next) {
  var data, callback;
  msc.createOptionItem(data, callback)
};
exports.listOptionItems=function(req,res,next) {
  var data, callback;
  msc.listOptionItems(data, callback)
};
exports.readOptionItem=function(req,res,next) {
	res.json(req.optionItem);
};
exports.getOptionItem=function(req,res,next,id) {
  msc.findOptionItem(id, function(optionItem) {
    if (optionItem instanceof Error) {
      return next(err)
    } else {
      req.optionItem=optionItem;
      next();
    }
  });
};
exports.updateOptionItem=function(req,res,next) {
  var data, callback;
  msc.updateOptionItem(data, callback)
};
exports.deleteOptionItem=function(req,res,next) {
  var data, callback;
  msc.deleteOptionItem(data, callback)
};

exports.createOptionCategory=function(req,res,next) {
  var data, callback;
  msc.createOptionItem(data, callback)
};
exports.listOptionCategories=function(req,res,next) {
  var data, callback;
  msc.listOptionItems(data, callback)
};
exports.readOptionCategory=function(req,res,next) {
	res.json(req.optionCategory);
};
exports.getOptionCategory=function(req,res,next,id) {
  msc.findOptionCategory(id, function(optionCategory) {
    if (optionCategory instanceof Error) {
      return next(err)
    } else {
      req.optionCategory=optionCategory;
      next();
    }
  });
};
exports.updateOptionCategory=function(req,res,next) {
  var data, callback;
  msc.updateOptionItem(data, callback)
};
exports.deleteOptionCategory=function(req,res,next) {
  var data, callback;
  msc.deleteOptionItem(data, callback)
};
