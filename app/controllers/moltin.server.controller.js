var debug = require("debug")("moltin");
var fs = require("fs");
var sts = require("./security.server.controller");
var config = require("../../config/config");
var request = require("requestretry");
const requestPromise = require("request-promise");
var logger = require("winston");
var Country = require("../models/countries.server.model");

const DELETE = "DELETE";
const GET = "GET";
const POST = "POST";
const PUT = "PUT";

const CATEGORIES = "/categories";
const COMPANIES = "/flows/companies/entries";
const IMAGES = "/files";
const MENU_ITEMS = "/products";
const OPTION_EXTRA = "/modifiers"; //OPTION_CATEGORIES
const OPTION_ITEMS = "/variations";
const OPTION = "/options";
const ORDERS = "/orders";
var bearerToken = "";

const PRICE_MODIFIER = 100;

var refreshBearerToken = function() {
  debug("refreshBearerToken");
  request
    .post({
      url: config.moltinAuthUrl,
      form: {
        client_id: config.clientId,
        client_secret: config.client_secret,
        grant_type: "refresh_token",
        refresh_token: bearerToken
      },
      maxAttempts: 3,
      retryDelay: 150 // wait for 150 ms before trying again
    })
    .then(function(res) {
      var data = qs.parse(res.body);
      bearerToken = body.access_token;
      return bearerToken;
    })
    .catch(function(err) {
      console.error("refreshBearerToken: statusCode: " + err.statusCode);
      console.error("refreshBearerToken: statusText: " + err.statusText);
      return err;
    });
};

var oAuthMoltin = function*(next) {
  debug("oAuthMoltin");
  return new Promise(function(resolve, reject) {
    request
      .post({
        url: config.moltinAuthUrl,
        form: {
          client_id: config.clientId,
          client_secret: config.client_secret,
          grant_type: config.grant_type
        },
        maxAttempts: 3,
        retryDelay: 150 // wait for 150 ms before trying again
      })
      .then(function(res) {
        var data = JSON.parse(res.body);
        bearerToken = data.access_token;
        debug(bearerToken);
        resolve(bearerToken);
        return;
      })
      .catch(function(err) {
        console.error("oAuthMoltin: statusCode: " + err.statusCode);
        console.error("oAuthMoltin: statusText: " + err.statusText);
        reject(err);
      });
  });
};

var getBearerToken = function*(next) {
  debug("getBearerToken");
  if (bearerToken == "") {
    debug("...get new bearer token");
    try {
      bearerToken = yield oAuthMoltin();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  debug("...return bearer token " + bearerToken);
  return bearerToken;
};

var sendRequest = function*(url, method, data, currency) {
  var meta = {
    fn: "sendRequest",
    url: url,
    method: method,
    data: data,
    currency: currency
  };
  logger.info("Sending request", meta);
  try {
    var token = yield getBearerToken();
    debug("...token " + token);
    console.log("token  ", token);
  } catch (err) {
    console.error(err);
    throw err;
  }
  var payload = "";

  if (data) {
    payload = {
      data: data
    };
  }

  return new Promise(function(resolve, reject) {
    request({
      method: method,
      url: url,
      json: payload,
      headers: {
        Authorization: "Bearer " + token,
        "X-MOLTIN-CURRENCY": currency
      },
      maxAttempts: 3,
      retryDelay: 150 // wait for 150 ms before trying again
    })
      .then(function(res) {
        meta.status = res.statusCode;
        logger.info("Request completed", meta);
        debug(res.statusMesage);
        debug("sendRequest: parsing...");
        debug(res.body);
        if (res.statusCode == 401) {
          // Unauthorized
          debug("...Access token expired");
          debug("...clear bearer token and throw error");
          bearerToken = "";
          reject({ statusCode: 401, error: "Unauthorized" });
        }
        if (
          res.statusCode == 200 ||
          res.statusCode == 201 ||
          res.statusCode == 204
        ) {
          logger.info("..Moltin call successful", meta);
          var result = null;
          if (method == DELETE && res.statusCode == 204) {
            logger.info("Delete completed", meta);
            result = { status: "ok", message: "Deleted successfully" };
          } else if (method == GET) {
            result = res.body ? JSON.parse(res.body).data : null;
          } else {
            result = res.body.data;
            //if (method == GET) result =  JSON.parse(res.body).data;
          }

          debug("sendRequest result", result);
          resolve(result);
          return;
        } else {
          // something went wrong
          var errors = res.body ? res.body : res;
          meta.errors = errors;
          logger.error("Something went wrong with call to Moltin", meta);
          reject(errors);
        }
      })
      .catch(function(err) {
        meta.error = err;
        logger.error("Error encountered", meta);
        reject(err);
      });
  });
};

var requestEntities = function*(flow, method, data, id, params, currency) {
  debug("requestEntities");
  debug("... id is " + id);
  debug(data);
  var oid = "";
  if (id) oid = "/" + id;
  var urlParams = "";
  if (params) urlParams = "?" + params;
  var url = config.moltinStoreUrl + flow + oid + urlParams;
  debug("...url : " + url);

  try {
    var result = yield sendRequest(url, method, data, currency);
  } catch (err) {
    console.error(err);
    if (err.statusCode == 401) {
      // try again with fresh bearerToken
      try {
        result = yield sendRequest(url, method, data, currency);
      } catch (err) {
        console.error(err);
        throw err;
      }
    } else {
      throw err;
    }
  }
  debug("requestEntities: ...returning");
  debug(result);
  return result;
};

exports.createCompany = function*(sfezCompany) {
  debug("createCompany");
  var data = {
    type: "entry",
    name: sfezCompany.name,
    email: sfezCompany.email
  };
  debug(data);
  try {
    var result = yield requestEntities(COMPANIES, POST, data);
  } catch (err) {
    console.error(err);
    throw err;
  }
  debug(result);
  return result;
};

exports.deleteCompany = function(companyId) {
  debug("deleteCompany");
  return requestEntities(COMPANIES, DELETE, "", companyId);
};

exports.updateCompany = function(companyId, data) {
  debug("updateCompany");
  return requestEntities(COMPANIES, PUT, data, companyId);
};

exports.createDefaultCategory = function(moltincompany) {
  debug("company name : " + moltincompany.name);
  debug("company email : " + moltincompany.email);
  var date = new Date().getTime();
  debug("date " + date);
  var slug = moltincompany.name.replace(/\W+/g, "-").toLowerCase();
  slug = slug + "-" + date;
  debug("slug " + slug);
  var flow = "/categories";
  var data = {
    slug: slug,
    status: "live",
    name: moltincompany.name + " Menu",
    description: moltincompany.name + " Menu",
    company: moltincompany.id,
    type: "category"
  };
  return requestEntities(flow, POST, data);
};

exports.createCategory = function*(company, catTitle, catParent) {
  var meta = {
    fn: "createCategory",
    company_id: company.id,
    cat_name: catTitle,
    cat_parent: catParent
  };
  logger.info("Creating category for company", meta);
  var catSlug =
    company.base_slug + "-" + catTitle.replace(/\W+/g, "-").toLowerCase();
  if (!catParent) catParent = company.default_cat;
  var data = {
    slug: catSlug,
    status: "live",
    name: catTitle,
    description: catTitle,
    company: company.order_sys_id,
    type: "category"
  };
  debug(data);
  var category = yield requestEntities(CATEGORIES, POST, data);
  meta.category_id = category.id;
  logger.info("Category created", meta);
  try {
    var relationships = yield requestEntities(
      `${CATEGORIES}/${category.id}/relationships/parent`,
      POST,
      {
        type: "category",
        id: catParent
      }
    );
  } catch (error) {
    meta.error = error;
    logger.error(
      "Error creating category relationship to parent default category",
      meta
    );
    throw error;
  }
  logger.info("Created catgory-default category relationship", meta);
  debug(relationships);
  return relationships;
};

exports.findCategory = function(categoryId) {
  debug("findCategory");
  debug("category id " + categoryId);
  return requestEntities(CATEGORIES, GET, "", categoryId);
};

exports.listCategories = function*(company) {
  debug("listCategories");
  var meta = {
    fn: "listCategories",
    company_id: company.id,
    default_cat: company.default_cat
  };
  logger.info("List categories for company", meta);
  var defcat = yield requestEntities(CATEGORIES, GET, "", company.default_cat);
  var cats = [];
  if (defcat.relationships && defcat.relationships.children) {
    var children = defcat.relationships.children.data;
    var child = "";
    var aCat = "";
    meta.num_relationships = children.length;
    logger.info("Got category relationships", meta);
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      debug(child);
      if ("category" == child.type) {
        aCat = yield requestEntities(CATEGORIES, GET, "", child.id);
        debug(aCat);
        cats.push(aCat);
      }
    }
  }
  debug(cats);
  meta.num_categories = cats.length;
  logger.info("Returning categories for company", meta);
  return cats;
};

exports.updateCategory = function(categoryId, data) {
  debug("updateCategory");
  return requestEntities(CATEGORIES, PUT, data, categoryId);
};
exports.deleteCategory = function*(catParent, categoryId) {
  var meta = {
    fn: "deleteCategory",
    category_parent: catParent,
    delete_category_id: categoryId
  };
  logger.info("Removing category-parent relationship", meta);
  try {
    var relationships = yield requestEntities(
      `${CATEGORIES}/${categoryId}/relationships/parent`,
      DELETE,
      {
        type: "category",
        id: catParent
      }
    );
  } catch (error) {
    meta.error = error;
    logger.error("Error deleting category-parent relationship", meta);
  }
  logger.info("Deleting category", meta);
  var results = yield requestEntities(CATEGORIES, DELETE, "", categoryId);
  console.log(results);
  return results;
};

exports.createMenuItem = function*(
  company,
  title,
  status,
  price,
  category,
  description,
  taxBand,
  currency
) {
  debug("createMenuItem");
  debug(company);
  var meta = {
    fn: "createMenuItem",
    company_name: company.name,
    title: title,
    category: category
  };
  logger.info("Creating menu item", meta);
  //generate unique sku
  var sku = company.base_slug + "-" + title.replace(/\W+/g, "-").toLowerCase();
  var slug = sku;
  var status = status ? status : 1; // is live
  meta.sku = sku;

  var parray = price;
  if (!Array.isArray(price)) {
    parray = [
      {
        amount: price * PRICE_MODIFIER,
        currency: currency,
        includes_tax: false
      }
    ];
  }

  var data = {
    type: "product",
    name: title,
    slug: slug,
    sku: sku,
    manage_stock: false,
    description: description,
    price: parray,
    status: "live",
    commodity_type: "physical",
    company: company.order_sys_id
  };
  debug(data);
  logger.info("Creating menu item", meta);
  var menuitem = yield requestEntities(
    MENU_ITEMS,
    POST,
    data,
    "",
    "",
    currency
  );
  meta.menu_item_id = menuitem.id;
  logger.info("Menu item created", meta);

  logger.info("Creating menu item-category relationship", meta);
  try {
    var relationship = yield requestEntities(
      `${MENU_ITEMS}/${menuitem.id}/relationships/categories`,
      POST,
      [
        {
          type: "category",
          id: category
        }
      ]
    );
  } catch (error) {
    meta.error = error;
    logger.error("Menuitem - category relationship creation error", meta);
  }
  return menuitem;
};

exports.findMenuItem = function(menuItemId, currency) {
  debug("findMenuItem");
  return requestEntities(
    MENU_ITEMS,
    GET,
    "",
    menuItemId,
    "include=main_image",
    currency
  );
};

exports.listMenuItems = function(category, currency) {
  debug("listMenuItems");
  debug(category);
  var params = `filter=eq(category.id,${category.id})`;
  debug("Filtering by : " + params);
  return requestEntities(MENU_ITEMS, GET, "", "", params, currency);
};

exports.updateMenuItem = function(menuItemId, data) {
  debug("updateMenuItem");
  return requestEntities(MENU_ITEMS, PUT, data, menuItemId);
};
exports.deleteMenuItem = function(menuItemId) {
  debug("deleteMenuItem");
  return requestEntities(MENU_ITEMS, DELETE, "", menuItemId);
};

var menuOptionFlow = function(menuItemId, optionCategoryId, showOptionItems) {
  debug("menuOptionFlow");
  var flow = MENU_ITEMS + "/" + menuItemId + OPTION_EXTRA;
  if (optionCategoryId) {
    debug("...option category id " + optionCategoryId);
    flow = flow + "/" + optionCategoryId;
    if (showOptionItems) {
      debug("...option items ");
      flow = flow + OPTION_ITEMS;
    }
  }
  debug("..." + flow);
  return flow;
};

exports.createOptionItem = function(optionCategoryId, title, description) {
  debug("createOptionItem");
  var flow = OPTION_ITEMS + "/" + optionCategoryId + OPTION;
  var data = {
    name: title,
    type: "option",
    description: description
  };
  debug(data);
  return requestEntities(flow, POST, data);
};

exports.listOptionItems = function(menuItemId, optionCategoryId) {
  debug("listOptionItems");
  var flow = menuOptionFlow(menuItemId, optionCategoryId, true);
  return requestEntities(flow, GET);
};
exports.findOptionItem = function(menuItemId, optionCategoryId, optionItemId) {
  debug("findOptionItem");
  return requestEntities(
    menuOptionFlow(menuItemId, optionCategoryId, true),
    GET,
    "",
    optionItemId
  );
};

exports.updateOptionItem = function(
  optionCategoryId,
  optionItemId,
  title,
  description
) {
  debug("updateOptionItem");

  var flow = OPTION_ITEMS + "/" + optionCategoryId + OPTION;
  var data = {
    name: title,
    type: "option",
    description: description,
    id: optionItemId,
    flow: flow
  };
  debug("..." + flow);
  debug("..." + optionItemId);
  debug("..." + data);

  return requestEntities(flow, PUT, data, optionItemId);
};

exports.deleteOptionItem = function(optionCategoryId, optionItemId) {
  debug("deleteOptionItem");

  var flow = OPTION_ITEMS + "/" + optionCategoryId + OPTION;

  debug("..." + flow);
  debug("..." + optionItemId);

  return requestEntities(flow, DELETE, "", optionItemId);
};

/* function For Create variation & create Relationship with product */
exports.createOptionCategory = function(title) {
  debug("createOptionCategory");
  var data = {
    name: title,
    type: "product-variation"
  };
  var variation = requestEntities(OPTION_ITEMS, POST, data);

  return variation;
};

exports.createRelationship = function*(menuItemId, variationId) {
  debug("create Relationship");

  var product_rel_url =
    config.moltinStoreUrl +
    MENU_ITEMS +
    "/" +
    menuItemId +
    "/relationships" +
    OPTION_ITEMS;
  var relationData = {
    data: [
      {
        type: "product-variation",
        id: variationId
      }
    ]
  };

  try {
    var token = yield getBearerToken();
    debug("...token " + token);
    console.log("token createRelationship  ", token);
  } catch (err) {
    console.error(err);
    throw err;
  }

  return new Promise(function(resolve, reject) {
    request
      .post({
        url: product_rel_url,
        json: relationData,
        headers: {
          Authorization: "Bearer " + token
        },
        maxAttempts: 3,
        retryDelay: 150 // wait for 150 ms before trying again
      })
      .then(function(res) {
        debug("status code " + res.statusCode);
        debug("sendRequest: parsing...");
        debug(res.body);
        console.log("relation>>>>stt>>>", res.statusCode);

        if (res.statusCode == 401) {
          // Unauthorized
          debug("...Access token expired");
          debug("...clear bearer token and throw error");
          bearerToken = "";
          reject({ statusCode: 401, error: "Unauthorized" });
        }

        var result = res.body;
        resolve(result);
        return;
      })
      .catch(function(err) {
        console.log("errror", err);
        console.error("uploadImage: statusCode: " + err.statusCode);
        console.error("uploadImage: statusText: " + err.statusText);
        reject(err);
      });
  });

  //return requestEntities(product_rel_url ,POST,relationData)
};
exports.listOptionCategories = function(menuItemId) {
  debug("listOptionCategories");
  return requestEntities(OPTION_ITEMS, GET);
};
exports.findoptionCategory = function(optionCategoryId) {
  debug("findOptionCategory");
  return requestEntities(OPTION_ITEMS, GET, "", optionCategoryId);
};
exports.updateOptionCategory = function(optionCategoryId, title) {
  debug("updateOptionCategory");
  var data = {
    name: title,
    type: "product-variation",
    id: optionCategoryId
  };
  return requestEntities(OPTION_ITEMS, PUT, data, optionCategoryId);
};
exports.deleteOptionCategory = function(optionCategoryId) {
  debug("deleteOptionCategory");
  return requestEntities(OPTION_ITEMS, DELETE, "", optionCategoryId);
};

exports.findOrder = function(orderSysOrderId) {
  debug("findOrder");
  return requestEntities(ORDERS, GET, "", orderSysOrderId);
};

var orderDetailFlow = function(orderSysOrderId) {
  debug("orderDetailFlow");
  var flow = ORDERS + "/" + orderSysOrderId + "/items";
  return flow;
};

exports.getOrderDetail = function(orderSysOrderId) {
  debug("getOrderDetail");
  return requestEntities(orderDetailFlow(orderSysOrderId), GET);
};

exports.getOrderById = function(url) {
  debug("getOrderById");
  return requestEntities(url, GET);
};

exports.getOrder = function(url) {
  debug("getOrder");
  return requestEntities(url, GET);
};

exports.deleteImage = function(imageId) {
  debug("deleteImage");
  return requestEntities(IMAGES, DELETE, "", imageId);
};

exports.getFile = function(fileId) {
  return requestEntities(IMAGES, GET, "", fileId);
};
exports.uploadImage = function*(itemId, path, type) {
  debug("uploadImage");
  try {
    var token = yield getBearerToken();
    console.log("token is", token);
    debug("...token " + token);
  } catch (err) {
    console.error(err);
    throw err;
  }

  var url = config.moltinStoreUrl + IMAGES;

  debug("...url : " + url);
  try {
    var imagefile = fs.createReadStream(path);
  } catch (err) {
    console.error("uploadImage: error");
    console.error(err);
  }

  debug(imagefile);

  /*var data = {
    file: path,
    public: true
  }*/
  var data = {
    file: { value: imagefile, options: { filename: path, contentType: null } },
    public: "true"
  };

  debug(data);
  debug("...uploading");

  return new Promise(function(resolve, reject) {
    request
      .post({
        url: url,
        json: false,
        formData: data,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(res) {
        debug("status code " + res.statusCode);
        debug("sendRequest: parsing...");
        debug(res.body);

        if (res.statusCode == 401) {
          // Unauthorized
          debug("...Access token expired");
          debug("...clear bearer token and throw error");
          bearerToken = "";
          reject({ statusCode: 401, error: "Unauthorized" });
        }

        var result = res.body ? JSON.parse(res.body).data : null;

        var imageId = result.id;
        if (type == "menu") {
          var mainImage = mainImageUpload(token, itemId, imageId);
        }

        resolve(result);

        return;
      })
      .catch(function(err) {
        console.error("uploadImage: statusCode: " + err.statusCode);
        console.error("uploadImage: statusText: " + err.statusText);
        reject(err);
      });
  });
};
var mainImageUpload = function(token, itemId, imageId) {
  var url =
    config.moltinStoreUrl +
    MENU_ITEMS +
    "/" +
    itemId +
    "/relationships/main-image";

  var options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: { data: { type: "main_image", id: "" + imageId + "" } },
    json: true
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);

    return body;
  });
};

/* Functions for modifier */

exports.createModifer = function(optionCategoryId, optionItemId, data) {
  var flow =
    OPTION_ITEMS +
    "/" +
    optionCategoryId +
    OPTION +
    "/" +
    optionItemId +
    OPTION_EXTRA;

  debug(data);

  return requestEntities(flow, POST, data);
};

exports.updateModifer = function(
  optionCategoryId,
  optionItemId,
  modifierId,
  data
) {
  var flow =
    OPTION_ITEMS +
    "/" +
    optionCategoryId +
    OPTION +
    "/" +
    optionItemId +
    OPTION_EXTRA +
    "/" +
    modifierId;
  var Data = {
    value: data.value,
    type: data.type,
    modifer_type: data.modifer_type,
    id: modifierId
  };

  debug(data);

  return requestEntities(flow, PUT, Data);
};

exports.deleteModifer = function(optionCategoryId, optionItemId, modifierId) {
  var flow =
    OPTION_ITEMS +
    "/" +
    optionCategoryId +
    OPTION +
    "/" +
    optionItemId +
    OPTION_EXTRA;
  return requestEntities(flow, DELETE, "", modifierId);
};
