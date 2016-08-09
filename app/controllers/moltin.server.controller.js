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
var requestEntities = function(flow, method, data, callback) {
  getBearerToken(function(token) {
    if (token instanceof Error) return callback(token);
    debug('token : '+ token)
    request({
      method: method,
      url: config.moltinStoreUrl + flow,
      json: data,
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
}

exports.createCategory=function(catTitle, company, callback) {
  var catSlug = company.defaultSlug + '-' + title.replace(/\W+/g, '-').toLowerCase();
  var data = {
    slug : catSlug,
    status : 1,
    title : catTitle,
    description : catTtile,
    company : company._id
  }
  return requestEntities(CATEGORIES, POST, data, callback)
};
exports.findCategory=function(categoryId,callback) {
  return requestEntities(CATEGORIES, GET, {id:categoryId}, callback)
};
exports.listCategories=function(data, callback) {
  return requestEntities(CATEGORIES, GET, data, callback)
};
exports.updateCategory=function(data, callback) {
  return requestEntities(CATEGORIES, PUT, data, callback)
};
exports.deleteCategory=function(data, callback) {
  return requestEntities(CATEGORIES, DELETE, data, callback)
};

exports.createMenuItem=function(data, callback) {
  return requestEntities(MENU_ITEMS, POST, data, callback)
};
exports.findMenuItem=function(menuItemId,callback) {
  return requestEntities(MENU_ITEMS, GET, {id:cmenuItemId}, callback)
};
exports.listMenuItems=function(data, callback) {
  return requestEntities(MENU_ITEMS, GET, data, callback)
};
exports.updateMenuItem=function(data, callback) {
  return requestEntities(MENU_ITEMS, PUT, data, callback)
};
exports.deleteMenuItem=function(data, callback) {
  return requestEntities(MENU_ITEMS, DELETE, data, callback)
};

exports.createOptionItem=function(data, callback) {
  return requestEntities(OPTION_ITEMS, POST, data, callback)
};
exports.findOptionItem=function(optionItemId,callback) {
  return requestEntities(OPTION_ITEMS, GET, {id:optionItemId}, callback)
};
exports.listOptionItems=function(data, callback) {
  return requestEntities(OPTION_ITEMS, GET, data, callback)
};
exports.updateOptionItem=function(data, callback) {
  return requestEntities(OPTION_ITEMS, PUT, data, callback)
};
exports.deleteOptionItem=function(data, callback) {
  return requestEntities(OPTION_ITEMS, DELETE, data, callback)
};

exports.createOptionCategory=function(data, callback) {
  return requestEntities(OPTION_ITEMS, POST, data, callback)
};
exports.findOptionCategory=function(optionCategoryId,callback) {
  return requestEntities(OPTION_ITEMS, GET, {id:optionCategoryId}, callback)
};
exports.listOptionCategories=function(data, callback) {
  return requestEntities(OPTION_ITEMS, GET, data, callback)
};
exports.updateOptionCategory=function(data, callback) {
  return requestEntities(OPTION_ITEMS, PUT, data, callback)
};
exports.deleteOptionCategory=function(data, callback) {
  return requestEntities(OPTION_ITEMS, DELETE, data, callback)
};
