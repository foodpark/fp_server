var debug = require('debug')('moltin');
var fs = require('fs');
var sts = require('./security.server.controller');
var config = require('../../config/config');
var request = require('requestretry');


const DELETE = 'DELETE';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';

const CATEGORIES = '/categories';
const IMAGES = '/files';
const MENU_ITEMS = '/products';
const OPTION_CATEGORIES = '/modifiers';
const OPTION_ITEMS = '/variations';
const ORDERS = '/orders';

var bearerToken='';

var refreshBearerToken = function () {
  debug('refreshBearerToken');
  request.post({
      url: config.moltinAuthUrl,
      form: {
        'client_id': config.clientId,
        'client_secret': config.client_secret,
        'grant_type': 'refresh_token',
        'refresh_token': bearerToken
      },
      maxAttempts: 3,
      retryDelay: 150,  // wait for 150 ms before trying again
  })
  .then(function (res) {
    var data = qs.parse(res.body);
    bearerToken=body.access_token;
    return bearerToken
  })
  .catch( function(err) {
    console.error("refreshBearerToken: statusCode: " + err.statusCode);
    console.error("refreshBearerToken: statusText: " + err.statusText);
    return err

  })
}

var oAuthMoltin = function *(next) {
  debug('oAuthMoltin');
  return new Promise( function(resolve, reject) {
    request.post({
      url: config.moltinAuthUrl,
      form: {
        'client_id': config.clientId,
        'client_secret': config.client_secret,
        'grant_type': config.grant_type
      },
      maxAttempts: 3,
      retryDelay: 150,  // wait for 150 ms before trying again
    })
    .then(function(res) {
      var data = JSON.parse(res.body);
      bearerToken=data.access_token;
      debug(bearerToken)
      resolve(bearerToken)
      return;
    })
    .catch( function(err) {
      console.error("oAuthMoltin: statusCode: " + err.statusCode);
      console.error("oAuthMoltin: statusText: " + err.statusText);
      reject (err)
    })
  })
}

var getBearerToken = function *(next) {
  debug('getBearerToken');
  if (bearerToken=='') {
    debug('...get new bearer token')
    try {
      bearerToken = yield oAuthMoltin();
    } catch (err) {
      console.error(err)
      throw (err)
    }
  }
  debug('...return bearer token '+ bearerToken)
  return bearerToken
};

var sendRequest = function *(url, method, data) {
  debug('sendRequest')
  try {
    var token = yield getBearerToken()
    debug('...token '+ token)
  } catch (err) {
    console.error(err)
    throw (err)
  }
  return new Promise(function(resolve, reject) {
    request({
      method: method,
      url: url,
      json: data,
      headers: {
        'Authorization': 'Bearer '+ token
      },
      maxAttempts: 3,
      retryDelay: 150,  // wait for 150 ms before trying again
    })
    .then( function (res) {
      debug('status code '+ res.statusCode)
      debug('sendRequest: parsing...')
      debug(res.body)
      if (res.statusCode == 401 ) { // Unauthorized
        debug('...Access token expired')
        debug('...clear bearer token and throw error')
        bearerToken = '';
        reject({'statusCode': 401, 'error': 'Unauthorized'})
      }
      var result = res.body.result
      if (method == GET) result = JSON.parse(res.body).result
      if (method == DELETE) result = JSON.parse(res.body)
      resolve (result)
      return;

    })
    .catch( function (err) {
      console.error("...statusCode: " + err.statusCode);
      console.error("...statusText: " + err.statusText);
      reject (err)
    })
  })
}

var requestEntities = function *(flow, method, data, id, params) {
  debug('requestEntities')
  debug('... id is '+ id)
  var oid = '';
  if (id) oid = '/'+id
  var urlParams = '';
  if (params) urlParams = '?'+params;
  var url = config.moltinStoreUrl + flow + oid + urlParams
  debug('...url : '+ url)
  try {
    var result = yield sendRequest(url, method, data)
  } catch (err) {
    console.error(err)
    if (err.statusCode == 401) {
      // try again with fresh bearerToken
      try {
        result = yield sendRequest(url, method, data)
      } catch (err) {
        console.error(err)
        throw(err)
      }
    } else {
        throw(err)
      }
  }
  debug('requestEntities: ...returning')
  debug(result)
  return result
}

exports.createCompany=function *(sfezCompany) {
  debug('createCompany')
  var flow = '/flows/companies/entries'
  var data = {
    'name': sfezCompany.name,
    'email': sfezCompany.email
  }
  debug(data)
  try {
    var result = yield requestEntities(flow, POST, data)
  } catch (err) {
    console.error(err)
    throw(err)
  }
  debug(result)
  return result
}

exports.createDefaultCategory=function(moltincompany) {
  debug('company name : '+ moltincompany.name)
  debug('company email : '+ moltincompany.email)
  var date = new Date().getTime()
  debug('date '+ date)
  var slug = moltincompany.name.replace(/\W+/g, '-').toLowerCase();
  slug = slug + '-' + date;
  debug('slug '+ slug)
  var flow = "/categories"
  var data = {
    'slug': slug,
    'status': 1,
    'title': moltincompany.name + ' Menu',
    'description': moltincompany.name + ' Menu',
    'company': moltincompany.id
  }
  return requestEntities(flow, POST, data)
};

exports.createCategory=function (company, catTitle, catParent) {
  debug('createCategory')
  var catSlug = company.base_slug + '-' + catTitle.replace(/\W+/g, '-').toLowerCase();
  if (!catParent) catParent = company.default_cat;
  var data = {
    parent: catParent,
    slug : catSlug,
    status : 1,
    title : catTitle,
    description : catTitle,
    company : company.order_sys_id
  }
  debug(data)
  return requestEntities(CATEGORIES, POST, data)
};

exports.findCategory=function (categoryId) {
  debug('findCategory')
  debug('category id '+ categoryId)
  return requestEntities(CATEGORIES, GET, '', categoryId)
};

exports.listCategories=function(company) {
  debug('listCategories')
  debug(company.order_sys_id)
  return requestEntities(CATEGORIES, GET, '', '', 'company='+company.order_sys_id)
};
exports.updateCategory=function(categoryId, data) {
  debug('updateCategory')
  return requestEntities(CATEGORIES, PUT, data, categoryId)
};
exports.deleteCategory=function(categoryId) {
  debug('deleteCategory')
  return requestEntities(CATEGORIES, DELETE, '', categoryId)
};

exports.createMenuItem=function(company, title, status, price, category, description) {
  debug('createMenuItem')
  //generate unique sku
  var sku = company.base_slug + '-'+ title.replace(/\W+/g, '-').toLowerCase();
  var slug = sku;
  var status = (status?status:1) ; // is live
  var stockLevel = 10000000;
  var stockStatus = 0; // unlimited
  var requiresShipping = 0; // No shipping required
  var catalogOnly = 0; // Not catalog only
  var data = {
    sku : sku,
    slug : slug,
    status : status,
    title : title,
    description : description,
    price : price,
    category : category,
    stock_level : stockLevel,
    stock_status : stockStatus,
    requires_shipping : requiresShipping,
    catalog_only : catalogOnly,
    tax_band : config.defaultTaxBand,
    company : company.order_sys_id
  }
  debug(data)
  return requestEntities(MENU_ITEMS, POST, data)
};
exports.findMenuItem=function(menuItemId) {
  debug('findMenuItem')
  return requestEntities(MENU_ITEMS, GET, '', menuItemId)
};

exports.listMenuItems=function(category) {
  debug('listMenuItems')
  var params = 'category='+ category.id
  return requestEntities(MENU_ITEMS, GET, '', '', params)
};

exports.updateMenuItem=function(menuItemId, data) {
  debug('updateMenuItem')
  return requestEntities(MENU_ITEMS, PUT, data, menuItemId)
};
exports.deleteMenuItem=function(menuItemId) {
  debug('deleteMenuItem')
  return requestEntities(MENU_ITEMS, DELETE, '', menuItemId)
};

var menuOptionFlow = function (menuItemId, optionCategoryId, showOptionItems) {
  debug('menuOptionFlow')
  var flow = MENU_ITEMS + '/' + menuItemId + OPTION_CATEGORIES
  if (optionCategoryId) {
    debug('...option category id '+ optionCategoryId)
    flow = flow + '/' + optionCategoryId
    if (showOptionItems) {
      debug('...option items ')
      flow = flow + OPTION_ITEMS
    }
  }
  debug('...'+ flow)
  return flow
}

exports.createOptionItem=function(menuItemId, optionCategoryId, title, modPrice) {
  debug('createOptionItem')
  if (!modPrice) modPrice = "+0.00"
  var data = {
    title : title,
    mod_price : modPrice
  }
  debug(data)
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId, true), POST, data)
};

exports.listOptionItems=function(menuItemId, optionCategoryId) {
  debug('listOptionItems')
  var flow = menuOptionFlow(menuItemId, optionCategoryId, true)
  return requestEntities(flow, GET)
};
exports.findOptionItem=function(menuItemId, optionCategoryId, optionItemId) {
  debug('findOptionItem')
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId, true), GET, '', optionItemId)
};

exports.updateOptionItem=function(menuItemId, optionCategoryId, optionItemId, data) {
  debug('updateOptionItem')
  var flow = menuOptionFlow(menuItemId, optionCategoryId, true)
  debug('...'+ flow)
  debug('...'+ optionItemId)
  debug('...'+ data)
  return requestEntities(flow, PUT, data, optionItemId)
};

exports.deleteOptionItem=function(menuItemId, optionCategoryId, optionItemId) {
  debug('deleteOptionItem')
  var flow = menuOptionFlow(menuItemId, optionCategoryId, true)
  debug('...'+ flow)
  debug('...'+ optionItemId)
  return requestEntities(flow, DELETE, '', optionItemId)
};

exports.createOptionCategory=function(menuItemId, title, type) {
  debug('createOptionCategory')
  var data = {
    title : title,
    type : type
  }
  return requestEntities(menuOptionFlow(menuItemId), POST, data)
};
exports.listOptionCategories=function(menuItemId) {
  debug('listOptionCategories')
  return requestEntities(menuOptionFlow(menuItemId), GET)
};
exports.findOptionCategory=function(menuItemId, optionCategoryId) {
  debug('findOptionCategory')
  return requestEntities(menuOptionFlow(menuItemId), GET, '', optionCategoryId)
};
exports.updateOptionCategory=function(menuItemId, optionCategoryId, data) {
  debug('updateOptionCategory')
  return requestEntities(menuOptionFlow(menuItemId), PUT, data, optionCategoryId)
};
exports.deleteOptionCategory=function(menuItemId, optionCategoryId) {
  debug('deleteOptionCategory')
  return requestEntities(menuOptionFlow(menuItemId), DELETE, '', optionCategoryId)
};


exports.findOrder=function(orderSysOrderId) {
  debug('findOrder')
  return requestEntities(ORDERS, GET, '', orderSysOrderId)
};

var orderDetailFlow = function (orderSysOrderId) {
  debug('orderDetailFlow')
  var flow = ORDERS + '/' + orderSysOrderId + '/items'
  return flow
}

exports.getOrderDetail=function(orderSysOrderId) {
  debug('getOrderDetail')
  return requestEntities(orderDetailFlow(orderSysOrderId), GET)
}

exports.getOrderById=function(url) {
  debug('getOrderById')
  return requestEntities(url, GET);
};

exports.getOrder = function(url){
  debug('getOrder')
  return requestEntities(url, GET);
}


exports.deleteImage = function(imageId) {
  debug('deleteImage')
  return requestEntities(IMAGES, DELETE, '', imageId)
}

exports.uploadImage = function *(itemId, path) {
  debug('uploadImage')
  try {
    var token = yield getBearerToken()
    debug('...token '+ token)
  } catch (err) {
    console.error(err)
    throw (err)
  }

  var url = config.moltinStoreUrl + IMAGES
  debug('...url : '+ url)
  try {
    var imagefile = fs.createReadStream(path)
  } catch (err) {
    console.error('uploadImage: error')
    console.error(err)
  }

  debug(imagefile)
  var data = {
    file: imagefile,
    assign_to: itemId
  }
  debug(data)
  debug('...uploading')
  return new Promise(function(resolve, reject) {
    request({
      method: POST,
      url: url,
      formData: data,
      headers: {
        'Authorization': 'Bearer '+ token
      },
      maxAttempts: 3,
      retryDelay: 150,  // wait for 150 ms before trying again
    })
    .then( function (res) {
      debug('status code '+ res.statusCode)
      debug('sendRequest: parsing...')
      debug(res.body)
      if (res.statusCode == 401 ) { // Unauthorized
        debug('...Access token expired')
        debug('...clear bearer token and throw error')
        bearerToken = '';
        reject({'statusCode': 401, 'error': 'Unauthorized'})
      }
      var result = JSON.parse(res.body).result
      resolve (result)
      return;

    })
    .catch( function (err) {
      console.error("uploadImage: statusCode: " + err.statusCode);
      console.error("uploadImage: statusText: " + err.statusText);
      reject (err)
    })
  })
}
