var User = require ('../models/user.server.model'),
    Company = require ('../models/company.server.model'),
    Customer = require ('../models/customer.server.model'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    debug = require('debug')('storefront');

var getErrorMessage = function(err) {
    var message = '';
    for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
    }
    return message;
};

var sendErrorResponse = function(err, res, status) {
  if (!status) status = 500
  return res.status(status).send({'error': err})
}

exports.readCompany=function *(next) {
	this.body = this.company
}

exports.getCompany=function *(id, next) {
  debug('getcategory: company id: '+ id)
  try {
    var company = (yield Company.getSingleCompany(id))[0]
  } catch (err) {
    console.error('error getting company')
    throw(err)
  }
  debug(company)
  this.company = company
  yield next;
}

exports.listCompanies=function *(next) {
  try {
    var companies = yield Company.getAllCompanies()
  } catch (err) {
    console.error('error getting companies')
    throw(err)
  }
  debug(companies)
  this.body = companies
  return;
}

exports.readCategory=function *(next) {
	this.body=this.category;
  return;
}

exports.getCategory=function *(id, next) {
  debug('getcategory: category id: '+ id)
  debug('getcategory: company '+ this.company)
  debug('getcategory: company order sys id'+ this.company.order_sys_id)
  try {
    var category = yield msc.findCategory(id)
  } catch (err) {
    console.error('error retrieving category from ordering system')
    throw(err)
  }
  debug(category)
  this.category = category
  yield next;
}

exports.createCategory=function*(next) {
  debug(req.user)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error creating category: could not find company for user')
    throw(err)
  }
  const title = req.body.title;
  const parent = req.body.parent;
  if (!title) {
    this.status=422
    this.body={ error: 'Please enter a title for the category.'}
  }
  try {
    var category = yield msc.createCategory(company, title, parent)
  } catch (err) {
      console.error('error creating category in ordering system ')
      throw(err)
  }
  this.body = category
  return;
}

exports.listCategories=function *(next) {
  var data = this.body;
  debug(this.company)
  if (!data)  data = ''
  debug(data)
  try {
    var categories = (yield msc.listCategories(this.company, data))
  } catch (err) {
    console.error('error retrieving categories from ordering system ')
    throw(err)
  }
  debug(categories)
  this.body = categories
  return;
}

exports.updateCategory=function *(next) {
  debug('update category called by' + req.user.id)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error updating category: could not find company for user')
    throw(err)
  }
  var data = req.body;
  var cat=req.category[0];
  try {
    var category = (yield msc.updateCategory(company, cat, data))[0]
  } catch (err) {
    console.error('error updating category in ordering system ')
    throw(err)
  }
  this.body = category
  return;
}

exports.deleteCategory=function *(next) {
  debug('delete category called by' + req.user.id)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error deleting category: could not find company for user')
    throw(err)
  }
  var cat = req.category[0]
  try {
    var category = (yield msc.deleteCategory(cat))[0]
  } catch (err) {
    console.error('error deleting category in ordering system ')
    throw(err)
  }
  this.body = category
  return;
}

exports.createMenuItem=function *(next) {
  debug('create menu item called by' + req.user.id)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error creating menu item: could not find company for user')
    throw(err)
  }
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
  try {
    var menuItem = (yield msc.createMenuItem(company, title, status, price, category, description))[0]
  } catch (err) {
    console.error('error creating menu item in ordering system ')
    throw(err)
  }
  this.body = menuItem
  return;
}
exports.listMenuItems=function *(next) {
  var data = this.body;
  debug(this.company)
  debug(this.category)
  if (!data)  data = ''
  debug(data)
  try {
    var results = (yield msc.listMenuItems(this.category))
  } catch (err) {
    console.error('error retrieving menu items from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}


exports.readMenuItem=function *(next) {
	this.body = this.menuItem
  return;
}

exports.getMenuItem=function *(id, next) {
  debug('getMenuItem: id: '+ id)
  try {
    var results = yield msc.findMenuItem(id)
  } catch (err) {
    console.error('error retrieving category from ordering system')
    throw(err)
  }
  debug(results)
  this.menuItem = results
  yield next;
}

exports.updateMenuItem=function *(next) {
  debug('update menu item called by' + req.user.id)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error updating menu item: could not find company for user')
    throw(err)
  }
  var menuItem = req.menuItem
  debug(menuItem.company.data.id +'=='+ company.orderSysId)
  if (mi.company.data.id == company.orderSysId) {
    var data = req.body;
    try {
      var item = (yield msc.updateMenuItem(company, menuItem, data))[0]
    } catch (err) {
      console.error('error updating menu item from ordering system ')
      throw(err)
    }
    this.body = item
    return;
  } else {
    return sendErrorResponse('Menu item does not belong to company', res, 422)
  }
}

exports.deleteMenuItem=function *(next) {
  debug('delete menu item called by' + req.user.id)
  try {
    var company = (yield Company.companyForUser(req.user.id))[0]
  } catch (err) {
    console.error('error deleting menu item: could not find company for user')
    throw(err)
  }
  var menuItem = req.menuItem
  debug(menuItem.company.data.id +'=='+ company.orderSysId)
  if (menuItem.company.data.id == company.orderSysId) {
    try {
      var item = (yield msc.deleteMenuItem(menuItem))[0]
    } catch (err) {
      console.error('error deleting menu item from ordering system ')
      throw(err)
    }
    this.body = item
    return
  } else {
    return sendErrorResponse('Menu item does not belong to company', res, 422)
  }
}

var optionItemCreator = function *(menuItemId, optionCategoryId, title, modPrice) {
  try {
    var optionItem = (yield msc.createOptionItem(menuItemId, optionCategoryId, title, modPrice))[0]
  } catch (err) {
    console.error('error creating option item in ordering system')
    throw(err)
  }
  // return res.json(optionItem)
  this.body = optionItem
  return;
}

exports.createOptionItem=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      const title = req.body.title
      if (!title) return sendErrorResponse('Title is required.',res, 422);
      const modPrice = req.modprice
      var mi = req.menuItem
      mi = mi[0]
      debug(mi)
      debug(mi.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var oc = req.optionCategory
        debug(oc)
        if (!oc) {
          debug('No option category provided')
          // No Option Category!!
          // TODO: Lookup option category
          msc.listOptionItems(mi.id, '{title: "OptionItems"}', function(optionItemList) {
            if (optionItemList instanceof Error) {
              debug(optionItemList)
              var message = getErrorMessage(optionItemList)
              return sendErrorResponse(message,res, 422);
            }
            debug(optionItemList)
            var optionItemCat = optionItemList[0]

            if (!optionItemCat) {
              // Create default optionItems category
              optionCategoryCreator(mi.id, 'optionItems', 'single', function(optionCategory) {
                debug(optionCategory)
                if (optionCategory instanceof Error) {
                  return res.status(422).send({ error: optionCategory});
                }
                debug('about to create option item')
                return optionItemCreator(mi.id, optionCategory.id, title, modPrice, res)
              })
            } else { // found existing 'OptionItems' option category
              optionItemCat = JSON.stringify(optionItemCat)
              optionItemCat = JSON.parse(optionItemCat)
              debug(optionItemCat.id)
              return optionItemCreator(mi.id, optionItemCat.id, title, modPrice, res)
            }
          })
        } else { // Option Category found
          debug('option category: '+ oc)
          return optionItemCreator(mi.id, oc, title, modPrice, res)
        }
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  });
};

exports.updateOptionItem=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = req.menuItem
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var optionCategory = req.optionCategory
        var optionItem = req.optionItem
        var data = req.body;
        msc.updateOptionItem(menuItem.id, optionCategory.id, optionItem.id, data, function(optItem) {
          if (optItem instanceof Error) {
            var message = getErrorMessage(optItem);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(optItem);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
exports.deleteOptionItem=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = req.menuItem
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var optionCategory = req.optionCategory
        var optionItem = req.optionItem
        msc.deleteOptionItem(menuItem.id, optionCategory.id, optionItem.id, function(optItem) {
          if (optItem instanceof Error) {
            var message = getErrorMessage(optItem);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(optItem);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};

var optionCategoryCreator = function (menuItemId, title, type, callback) {
  return msc.createOptionCategory(menuItemId, title, type, callback)
}

exports.createOptionCategory=function(req,res,next) {
  debug(req.user)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      const title = req.body.title;
      const type = 'variant';
      if (!title) return res.status(422).send({ error: 'Title is required.'});
      var menuItem = JSON.stringify(req.menuItem)
      menuItem = JSON.parse(menuItem)
      menuItem = menuItem[0]
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (menuItem.company.data.id == company.orderSysId) {
        return optionCategoryCreator(menuItem, title, type, function(optionCategory) {
          if (optionCategory instanceof Error) {
            debug(optionCategory)
            return res.status(422).send({ error: optionCategory});
          }
          else res.json(optionCategory)
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
}

exports.listOptionCategories=function(req,res,next) {
  debug(req.user)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = JSON.stringify(req.menuItem)
      menuItem = JSON.parse(menuItem)
      menuItem = menuItem[0]
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (menuItem.company.data.id == company.orderSysId) {
        var data = req.body
        debug(data)
        msc.listOptionCategories(menuItem.id, data, function(optionCategoryList) {
          if (optionCategoryList instanceof Error) {
            debug(optionCategoryList)
            return res.status(422).send({ error: optionCategoryList});
          }
          else res.json(optionCategoryList)
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};

exports.listOptionCategories=function *(next) {
  debug('listOptionItems')
  debug(this.menuItem)
  try {
    var results = yield msc.listOptionCategories(this.menuItem.id)
  } catch (err) {
    console.error('error retrieving option categories from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.readOptionCategory=function(req,res,next) {
	res.json(req.optionCategory);
};
exports.getOptionCategory=function(req,res,next,id) {
  debug(req.user)
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = JSON.stringify(req.menuItem)
      menuItem = JSON.parse(menuItem)
      menuItem = menuItem[0]
      var data = req.body
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (menuItem.company.data.id == company.orderSysId) {
        msc.findOptionCategory(menuItemId, id, data, function(optionCategory) {
          if (optionCategory instanceof Error) {
            return next(err)
          } else {
            req.optionCategory=optionCategory;
            next();
          }
        });
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
exports.updateOptionCategory=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = req.menuItem
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var optionCategory = req.optionCategory;
        var data = req.body;
        msc.updateOptionCategory(menuItem.id, optionCategory.id, data, function(optCat) {
          if (optCat instanceof Error) {
            var message = getErrorMessage(optCat);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(optCat);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
exports.deleteOptionCategory=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var menuItem = req.menuItem
      debug(menuItem.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var optionCategory = req.optionCategory
        msc.deleteOptionCategory(menuItem.id, optionCategory.id, function(optCat) {
          if (optCat instanceof Error) {
            var message = getErrorMessage(optCat);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(optCat);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
