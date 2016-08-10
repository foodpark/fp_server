var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    debug = require('debug')('moltin.server.controller'),
    sts = require('./security.server.controller'),
    FormData = require('form-data'),
    http = require ('http'),
    https = require('https'),
    config = require('../../config/config'),
    request = require('request'),
    moltin = require('moltin')({
      publicId: config.clientId,
      secretKey: config.client_secret
    });


const DELETE = 'DELETE';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';

const CATEGORIES = '/categories';
const MENU_ITEMS = '/products';
const OPTION_ITEMS = '/modifiers';

var bearerToken='';

var refreshBearerToken = function (callback) {
  request.post({
    url: config.moltinAuthUrl,
    form: {
      'client_id': config.clientId,
      'client_secret': config.client_secret,
      'grant_type': 'refresh_token',
      'refresh_token': bearerToken
    }
  },
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
          var data = qs.parse(body);
          bearerToken=body.access_token;
          callback(bearerToken);
      }
      else {
        console.error("response.statusCode: " + res.statusCode);
        console.error("response.statusText: " + res.statusText);
        callback(err)
      }
  })
}
var oAuthMoltin = function (callback) {
  request.post({
    url: config.moltinAuthUrl,
    form: {
      'client_id': config.clientId,
      'client_secret': config.client_secret,
      'grant_type': config.grant_type
    }
  },
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
          var data = JSON.parse(body);
          debug(data);
          bearerToken=data.access_token;
          debug(bearerToken);
          callback(bearerToken);
      }
      else {
        if (bearerToken) { // possibly need to refresh
          refreshBearerToken(callback);
        }
        console.error("response.statusCode: " + res.statusCode);
        console.error("response.statusText: " + res.statusText);
        callback(err);
      }
  })
};

var getBearerToken = function(callback) {
  debug('start');
  if (bearerToken=='') {
    debug('get new bearer token')
    oAuthMoltin(callback);
    return
  }
  debug('return existing bearer token')
  callback(bearerToken);
};

exports.createCompany=function(sfezCompany, callback) {
  getBearerToken(function(token) {
    if (token instanceof Error) return callback(token);
    debug('company name : '+ sfezCompany.name)
    debug('company email : '+ sfezCompany.email)
    debug('token : '+ token)
    request.post({
      url: config.moltinStoreUrl + "/flows/companies/entries",
      json: {
        'name': sfezCompany.name,
        'email': sfezCompany.email
      },
      headers: {
        'Authorization': 'Bearer '+ token
      }
    },
    function (err, res, body) {
      if (!err && (res.statusCode === 200 || res.statusCode ===201)) {
        debug(res.body)
        var bodyJson = JSON.stringify(res);
        bodyJson = JSON.parse(bodyJson).body;
        debug(bodyJson.result)
        return callback(bodyJson.result);
      }
      else {
        console.error(err);
        console.error(body);
        var resError = JSON.stringify(body);
        resError = JSON.parse(resError);
        console.error("response.statusCode: " + res.statusCode);
        console.error("response.statusText: " + res.statusText);
        callback (Error(resError.errors));
      }
    })
  })
};
exports.createDefaultCategory=function(moltincompany, callback) {
  getBearerToken(function(token) {
    if (token instanceof Error) return callback(token);
    debug('company name : '+ moltincompany.name)
    debug('company email : '+ moltincompany.email)
    debug('token : '+ token)
    var date = new Date().getTime()
    debug('date '+ date)
    var slug = moltincompany.name.replace(/\W+/g, '-').toLowerCase();
    slug = slug + '-' + date;
    debug('slug '+ slug)
    request.post({
      url: config.moltinStoreUrl + "/categories",
      json: {
        'slug': slug,
        'status': 1,
        'title': moltincompany.name + ' Menu',
        'description': moltincompany.name + ' Menu',
        'company': moltincompany.id
      },
      headers: {
        'Authorization': 'Bearer '+ token
      }
    },
    function (err, res, body) {
      if (!err && (res.statusCode === 200 || res.statusCode === 201)) {
        debug(res.body)
        var bodyJson = JSON.stringify(res);
        bodyJson = JSON.parse(bodyJson).body;
        debug(bodyJson.result)
        return callback(bodyJson.result);
      }
      else {
        console.error(err);
        console.error(body);
        var resError = JSON.stringify(body);
        resError = JSON.parse(resError);
        console.error("response.statusCode: " + res.statusCode);
        console.error("response.statusText: " + res.statusText);
        callback (Error(resError.errors));
      }
    })
  })
};
var requestEntities = function(flow, method, data, callback, id) {
  getBearerToken(function(token) {
    if (token instanceof Error) return callback(token);
    debug('token : '+ token)
    var oid = '';
    if (id) oid = '/'+id
    request({
      method: method,
      url: config.moltinStoreUrl + flow + oid,
      json: data,
      headers: {
        'Authorization': 'Bearer '+ token
      }
    },
    function (err, res, body) {
      if (!err && (res.statusCode === 200 || res.statusCode === 201) || body.status == 'false') {
        debug(body)
        var bodyJson = JSON.stringify(res);
        bodyJson = JSON.parse(bodyJson).body;
        //debug(bodyJson.result)
        return callback(bodyJson.result);
      }
      else {
        if (err) {
          console.error(err);
          return callback(err);
        }
        console.error(body);
        return callback(new Error(body));
      }
    })
  })
}

exports.createCategory=function(company, catTitle, catParent,callback) {
  var catSlug = company.baseSlug + '-' + catTitle.replace(/\W+/g, '-').toLowerCase();
  if (!catParent) catParent = company.defaultCategory;
  var data = {
    parent: catParent,
    slug : catSlug,
    status : 1,
    title : catTitle,
    description : catTitle,
    company : company.orderSysId
  }
  debug(data)
  return requestEntities(CATEGORIES, POST, data, callback)
};
exports.findCategory=function(company, categoryId, callback) {
  return requestEntities(CATEGORIES, GET, {id:categoryId, company:company.orderSysId}, callback)
};
exports.listCategories=function(company, data, callback) {
  data.company = company.orderSysId
  debug(data)
  return requestEntities(CATEGORIES, GET, data, callback)
};
exports.updateCategory=function(company, category, data, callback) {
  data.company = company.orderSysId
  return requestEntities(CATEGORIES, PUT, data, callback, category)
};
exports.deleteCategory=function(category, callback) {
  return requestEntities(CATEGORIES, DELETE, '', callback, category)
};

exports.createMenuItem=function(company, title, status, price, category, description, callback) {
  //generate unique sku
  var sku = company.baseSlug + title.replace(/\W+/g, '-').toLowerCase();
  var slug = sku;
  var status = 1; // is live
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
    tax : "default",
    company : company.orderSysId
  }
  debug(data)
  return requestEntities(MENU_ITEMS, POST, data, callback)
};
exports.findMenuItem=function(company, menuItemId,callback) {
  return requestEntities(MENU_ITEMS, GET, {id:cmenuItemId, company:company.orderSysId}, callback)
};
exports.listMenuItems=function(company, data, callback) {
  data.company = company.orderSysId
  return requestEntities(MENU_ITEMS, GET, data, callback)
};
exports.updateMenuItem=function(company, data, callback) {
  data.company = company.orderSysId
  return requestEntities(MENU_ITEMS, PUT, data, callback)
};
exports.deleteMenuItem=function(company, data, callback) {
  data.company = company.orderSysId
  return requestEntities(MENU_ITEMS, DELETE, data, callback)
};

exports.createOptionItem=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, POST, data, callback)
};
exports.findOptionItem=function(company, optionItemId,callback) {
  return requestEntities(OPTION_ITEMS, GET, {id:optionItemId, company:company.orderSysId}, callback)
};
exports.listOptionItems=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, GET, data, callback)
};
exports.updateOptionItem=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, PUT, data, callback)
};
exports.deleteOptionItem=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, DELETE, data, callback)
};

exports.createOptionCategory=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, POST, data, callback)
};
exports.findOptionCategory=function(company, optionCategoryId,callback) {
  return requestEntities(OPTION_ITEMS, GET, {id:optionCategoryId, company:company.orderSysId}, callback)
};
exports.listOptionCategories=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, GET, data, callback)
};
exports.updateOptionCategory=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, PUT, data, callback)
};
exports.deleteOptionCategory=function(company, data, callback) {
  return requestEntities(OPTION_ITEMS, DELETE, data, callback)
};
