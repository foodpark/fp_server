var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    debug = require('debug')('storefront.server.controller');


exports.createCategory=function(req,res,next) {
  debug(req.user)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      const title = req.body.title;
      const parent = req.body.parent;
      if (!title) return res.status(422).send({ error: 'Title is required.'});
      return msc.createCategory(company, title, parent, function(category) {
        if (category instanceof Error) {
          debug(category)
          return res.status(422).send({ error: category});
        }
        else res.json(category)
      })
    }
  });
};
exports.listCategories=function(req,res,next) {
  var data = req.body;
  debug(req.user.roleId)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      msc.listCategories(company, data, function(categories) {
        debug(categories)
        if (categories instanceof Error) {
          return next(categories)
        } else {
          res.json(categories)
        }
      })
    }
  })
};
exports.readCategory=function(req,res,next) {
	res.json(req.category);
};
exports.getCategory=function(req,res,next,id) {
  debug('category id: '+ id)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      msc.findCategory(company, id, function(category) {
        if (category instanceof Error) {
          return next(err)
        } else {
          req.category=category;
          next();
        }
      });
    };
  })
}
exports.updateCategory=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      var data = req.body;
      var category=req.category;
      msc.updateCategory(company, category, data, function(category) {
        if (category instanceof Error) {
          return next(err)
        } else {
          req.category=category;
          next();
        }
      });
    };
  })
}
exports.deleteCategory=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      var category = req.category[0]
      debug(category.company.data.id + "=="+ company.orderSysId)
      if (category.company.data.id == company.orderSysId) {
        msc.deleteCategory(category, function(category) {
          if (category instanceof Error) {
            return next(err)
          } else {
            req.category=category;
            next();
          }
        })
      } else {
        return next({warning: 'Category does not belong to company'})
      }
    }
  })
}

exports.createMenuItem=function(req,res,next) {
  debug(req.user)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      debug(company)
      /**
      Name	Slug	Field Type	Required?	Unique?	Title Column?
      *SKU	sku	string	Yes	Yes	No
      *Product Title	title	string	Yes	No	Yes
      *Slug	slug	slug	Yes	Yes	No
      *Price	price	money	Yes	No	No
      Sale Price	sale_price	decimal	No	No	No
      *Status	status	choice	Yes	No	No
      *Category	category	multiple	Yes	No	No
      *Stock Level	stock_level	integer	Yes	No	No
      *Stock Status	stock_status	choice	Yes	No	No
      *Description	description	text	Yes	No	No
      *Requires Shipping	requires_shipping	choice	Yes	No	No
      Weight	weight	decimal	No	No	No
      Height	height	decimal	No	No	No
      Width	width	decimal	No	No	No
      Depth	depth	decimal	No	No	No
      *Catalog Only	catalog_only	choice	Yes	No	No
      Collection	collection	relationship	No	No	No
      Brand	brand	relationship	No	No	No
      *Tax Band	tax_band	tax-band	Yes	No	No
      *Company	company	relationship	Yes **/
      const title = req.body.title;
      const price = req.body.price;
      const status = req.body.status;
      const category = req.body.category;
      const description = req.body.description;

      if (!status) status = 1; // live by default TODO: turn draft by default when menu availability completed
      if (!title) {return res.status(422).send({ error: 'Title is required.'});}
      if (!price) {return res.status(422).send({ error: 'Price is required.'});}
      if (!category) {return res.status(422).send({ error: 'Category is required.'});}
      if (!description) {return res.status(422).send({ error: 'Description is required.'});}
      return msc.createMenuItem(company, title, status, price, category, description, function(menuItem) {
        if (menuItem instanceof Error) {
          debug(menuItem)
          //TODO: Check for error - duplicate sku/slug, which means the title was a duplicate
          return res.status(422).send({ error: menuItem});
        }
        else res.json(menuItem)
      })
    }
  });
};
exports.listMenuItems=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) { return next(err) }
    else {
      var data = req.body;
      msc.listMenuItems(company, data, function(menuItem) {
        if (menuItem instanceof Error) {
          debug(menuItem)
          return res.status(422).send({ error: menuItem});
        }
        else res.json(menuItem)
      })
    }
  });
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
