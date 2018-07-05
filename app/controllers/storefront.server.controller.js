var User = require ('../models/user.server.model');
var Country = require ('../models/countries.server.model');
var Company = require ('../models/company.server.model');
var Customer = require ('../models/customer.server.model');
var auth = require('./authentication.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var debug = require('debug')('storefront');
var _ = require('lodash');
var logger = require('winston');
var Units = require('../models/unit.server.model');
var Packages = require('../controllers/packages.server.controller');
var PackageModel = require('../models/packages.server.model');
var Loyalty = require('../models/loyalty.server.model');


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

exports.getCompanyUnit = function *() {
  this.body = (yield Units.getCompanyUnit(this.params.unitId)).rows[0];
};

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

var uploadCompanyImage=function *(next) {
  debug('uploadCompanyImage')
  debug('id '+ this.company.id)
  debug('..files')
  debug(this.body.files)
  debug('..path')
  debug(this.body.files.file.path)
  debug('..check for files')
  if (!this.body.files) {
    debug('uploadCompanyImage: No image found')
    return;
  }
  debug('..found image')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('uploadCompanyImage: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('uploadCompanyImage: error uploading company image: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw(401, 'Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    var data = this.body;
    debug(data)
    var item = '';
    try {
      item = yield msc.uploadImage(this.company.id, this.body.files.file.path,'company')
    } catch (err) {
      console.error('uploadCompanyImage: error uploading menu item image in ordering system ')
      throw(err)
    }
    /*var domain = item.segments.domain;
    var suffix = item.segments.suffix;
    debug('..domain ' + domain);
    debug('..suffix ' + suffix);
    debug('..domain string length '+ domain.length)
    var domainLen = domain.length - 1 // eliminate extra slash
    debug('..len '+ domainLen);*/
    //var cdnPath = domain.substring(0,domainLen) + suffix;
    var cdnPath = item.link.href ;
    console.log('cdnpath is >>>>',cdnPath)
    debug('..cdnPath '+ cdnPath);
    return cdnPath;
  } else {
    console.error('uploadCompanyImage: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.uploadCompanyPhoto= function *(next) {
  debug('uploadCompanyPhoto')
  var cdnPath = yield uploadCompanyImage.apply(this);
  try {
    var co = yield Company.updatePhoto(this.company.id, cdnPath);
  } catch (err) {
    console.error('uploadCompanyPhoto: error assigning image to company')
    throw(err)
  }
  this.body = co
  return;
}

exports.uploadCompanyFeaturedDish= function *(next) {
  debug('uploadCompanyFeaturedDish')
  var cdnPath = yield uploadCompanyImage.apply(this);
  try {
    var co = yield Company.updateFeaturedDish(this.company.id, cdnPath);
  } catch (err) {
    console.error('uploadCompanyFeaturedDish: error assigning image to company')
    throw(err)
  }
  this.body = co
  return;
}

exports.deleteCompany=function *(next) {
  var meta = {fn: 'deleteCompany', company_id: this.company.id};
  debug('deleteCompany')
  debug('id '+ this.company.id)
  debug('order sys order id '+ this.company.order_sys_id)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user;
    meta.user_id = user.id;
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error deleting company: Owner '+ user.id + 'not associated with '+ this.company.name, meta)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    var results = '';
    try {
      //results = yield msc.deleteCompany(this.company.order_sys_id)
      // results = yield msc.softDeleteMoltinCompany(this.company);
      //get and delete
      var categories = yield msc.listCategories(this.company);
      if (categories && categories.length > 0){
        // for (category in categories){
        for (var i=0; i<categories.length; i++){
          var category=categories[i];
          var menuItems = yield msc.listMenuItems(category);
          if (menuItems && menuItems.length > 0){
            for (var j=0; j<menuItems.length; j++){
              var menuItem=menuItems[j];
              //delete menuitem 
              yield msc.updateMenuItem(menuItem.id, {status:"0"});
            } //for menuitems
          } //if menuitems
          //delete category
          yield msc.updateCategory(category.id, {status:"0"});
        }//for categories
      } //if categories
      //delete company
      msc.updateCompany(this.company.id, {status:"0"});
    } catch (err) {
      console.error('error deleting company ('+ this.company.id +') in ordering system')
      throw(err)
    }
    debug(results)
    try {
      results = yield Company.softDeleteCompany(this.company.id)
    }catch (err) {
      console.error('error deleting company ('+ this.company.id +') in SFEZ')
      throw(err)
    }

    debug(results)

    this.body = {
	    "status":true,
    	"message":"Company removed successfully"
    };
    return;
  } else {
    console.error('deleteCompany: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
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

exports.createCategory= function *(next) {
  debug('createCategory')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    debug(user)
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error creating category: Owner '+ user.id + ' not associated with '+ this.company.name)
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
    debug(this.category.company +'=='+ this.company.order_sys_id)
    if (this.category.company == this.company.order_sys_id) {
      this.body.id = this.category.id
      this.body.type = 'category'
      this.body.name = this.body.title ? this.body.title : undefined

      var data = {
        data: this.body
      }

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
  debug('id '+ this.category)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error deleting category: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.category.company +'=='+ this.company.order_sys_id)
    if (this.category.company == this.company.order_sys_id) {
        var result = '';      
  try {
            results = yield msc.deleteCategory(this.category.id)
        } catch (err) {
            console.error('error deleting category ('+ this.category.id +')')
            throw(err)
        }
        debug(results);
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
  var meta={fn:'createMenuItem'};
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        meta.error='error creating menu item: Owner '+ user.id + 'not associated with '+ this.company.name;
        logger.error('error creating menu item: Owner '+ user.id + 'not associated with '+ this.company.name, meta);
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug('...user authorized')
    debug('category company', this.category.company);
    debug('this category', this.category);
    debug('this company', this.company);
    debug(this.category.company +'=='+ this.company.order_sys_id)
    if (this.category.company == this.company.order_sys_id) {
      debug('..category and company match')
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
      var company = this.company
      var title = this.body.title;
      var price = this.body.price;
      var status = this.body.status;
      var category = this.category.id;
      var description = this.body.description;

      if (!status) status = 1; // live by default TODO: turn draft by default when menu availability completed
      if (!title) {
        this.status = 422;
        return this.body = { error: 'Title is required.'};
      }
      if (!price) {
        this.status = 422;
        return this.body = { error: 'Price is required.'};
      }
      if (!description) {
        this.status = 422;
        return this.body = { error: 'Description is required.'};
      }
      var taxBand = '';
      var currency = '';
      if (company.country_id){
        try{
          var country = (yield Country.getSingleCountry(company.country_id))[0];
          taxBand=country.tax_band;
          currency = country.currency;
        }
        catch(err){
          meta.error=err;
          logger.error('error retrieving country tax band', meta);
          throw(err);
        }
      }
      debug('..creating menu item');
      try {
        var menuItem = yield msc.createMenuItem(company, title, status, price, category, description, taxBand, currency)
      } catch (err) {
        meta.error=err;
        logger.error('error creating menu item in ordering system ', meta);
        throw(err)
      }
      debug(menuItem)
      this.body = menuItem
      return;
    } else {
      meta.error='Category does not belong to company';
      logger.error('createMenuItem: Category does not belong to company', meta);
      this.status=422
      this.body = {error: 'Category does not belong to company'}
      return;
    }
  } else {
    meta.error='User not authorized';
    logger.error('createMenuItem: User not authorized', meta);
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
         if (results && results.length > 0){
            for (var j=0; j<results.length; j++){
              
              if(results[j].hasOwnProperty('relationships'))
              {
                
                var relationship =  results[j].relationships
                if(relationship.hasOwnProperty('main_image'))
                {
                  
                  if(Array.isArray(relationship.main_image.data) == false )
                  {
                    var fileId = relationship.main_image.data.id ; 
                    var FileDetail = yield msc.getFile(fileId) ;
                    var url = FileDetail.link.href;
                    var http = url.replace(/^https?\:\/\//i, "http://");
                    var newUrl = { http : http , https : url }
                    results[j].relationships.main_image.data.url = newUrl ;
                  }
                  else
                  {
                    for(x=0; y<relationship.main_image.data.length;x++)
                    {
                      var fileId = relationship.main_image.data.id ; 
                      var FileDetail = yield msc.getFile(fileId) ;
                      var url = FileDetail.link.href;
                      var http = url.replace(/^https?\:\/\//i, "http://");
                      var newUrl = { http : http , https : url }
                      results[j].relationships.main_image.data[x].url = newUrl ;
                    }
                  }

                }
                
              }
            }
          }
  } catch (err) {
    console.error('error retrieving menu items from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}


exports.readMenuItem=function *(next) {
	
  var menuItemDetail = this.menuItem ;
  if(menuItemDetail.hasOwnProperty('relationships'))
  {
    var relationship =  menuItemDetail.relationships
    if(relationship.hasOwnProperty('main_image'))
    {
      
      var type = Array.isArray(relationship.variations.data)
      console.log('type....',type)
      if(Array.isArray(relationship.main_image.data) == false )
      {

        var fileId = relationship.main_image.data.id ; 
        var FileDetail = yield msc.getFile(fileId) ;
        var url = FileDetail.link.href;
        var http = url.replace(/^https?\:\/\//i, "http://");
        var newUrl = { http : http , https : url }
        menuItemDetail.relationships.main_image.data.url = newUrl ;
      }
      else
      {
        for(i=0; j<relationship.main_image.data.length;i++)
        {
          var fileId = relationship.main_image.data.id ; 
          var FileDetail = yield msc.getFile(fileId) ;
          var url = FileDetail.link.href;
          var http = url.replace(/^https?\:\/\//i, "http://");
          var newUrl = { http : http , https : url }
          menuItemDetail.relationships.main_image.data[i].url = newUrl ;
        }
      }

    }
    
  }
  this.body = menuItemDetail
  
  
  return ;
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
  debug('id '+ this.menuItem.id)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('updateMenuItem: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('error updating menu item: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.menuItem.company +'=='+ this.company.orderSysId)
    debug('menuitem', this.menuItem)
    if (this.menuItem.company == this.company.order_sys_id) {
      this.body.type = 'product'
      this.body.id = this.menuItem.id
      this.body.price = this.body.price ? [
        {
          amount: this.body.price,
          includes_tax: false,
          currency: this.menuItem.price[0].currency
        }
      ] : null
      this.body.name = this.body.title ? this.body.title : null
      var data = {
        data: this.body
      }
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
    debug(this.menuItem.company.order_sys_id +'=='+ this.company.order_sys_id)
    if (this.menuItem.company.order_sys_id == this.company.order_sys_id) {
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


exports.uploadMenuItemImage=function *(next) {
  
  debug('uploadMenuItemImage')
  debug('id '+ this.menuItem.id)
  debug('..files')
  debug(this.body.files)
  debug('..path')
  debug(this.body.files.file.path)
  console.log('file path is ',this.body.files.file.path);
  debug('..check for files')
  
  
  if (!this.body.files) {
    debug('uploadMenuItemImage: No image found')
    return;
  }
  debug('found image')
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('uploadMenuItemImage: Role authorized')
    var user = this.passport.user
    
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('uploadMenuItemImage: error uploading menu item image: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      
      
      var data = this.body;
      debug(data)
      try {
        var item = yield msc.uploadImage(this.menuItem.id, this.body.files.file.path,'menu')
      } catch (err) {
        console.error('uploadMenuItemImage: error uploading menu item image in ordering system ')
        throw(err)
      }
      this.body = item
      return;
    } else {
      console.error('uploadMenuItemImage: updateMenuItem: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('uploadMenuItemImage: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.deleteImage=function *(next) {
  debug('deleteImage')
  debug('...id '+ this.params.imageId)
  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('deleteImage: Role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('deleteImage: error deleting menu item iamge: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      try {
        var message = yield msc.deleteImage(this.params.imageId)
      } catch (err) {
        console.error('deleteImage: error deleting menu item image in ordering system ')
        throw(err)
      }
      this.body = message
      return;
    } else {
      console.error('deleteImage: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('deleteImage: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

var optionItemCreator = function *(menuItemId, optionCategoryId, title, modPrice) {
  try {
    var optionItem = yield msc.createOptionItem(optionCategoryId, title, modPrice)
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
  
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
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
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      var title = this.body.title
      if (!title) {
        this.status = 422
        this.body = { error: 'Title is required.'}
        return;
      }
      var description = this.body.description
      debug('...title '+ title)
      debug('...description '+ description)
      
      if(this.optionCategory)
      var optionCategoryId = this.optionCategory.id
      
      // if no optioncategoryId, must find or create the OptionItems category
      if (!optionCategoryId) {
        debug('...no option category provided. Must be for OptionItems category. Finding...')
        console.log('no optioncategory found')
          debug('...no OptionItems category found. Creating new...')
          var results = yield msc.createOptionCategory('OptionCategoryVariation')
          console.log('craete new variation',results)
          var relationship_result = yield msc.createRelationship(this.menuItem.id, results.id)
          console.log('create relationship',relationship_result)
          optionCategoryId = results.id
      }
      debug('...optionCategoryId '+ optionCategoryId)
      try {
        var results = yield msc.createOptionItem(optionCategoryId, title, description)
        console.log('option output:',results)
      } catch (err) {
        console.error('createOptionItem: Error creating option item ('+ title +', '+ description +')')
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

exports.getoptionItem = function *(id, next) {
  
  this.optionItem  = {'id': id }
  yield next; 
  
}

exports.updateOptionItem=function *(next) {
  debug('updateOptionItem')
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
  debug('...option Item '+ this.optionItem)
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
    debug(this.menuItem.company +'=='+ this.company.orderSysId)
    if (this.menuItem.company == this.company.order_sys_id) {
       var title = this.body.title ;
       var description = this.body.description ;
      try {
        var results = yield msc.updateOptionItem(this.optionCategory.id, this.optionItem.id, title,description)
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
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
  debug('...option Item '+ this.optionItem)
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
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      try {
        var message = yield msc.deleteOptionItem(this.optionCategory.id, this.optionItem.id)
      } catch (err) {
        console.error('deleteOptionItem: Error deleting option item  ('+ this.optionItem.id +')')
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


/* function to create variation */
exports.createOptionCategory=function *(func, params, next) {
  
  debug('createOptionCategory')
  debug('...menu item '+ this.menuItem)
  var title = this.body.title
  if (!title) {
    this.status=422
    this.body = { error: 'Title is required.'}
    return;
  }

  if (auth.isAuthorized(auth.OWNER, auth.ADMIN)) {
    debug('...role authorized')
    var user = this.passport.user
    if (user.role == auth.OWNER && user.id != this.company.user_id) {
        console.error('createOptionCategory: Owner '+ user.id + 'not associated with '+ this.company.name)
        throw('createOptionCategory: Owner '+ this.user.id + ' not associated with '+ this.company.name)
    }
    debug('...user authorized')
    if (!this.menuItem) {
      
      try {

        debug('...getting menu item ')
        this.menuItem = yield internalGetMenuItem(this.params.menuItemId)
        
      }  catch (err) {
        console.error('createOptionCategory: Error retreiving menu item ('+ this.params.menuItemId +')')
        throw(err)
      }
    }
    debug('...checking menu item belongs to company owner')
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      try {

        debug('...calling moltin create option category')
        var results = yield msc.createOptionCategory(title)
        console.log('result is :',results)
        var relationship_result = yield msc.createRelationship(this.menuItem.id, results.id)
        
      } catch (err) {
        console.error('createOptionCategory: Error creating '+ title +' option category')
        throw(err)
      }
      debug(results)
      this.body = results
      return;
    } else {
      console.error('createOptionCategory: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('createOptionCategory: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }
}

exports.listOptionCategories=function *(next) {
  debug('listOptionItems')
  debug('menu item '+ this.menuItem.id)
  try {
    
    var results = yield msc.listOptionCategories(this.menuItem.id)
  } catch (err) {
    console.error('listOptionCategories: Error retrieving option categories from ordering system ')
    throw(err)
  }
  debug(results)
  this.body = results
  return;
}

exports.getoptionCategory = function *(id, next) {
  
  debug('getoptionCategory')
  debug('id '+ id)
  try {
    console.log('id is :',id)
    var results = yield msc.findoptionCategory(id)
  } catch (err) {
    console.error('error retrieving option Category from ordering system')
    throw(err)
  }
  debug(results)
  
  this.optionCategory = results
  yield next; 
  
}

exports.readOptionCategory= function *(next) {
  
  this.body = this.optionCategory
  return;
}

exports.updateOptionCategory=function *(next) {
  debug('updateOptionCategory')
  debug('menu item '+this.menuItem)
  debug('option category '+ this.optionCategory)
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
    debug('...'+ this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      debug(this.body)
      var title = this.body.title
      try {
        var results = yield msc.updateOptionCategory(this.optionCategory.id, title)
      } catch (err) {
        console.error('updateOptionCategory: Error updating option category '+ this.optionCategory.name +' ('+ this.optionCategory.id +')')
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
  debug('...menu item '+this.menuItem)
  debug('...option category '+ this.optionCategory)
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
    debug('...'+ this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      try {
        var results = yield msc.deleteOptionCategory(this.optionCategory.id)
      } catch (err) {
        console.error('deleteOptionCategory: Error deleting option category ('+ this.optionCategory.id +')')
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

//yield msc.createOptionExtra(this.optionCategory.id,this.optionItem.id,data)
exports.createModifier = function *(next)
{

   debug('createmodifier')
  
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
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
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      

      var modifier_type = this.body.modifier_type
      if (!modifier_type) {
            this.status = 422
            this.body = { error: 'modifier_type is required.'}
            return;
          }
        debug('...modifier_type '+ modifier_type)
      if(modifier_type === 'slug_builder' || modifier_type === 'sku_builder')
      {
         console.log('sku slug type')
          var seek = this.body.seek
          var set  = this.body.set
          
          
          if(!seek) {
            this.status = 422
            this.body = { error: 'Value for Seek is required.'}
            return;
          }
          if(!set) {
            this.status = 422
            this.body = { error: 'Value for set is required.'}
            return;
          }
          
          var data = {
                          "type": "modifier",
                          "modifier_type": modifier_type,
                          "value": 
                          {
                           "seek": seek,
                           "set": set
                          }
                        }

          
          
          debug('...seek '+ seek)
          debug('...set'+set)
      }
      else if(modifier_type === 'price_increment' || modifier_type === 'price_decrement' ) {
         console.log('price type')

        var currency = this.body.currency 
        var amount   = this.body.amount

        if(!amount) {
            this.status = 422
            this.body = { error: 'Value for amount is required.'}
            return;
          }
          if(!currency) {
            this.status = 422
            this.body = { error: 'Value for currency is required.'}
            return;
          }

          var data = {
                          "type": "modifier",
                          "modifier_type": modifier_type,
                           "value": [
                                  {
                                    "currency": currency,
                                    "amount": parseFloat(amount),
                                    "includes_tax": false
                                  }
                                ]
                        }

          
          
          debug('...currency '+ currency)
          debug('...amount'+amount)

      }
      
      if(this.optionCategory)
      {     
        debug('...optionCategory id '+ this.optionCategory.id)
        
        try {
          var results = yield msc.createModifer(this.optionCategory.id,this.optionItem.id,data)
          console.log('modifer output:',results)
        } catch (err) {
          console.error('createModifier: Error creating modifier item ('+data+')')
          throw(err)
        }
        debug(results)
        this.body = results
        return;
      }
      else {
      console.error('createModifier: optioncategory does not found for menuitem')
      this.status=422
      this.body = {error: 'optioncategory does not found for menuitem'}
      return;
      }

    } else {
      console.error('createModifier: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('createModifier: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }

}

exports.getmodifier = function *(id, next) {
  
  this.modifier  = {'id': id }
  yield next; 
  
}

exports.updateModifier = function *(next) {

 debug('updatemodifier')
  
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
  debug('...optionItem'+this.optionItem)
  debug('...modifier'+this.modifier)
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
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      var modifier_type = this.body.modifier_type
      if (!modifier_type) {
            this.status = 422
            this.body = { error: 'modifier_type is required.'}
            return;
          }
        debug('...modifier_type '+ modifier_type)
      if(modifier_type === 'slug_builder' || modifier_type === 'sku_builder')
      {
         console.log('sku slug type')
          var seek = this.body.seek
          var set  = this.body.set
          
          
          if(!seek) {
            this.status = 422
            this.body = { error: 'Value for Seek is required.'}
            return;
          }
          if(!set) {
            this.status = 422
            this.body = { error: 'Value for set is required.'}
            return;
          }
          
          var data = {
                          "type": "modifier",
                          "modifier_type": modifier_type,
                          "value": 
                          {
                           "seek": seek,
                           "set": set
                          }
                        }

          console.log('data is ',data)
          
          debug('...seek '+ seek)
          debug('...set'+set)
      }
      else if(modifier_type === 'price_increment' || modifier_type === 'price_decrement' ) {
         console.log('price type')

        var currency = this.body.currency 
        var amount   = this.body.amount

        if(!amount) {
            this.status = 422
            this.body = { error: 'Value for amount is required.'}
            return;
          }
          if(!currency) {
            this.status = 422
            this.body = { error: 'Value for currency is required.'}
            return;
          }

          var data = {
                          "type": "modifier",
                          "modifier_type": modifier_type,
                           "value": [
                                  {
                                    "currency": currency,
                                    "amount": parseFloat(amount),
                                    "includes_tax": false
                                  }
                                ]
                        }

          
          
          debug('...currency '+ currency)
          debug('...amount'+amount)

      }
      
      if(this.optionCategory)
      {     
        debug('...optionCategory id '+ this.optionCategory.id)
        
        try {
          var results = yield msc.updateModifer(this.optionCategory.id,this.optionItem.id,this.modifier.id,data)
          console.log('modifer output:',results)
        } catch (err) {
          console.error('updateModifier: Error updating modifier item ('+data+')')
          throw(err)
        }
        debug(results)
        this.body = results
        return;
      }
      else {
      console.error('updateModifier: optioncategory does not found for menuitem')
      this.status=422
      this.body = {error: 'optioncategory does not found for menuitem'}
      return;
      }

    } else {
      console.error('updateModifier: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('updateModifier: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }


}

exports.deleteModifier = function *(next) {
  debug('deleteModifier')
  
  debug('...menu item '+ this.menuItem)
  debug('...optionCategory '+ this.optionCategory)
  debug('...optionItem'+this.optionItem)
  debug('...modifier'+this.modifier)
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
    debug(this.menuItem.company +'=='+ this.company.order_sys_id)
    if (this.menuItem.company == this.company.order_sys_id) {
      
      if(this.optionCategory)
      {     
        debug('...optionCategory id '+ this.optionCategory.id)
        
        try {
          var results = yield msc.deleteModifer(this.optionCategory.id,this.optionItem.id,this.modifier.id)
          console.log('modifer output:',results)
        } catch (err) {
          console.error('DeleteModifier: Error deleting modifier ('+this.modifier.id+')')
          throw(err)
        }
        debug(results)
        this.body = results
        return;
      }
      else {
      console.error('DeleteModifier: optioncategory does not found for menuitem')
      this.status=422
      this.body = {error: 'optioncategory does not found for menuitem'}
      return;
      }

    } else {
      console.error('DeleteModifier: Menu item does not belong to company')
      this.status=422
      this.body = {error: 'Menu item does not belong to company'}
      return;
    }
  } else {
    console.error('DeleteModifier: User not authorized')
    this.status=401
    this.body = {error: 'User not authorized'}
    return;
  }

}

exports.redeemLoyalty=function* (next) {
  var company = this.body.company_id;
  var customer = this.body.customer_id;
  var tier = this.body.tier;
  var points = tier === 'gold' ? 15 : (tier === 'silver' ? 10 : 5);

  var userCustomer = (yield Customer.getUser(customer)).rows[0];

  var tierPackage = yield Loyalty.getTierPackage(company,tier);

  yield Packages.givePackageAux(1, tierPackage.package_id, userCustomer.id);
  var packageGiven = (yield PackageModel.getGivenPackage(userCustomer.id, tierPackage.package_id));

  var customerLoyalty = (yield Loyalty.getPointBalance(customer, company))[0];

  if (customerLoyalty.balance < points) {
    this.status = 401;
    this.body = {error : 'Not enough points'};
    return;
  }

  var newBal = customerLoyalty.balance - points;

  var isEligible_five = false;
  var isEligible_ten = false;
  var isEligible_fifteen = false;

  if (newBal >= 5) {
      isEligible_five = true;
    }
    if (newBal >= 10) {
    isEligible_ten = true;
  }
  if (newBal >= 15) {
    isEligible_fifteen = true;
  }

  var updatedLoyalty = {
    balance: newBal,
    eligible_five: isEligible_five,
    eligible_ten: isEligible_ten,
    eligible_fifteen: isEligible_fifteen,
    updated_at: new Date()
  };

  yield Loyalty.updateLoyalty(customer, company, updatedLoyalty);

  this.status = 200;
  this.body = {
      success : "QR code generated",
      qr_code : packageGiven.qr_code
  }
};

exports.getLoyaltyInfo = function *() {
  var company = this.params.companyId;
  var customer = this.params.customerId;

  var data = yield Loyalty.getLoyaltyInfo(customer, company);

  this.status = 200;
  this.body = data.rows;
};

exports.getCompanyLoyaltyInfo = function *() {
  var company = this.params.companyId;

  var data = yield Loyalty.getCompanyLoyaltyInfo(company);

  this.status = 200;
  this.body = data.rows;
};

