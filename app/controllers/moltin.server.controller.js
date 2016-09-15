var debug = require('debug')('moltin.server.controller'),
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
        console.err('Authorization with Moltin failed')
        if (res) {
          console.error("response.statusCode: " + res.statusCode);
          console.error("response.statusText: " + res.statusText);
          callback(err);
        }
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

var requestEntities = function(flow, method, data, id) {
  console.log (flow)

  return new Promise(function(resolve, reject) {
    getBearerToken(function(token) {
      if (token instanceof Error) {
        reject(token);
        return;
      }
      console.log('token : '+ token)
      var oid = '';
      if (id) oid = '/'+id
      request(
        {
          method: method,
          url: config.moltinStoreUrl + flow + oid,
          json: data,
          headers: {
            'Authorization': 'Bearer '+ token
          }
        },
        function (err, res, body) {
          if (!err && (res.statusCode === 200 || res.statusCode === 201) ) {
            debug(body)
            var bodyJson = JSON.stringify(res);
            bodyJson = JSON.parse(bodyJson).body;
            //debug(bodyJson.result)
            resolve(bodyJson.result)
            return;
          }
          else {
            console.error('Response Status: ' + res.statusCode)
            if (err) {
              console.error('err'+ err);
              reject(err)
              return;
            }
            console.error(body)
            debug(body.error)
            reject(body.error)
            return;
          }
        })
    })
  })
}

exports.createCategory=function(company, catTitle, catParent) {
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
  return requestEntities(CATEGORIES, POST, data)
};
exports.findCategory=function(company, categoryId, callback) {
  return requestEntities(CATEGORIES, GET, {id:categoryId, company:company.orderSysId}, callback)
};
exports.listCategories=function *(company, data) {
  console.log(company.order_sys_id)
  if (data) data.company = company.order_sys_id
  else data = {company: {data: {id: company.order_sys_id}}}
  console.log(data)
  try {
    var results = yield requestEntities(CATEGORIES, GET, data)
  } catch (err) {
    console.log('error calling moltin controller')
    throw (err)
  }
  console.log(results)
  return results
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
    tax_band : config.defaultTaxBand,
    company : company.orderSysId
  }
  debug(data)
  return requestEntities(MENU_ITEMS, POST, data, callback)
};
exports.findMenuItem=function(company, menuItemId, callback) {
  return requestEntities(MENU_ITEMS, GET, {id:menuItemId, company:company.orderSysId}, callback)
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

var menuOptionFlow = function (menuItemId, optionCategoryId) {
  var flow = MENU_ITEMS + '/' + menuItemId + OPTION_ITEMS
  if (optionCategoryId) flow = flow + '/' + optionCategoryId
  debug(flow)
  return flow
}

exports.createOptionItem=function(menuItemId, optionCategoryId, title, modPrice, callback) {
  if (!modPrice) modPrice = 0
  var data = {
    title : title,
    mod_price : modPrice
  }
  debug(data)
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), POST, data, callback)
};
exports.findOptionItem=function(menuItemId, optionCategoryId, optionItemId, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), GET, {id:optionItemId}, callback)
};
exports.listOptionItems=function(menuItemId, optionCategorId, data, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), GET, data, callback)
};
exports.updateOptionItem=function(menuItemId, optionCategoryId, optionItemId, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), PUT, data, callback)
};
exports.deleteOptionItem=function(menuItemId, optionCategoryId, optionItemId, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), DELETE, {id:optionItemId}, callback)
};

exports.createOptionCategory=function(menuItemId, title, type, callback) {
  var data = {
    title : title,
    type : type
  }
  return requestEntities(menuOptionFlow(menuItemId), POST, data, callback)
};
exports.findOptionCategory=function(menuItemId, optionCategoryId, data, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), GET, data, callback)
};
exports.listOptionCategories=function(menuItemId, data, callback) {
  return requestEntities(menuOptionFlow(menuItemId), GET, data, callback)
};
exports.updateOptionCategory=function(menuItemId, optionCategoryId, data, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), PUT, data, callback)
};
exports.deleteOptionCategory=function(menuItemId, optionCategoryId, callback) {
  return requestEntities(menuOptionFlow(menuItemId, optionCategoryId), DELETE, '', callback)
};
