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
  debug('getCompany')
  debug('id ' + id)
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
  debug('getCategory')
  debug('id '+ id)
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
  debug('createCategory')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    debug(user)
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error creating category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
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
    console.error('createCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
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
    debug(this.category.company.data.id +'=='+ this.company.order_sys_id)
    if (this.category.company.data.id == this.company.order_sys_id) {
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
      console.error('updateCategory: Category does not belong to company')
      this.status=422
      this.body = {error: 'Category does not belong to company'}
      return;
    }
  } else {
    console.error('updateCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.deleteCategory=function *(next) {
  debug('deleteCategory')
  debug('id '+ this.category.id)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error deleting category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.category.company.data.id +'=='+ this.company.order_sys_id)
    if (this.category.company.data.id == this.company.order_sys_id) {
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
      console.error('deleteCategory: Category does not belong to company')
      this.status=422
      this.body = {error: 'Category does not belong to company'}
      return;
    }
  } else {
    console.error('deleteCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.createMenuItem=function *(next) {
  debug('createMenuItem')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('createMenuItem: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error creating menu item: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.category.company.data.id +'=='+ this.company.order_sys_id)
    if (this.category.company.data.id == this.company.order_sys_id) {
      /** MOLTIN PRODUCT FIELDS
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
      const company = this.company
      const title = this.body.title;
      const price = this.body.price;
      const status = this.body.status;
      const category = this.category.id;
      const description = this.body.description;

      if (!status) status = 1; // live by default TODO: turn draft by default when menu availability completed
      if (!title) {return res.status(422).send({ error: 'Title is required.'});}
      if (!price) {return res.status(422).send({ error: 'Price is required.'});}
      if (!description) {return res.status(422).send({ error: 'Description is required.'});}
      try {
        var menuItem = yield msc.createMenuItem(company, title, status, price, category, description)
      } catch (err) {
        console.error(err)
        console.error('error creating menu item in ordering system ')
        throw(err)
      }
      debug(menuItem)
      this.body = menuItem
      return;
    } else {
      console.error('createMenuItem: Category does not belong to company')
      this.status=422
      this.body = {error: 'Category does not belong to company'}
      return;
    }
  } else {
    console.error('createMenuItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
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
  debug('getMenuItem')
  debug('id '+ id)
  try {
    var results = yield msc.findMenuItem(id)
  } catch (err) {
    console.error('error retrieving menu item from ordering system')
    throw(err)
  }
  debug(results)
  this.menuItem = results
  yield next;
}

var internalGetMenuItem = function *(id) {
  debug('internalGetMenuItem')
  debug('id '+ id)
  try {
    var results = yield msc.findMenuItem(id)
  } catch (err) {
    console.error('error retrieving menu item from ordering system')
    throw(err)
  }
  return results
}

exports.updateMenuItem=function *(next) {
  debug('updateMenuItem')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('updateMenuItem: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error updating menu item: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.orderSysId)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      var data = this.body;
      try {
        var item = yield msc.updateMenuItem(this.menuItem.id, data)
      } catch (err) {
        console.error('error updating menu item in ordering system ')
        throw(err)
      }
      this.body = item
      return;
    } else {
      console.error('updateMenuItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('updateMenuItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.deleteMenuItem=function *(next) {
  debug('deleteMenuItem')
  debug('id '+ this.menuItem.id)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('deleteMenuItem: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error deleting menu item: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      try {
        var message = yield msc.deleteMenuItem(this.menuItem.id)
      } catch (err) {
        console.error('error deleting menu item in ordering system ')
        throw(err)
      }
      this.body = message
      return;
    } else {
      console.error('deleteMenuItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('deleteMenuItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

var optionItemCreator = function *(menuItemId, optionCategoryId, title, modPrice) {
  try {
    var optionItem = yield msc.createOptionItem(menuItemId, optionCategoryId, title, modPrice)
  } catch (err) {
    console.error('error creating option item in ordering system')
    throw(err)
  }
  // return res.json(optionItem)
  this.body = optionItem
  return;
}


exports.listOptionItems=function *(next) {
  debug('listOptionItems')
  debug('menu item '+ this.params.menuItemId)
  debug('option category '+ this.params.optionCategoryId)
  try {
    debug('calling msc.listOptionItems')
    var results = yield msc.listOptionItems(this.params.menuItemId, this.params.optionCategoryId)
  } catch (err) {
    console.error('listOptionItems: Error retrieving option items from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.readOptionItem= function *(next) {
  debug('readOptionItem')
  debug('menu item '+ this.params.menuItemId)
  debug('option category ' +this.params.optionCategoryId)
  debug('option item '+ this.params.optionItemId)
  try {
    var results = yield msc.findOptionItem(this.params.menuItemId, this.params.optionCategoryId, this.params.optionItemId)
  } catch (err) {
    console.error('readOptionItem: error getting option item ('+ this.params.optionItemId +') from ordering system')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.createOptionItem=function *(next) {
  debug('createOptionItem')
  debug('...menu item '+ this.params.menuItemId)
  debug('...optionCategory '+ this.params.optionCategoryId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('createOptionItem: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('createOptionItem: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      var title = this.body.title
      if (!title) {
        this.status = 422
        this.body = { error: 'Title is required.'}
        return;
      }
      var modPrice = this.body.modprice
      debug(this.menuItem)

      //TODO: if no optioncategoryId, must try to retrieve, then create default Option Items
      //TODO: double-check if possible to retrieve modifier by name - Moltin says not possible so could end up
      //TODO: with a painful problem: >1 OptionItem categories

      try {
        var results = yield optionItemCreator(this.menuItem.id, this.params.optionCategoryId, title, modPrice)
      } catch (err) {
        console.error('createOptionItem: Error creating option item ('+ title +', '+ modPrice +')')
        throw(err)
      }
      debug(results)
      this.body = results
      return;
    } else {
      console.error('createOptionItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('createOptionItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.updateOptionItem=function *(next) {
  debug('updateOptionItem')
  debug('...menu item '+ this.params.menuItemId)
  debug('...optionCategory '+ this.params.optionCategoryId)
  debug('...option Item '+ this.params.optionItemId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('updateOptionItem: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('updateOptionItem: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.orderSysId)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      var data = this.body;
      try {
        var results = yield msc.updateOptionItem(this.menuItem.id, this.params.optionCategoryId, this.params.optionItemId, data)
      } catch (err) {
        console.error('updateOptionItem: Error updating option item in ordering system ')
        throw(err)
      }
      this.body = results
      return;
    } else {
      console.error('updateOptionItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('updateOptionItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.deleteOptionItem=function *(next) {
  debug('deleteOptionItem')
  debug('...menu item '+ this.params.menuItemId)
  debug('...optionCategory '+ this.params.optionCategoryId)
  debug('...option Item '+ this.params.optionItemId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('deleteOptionItem: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('deleteOptionItem: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      try {
        var message = yield msc.deleteOptionItem(this.menuItem.id, this.params.optionCategoryId, id)
      } catch (err) {
        console.error('deleteOptionItem: Error deleting option item  ('+ this.params.optionItemId +')')
        throw(err)
      }
      this.body = message
      return;
    } else {
      console.error('deleteOptionItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('deleteOptionItem: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}


var optionCategoryCreator = function (menuItemId, title, type) {
  return msc.createOptionCategory(menuItemId, title, type)
}

// this.menuitem -> this.params.menuItemId
// this.params.optionCategoryId
// this.params.optionItemId
// data

var executeRequest=function *(func, params, next) {
  debug('execute request')
  debug('...menu item '+ params.menuItemId)
  debug('...optionCategory '+ params.optionCategoryId)
  debug('...optionItem '+ params.optioItmeId)

  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug(this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {

      try {
        var results = yield func(params)
      } catch (err) {
        console.error('Error performing action ('+ params +')')
        throw(err)
      }
      debug(results)
      this.body = results
      return;
    } else {
      console.error('Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.createOptionCategory=function *(next) {
  debug('createOptionCategory')
  debug('menu item '+ this.params.menuItemId)
  debug(this.body)
  var title = this.body.title
  if (!title) {
    this.status=422
    this.body = { error: 'Title is required.'}
    return;
  }
  var params = {
    title: title,
    type: 'variant',
    menuItemId: this.params.menuItemId
  }
  try {
    var results = yield executeRequest(optionCategoryCreator, params)
  } catch (err) {
    console.error('error updating option category '+ title)
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}


exports.listOptionCategories=function *(next) {
  debug('listOptionItems')
  debug('menu item '+ this.params.menuItemId)
  try {
    var results = yield msc.listOptionCategories(this.params.menuItemId)
  } catch (err) {
    console.error('listOptionCategories: Error retrieving option categories from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.readOptionCategory= function *(next) {
  debug('readOptionCategory')
  debug('optionCategory ' +this.params.optionCategoryId)
  debug('company '+ this.params.companyId)
  debug('menu item '+ this.params.menuItemId)
  try {
    var results = yield msc.findOptionCategory(this.params.menuItemId, this.params.optionCategoryId)
  } catch (err) {
    console.error('readOptionCategory: error getting option category ('+ id +') from ordering system')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.updateOptionCategory=function *(next) {
  debug('updateOptionCategory')
  debug('menu item '+this.params.menuItemId)
  debug('option category '+ this.params.optionCategoryId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('updateOptionCategory: Error updating option category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('updateOptionCategory: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug('...'+ this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      debug(this.body)
      var data = this.body
      try {
        var results = yield msc.updateOptionCategory(this.params.menuItemId, this.params.optionCategoryId, data)
      } catch (err) {
        console.error('updateOptionCategory: Error updating option category '+ this.optionCategory.title +' ('+ id +')')
        throw(err)
      }
      debug(results)
      this.body = results
      return;

    } else {
      console.error('updateOptionCategory: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('updateOptionCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.deleteOptionCategory=function *(next) {
  debug('deleteOptionCategory')
  debug('...menu item '+this.params.menuItemId)
  debug('...option category '+ this.params.optionCategoryId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('deleteOptionCategory: Error deleting option category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    if (!this.menuItem) {
      try {
        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
      }  catch (err) {
        console.error('deleteOptionCategory: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug('...'+ this.menuItem.company.data.id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.data.id == this.company.order_sys_id) {
      try {
        var results = yield msc.deleteOptionCategory(this.params.menuItemId, this.params.optionCategoryId)
      } catch (err) {
        console.error('deleteOptionCategory: Error deleting option category ('+ this.params.optionCategoryId +')')
        throw(err)
      }
      debug(results)
      this.body = results
      return;

    } else {
      console.error('deleteOptionCategory: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('deleteOptionCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}
