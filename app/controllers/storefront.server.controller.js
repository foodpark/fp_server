var User = require ('../models/user.server.model'),
    Company = require ('../models/company.server.model'),
    Customer = require ('../models/customer.server.model'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    debug = require('debug')('storefront.server.controller');

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

exports.createCategory=function*(next) {
  debug(req.user)
  try {
    var company = (yield Company.companyForUser(companyId))[0]
  } catch (err) {
    console.err('error creating category: could not find company for user')
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
      console.err('error creating category in ordering system ')
      throw(err)
  }
  this.body = category
  return;
}

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
          var message = getErrorMessage(categories);
          return res.status(500).send({ error: message });
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
          var message = getErrorMessage(category);
          return res.status(500).send({ error: message });
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
          var message = getErrorMessage(category);
          return res.status(500).send({ error: message });
        } else {
          return res.json(category);
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
      msc.deleteCategory(category, function(category) {
        if (category instanceof Error) {
          var message = getErrorMessage(category);
          return res.status(500).send({ error: message });
        } else {
          return res.json(category);
        }
      })
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
        else return res.json(menuItem)
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
        else return res.json(menuItem)
      })
    }
  });
};
exports.readMenuItem=function(req,res,next) {
	res.json(req.menuItem);
};
exports.getMenuItem=function(req,res,next,id) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err)
      return sendErrorResponse(message, res, 500)
    }
    else {
      msc.findMenuItem(company, id, function(menuItem) {
        if (menuItem instanceof Error) {
          debug(menuItem)
          return sendErrorResponse(menuItem.message, res, 500)
        } else {
          req.menuItem=menuItem;
          next();
        }
      })
    }
  })
};
exports.updateMenuItem=function(req,res,next) {
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
        var data = req.body;
        msc.updateMenuItem(company, menuItem, data, function(item) {
          if (item instanceof Error) {
            var message = getErrorMessage(item);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(item);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
exports.deleteMenuItem=function(req,res,next) {
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
        msc.deleteMenuItem(menuItem, function(item) {
          if (item instanceof Error) {
            var message = getErrorMessage(item);
            return sendErrorResponse(message, res, 500)
          } else {
            return res.json(item);
          }
        })
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};

var optionItemCreator = function(menuItemId, optionCategoryId, title, modPrice, res) {
  msc.createOptionItem(menuItemId, optionCategoryId, title, modPrice, function(optionItem) {
    if (optionItem instanceof Error) {
      debug(optionItem)
      return sendErrorResponse(optionItem, res, 422);
    }
    else return res.json(optionItem)
  })
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

exports.listOptionItems=function(req,res,next) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var mi = req.menuItem
      mi = mi[0]
      debug(mi)
      debug(mi.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var oc = req.optionCategory
        var data=req.body
        debug(oc)
        if (!oc) {
          debug('getOptionItem: No option category provided')
          // No Option Category!!
          // Lookup option category
          data.title = 'OptionItems'
          msc.listOptionCategories(mi.id, data, function(optionItemList) {
            if (optionItemList instanceof Error) {
              debug(optionItemList)
              var message = getErrorMessage(optionItemList)
              return sendErrorResponse(message,res, 422);
            }
            var optionItemCat = optionItemList[0]
            if (!optionItemCat) {
              return sendErrorResponse('Could not find Option Item list',res, 422);
            } else {
              optionItemCat = JSON.stringify(optionItemCat)
              optionItemCat = JSON.parse(optionItemCat)
              debug(optionItemCat.id)
              return res.json(optionItemCat)
            }
          })
        } else {
          msc.listOptionItems(mi.id, oc.id, data, function(optionItems) {
            if (optionItems instanceof Error) {
              return next(err)
            } else {
              return res.json(optionItems)
            }
          })
        }
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
};
exports.readOptionItem=function(req,res,next) {
	res.json(req.optionItem);
};
exports.getOptionItem=function(req,res,next,id) {
  var companyId = mongoose.Types.ObjectId(req.user.roleId);
  Company.findById(companyId, function(err,company) {
    if (err) {
      var message = getErrorMessage(err);
      return sendErrorResponse(message, res, 500)
    }
    else {
      var mi = req.menuItem
      mi = mi[0]
      debug(mi)
      debug(mi.company.data.id +'=='+ company.orderSysId)
      if (mi.company.data.id == company.orderSysId) {
        var oc = req.optionCategory
        debug(oc)
        if (!oc) {
          debug('getOptionItem: No option category provided')
          // No Option Category!!
          // Lookup option category
          msc.listOptionCategories(mi.id, '{title: "OptionItems"}', function(optionItemList) {
            if (optionItemList instanceof Error) {
              debug(optionItemList)
              var message = getErrorMessage(optionItemList)
              return sendErrorResponse(message,res, 422);
            }
            var optionItemCat = optionItemList[0]
            if (!optionItemCat) {
              return sendErrorResponse('Could not find Option Item',res, 422);
            } else {
              optionItemCat = JSON.stringify(optionItemCat)
              optionItemCat = JSON.parse(optionItemCat)
              debug(optionItemCat.id)
              msc.findOptionItem(mi.id, optionItemCat.id, req.body.optionItem, function(optionItem) {
                if (optionItem instanceof Error) {
                  return next(err)
                } else {
                  req.optionCategory = optionItemCat;
                  req.optionItem=optionItem;
                  next();
                }
              })
            }
          })
        } else {
          msc.findOptionItem(mi.id, oc.id, req.body.optionItem, function(optionItem) {
            if (optionItem instanceof Error) {
              return next(err)
            } else {
              req.optionItem=optionItem;
              next();
            }
          })
        }
      } else {
        return sendErrorResponse('Menu item does not belong to company', res, 422)
      }
    }
  })
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
