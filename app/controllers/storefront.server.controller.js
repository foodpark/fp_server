var User = require ('../models/user.server.model'),
    Company = require ('../models/company.server.model'),
    Customer = require ('../models/customer.server.model'),
    auth = require('./authentication.server.controller')
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
  debug('getcompany: company id: '+ id)
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

exports.createCategory=function *(next) {
  debug('createcategory')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    debug(user)
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error creating category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.body)
    debug(this.body.title)
    debug(this.body.parent)
    var title = this.body.title;
    var parent = this.body.parent;
    if (!title) {
      this.status=422
      this.body={ error: 'Please enter a title for the category.'}
    }
    try {
      debug(this.company)
      var category = yield msc.createCategory(this.company, title, parent)
    } catch (err) {
        console.error('error creating category in ordering system ')
        throw(err)
    }
    this.body = category
    return;
  } else {
    this.status=401
    this.body = {error: 'User not authorized'}
  }
}

exports.listCategories=function *(next) {
  debug('listCategories')
  debug(this.company)
  try {
    var categories = (yield msc.listCategories(this.company))
  } catch (err) {
    console.error('error retrieving categories from ordering system ')
    throw(err)
  }
  debug(categories)
  this.body = categories
  return;
}

exports.updateCategory=function *(next) {
  debug('updateCategory')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error updating category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    var data = this.body
    debug('data '+ data.toString())
    try {
      var results = yield msc.updateCategory(this.category.id, data)
    } catch (err) {
      console.error('error updating category ('+ id +')')
      throw(err)
    }
    debug(results)
    this.body = results
    return;
  } else {
    this.status=401
    this.body = {error: 'User not authorized'}
  }
}

exports.deleteCategory=function *(next) {
  debug('deleteCategory: id '+ this.category.id)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error deleting category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    try {
      var results = yield msc.deleteCategory(this.category.id)
    } catch (err) {
      console.error('error deleting category ('+ this.category.id +')')
      throw(err)
    }
    debug(results)
    this.body = results
    return;
  } else {
    this.status=401
    this.body = {error: 'User not authorized'}
  }
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

exports.createOptionItem=function *(next) {
  debug('updateOptionItem')
  var title = this.body.title
  if (!title) {
    this.status = 422
    this.body = { error: 'Title is required.'}
    return;
  }
  var modPrice = this.body.modprice
  debug(this.menuItem)
  var optionCategoryId = ''
  if (this.optionCategory) {
    debug(optionCategory)
    optionCategoryId = this.optionCategory.id
  } else {
    debug('No option category provided')
  }
  try {
    var results = (yield optionCategoryCreator(this.menuItem.id, optionCategoryId, title, modPrice))[0]
  } catch (err) {
    console.error('error creating option item ('+ title +', '+ modPrice +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}


exports.updateOptionItem=function *(id) {
  debug('updateOptionItem')
  debug(this.menuItem)
  var optionCategoryId = ''
  if (this.optionCategory) {
    debug(this.optionCategory)
    optionCategoryId = this.optionCategory.id
  } else {
    debug('No option category provided')
  }
  debug(this.body)
  var data = this.body
  try {
    var results = (yield msc.updateOptionItem(this.menuItem.id, this.optionCategory.id, id, data))[0]
  } catch (err) {
    console.error('error updating option item ('+ id +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.deleteOptionItem=function *(id) {
  debug('deleteOptionItem')
  debug(this.menuItem)
  var optionCategoryId = ''
  if (this.optionCategory) {
    debug(this.optionCategory)
    optionCategoryId = this.optionCategory.id
  } else {
    debug('No option category provided')
  }
  try {
    var results = (yield msc.deleteOptionItem(this.menuItem.id, optionCategoryId, id))[0]
  } catch (err) {
    console.error('error deleting option item ('+ id +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

var optionCategoryCreator = function (menuItemId, parent, title, type) {
  return msc.createOptionCategory(menuItemId, parent, title, type)
}

exports.createOptionCategory=function *(next) {
  debug('createOptionCategory')
  debug(this.menuItem)
  debug(this.body)
  var title = this.body.title
  if (!title) {
    this.status=422
    this.body = { error: 'Title is required.'}
    return;
  }
  var parent = this.parent
  if (!parent) {
    this.status=422
    this.body = { error: 'Parent category is required.'}
    return;
  }
  var type = 'variant'
  var data = this.body
  try {
    var results = (yield optionCategoryCreator(this.menuItem.id, parent, title, type))[0]
  } catch (err) {
    console.error('error updating option category '+ this.optionCategory.title +' ('+ id +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}


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

exports.getOptionCategory=function *(id) {
  debug('getOptionCategory: id: '+ id)
  debug(this.menuItem)
  debug(id)
  try {
    var results = yield msc.findOptionCategory(this.menuItem.id, id)
  } catch (err) {
    console.error('error getting category ('+ id +') from ordering system')
    throw(err)
  }
  debug(results)
  this.optionCategory = results
  yield next;
}

exports.updateOptionCategory=function *(next) {
  debug('updateOptionCategory')
  debug(this.menuItem)
  debug(this.optionCategory)
  debug(this.body)
  var data = this.body
  try {
    var results = (yield msc.updateOptionCategory(this.menuItem.id, this.optionCategory.id, data))[0]
  } catch (err) {
    console.error('error updating option category '+ this.optionCategory.title +' ('+ id +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.deleteOptionCategory=function *(id) {
  debug('updateOptionCategory')
  debug(this.menuItem)
  try {
    var results = (yield msc.deleteOptionCategory(this.menuItem.id, id))[0]
  } catch (err) {
    console.error('error deleting option category '+ this.optionCategory.title +' ('+ id +')')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}
