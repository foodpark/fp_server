var sts = require('./security.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var User = require('../models/user.server.model');
var Company = require('../models/company.server.model');
var Country = require('../models/countries.server.model');
var Customer = require('../models/customer.server.model');
var Driver = require('../models/driver.server.model');
var Admin = require('../models/admin.server.model');
var Unit = require('../models/unit.server.model');
var FoodPark = require('../models/foodpark.server.model');
var debug = require('debug')('auth');
var _ = require('lodash');
var logger = require('winston');
var  Church = require('../models/churches.server.model');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');

exports.CUSTOMER = 'CUSTOMER';
exports.OWNER = 'OWNER';
exports.UNIT_MGR = 'UNITMGR';
exports.ADMIN = 'ADMIN';

var getErrorMessage = function (err) {
  var message = '';
  if (err && err.code) {
    switch (err.code) {
      case 11000:
      case 11001:
        message = 'Username already exists';
        break;
      default:
        message = 'Something went wrong';
    }
  } else {
    for (var errName in err.errors) {
      if (err.errors[errName].message)
        message = err.errors[errName].message;
    }
  }

  return message;
};

var setUserInfo = function (user) {
  debug('setUserInfo')
  var info = {
    id: user.id,
    username: user.username,
    role: user.role
  }
  debug(user)
  if (user.company_id) info.company_id = user.company_id;
  else if (user.customer_id) info.customer_id = user.customer_id;
  else if (user.admin_id) info.admin_id = user.admin_id;
  else if (user.unit_id) info.unit_id = user.unit_id;
  else if (user.church_id) info.church_id = user.church_id;
  debug(info)
  return info
};

exports.login = function* (next) {
  debug('login complete')
  debug(this.passport.user)
  debug('calling');
  meta = {
    fn: 'login',
    user_id: this.passport.user.id,
    role: this.passport.user.role
  };
  var lang = this.passport.default_language;

  logger.info('User logging in', meta);
  if (!lang) {
    lang = 'en';
  }
  yield (User.updateUser(meta.user_id, { default_language: lang }));
  userInfo = setUserInfo(this.passport.user)
  if (this.passport.user.role == 'OWNER') {
    var company = '';
    try {
      company = (yield Company.companyForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving company for owner',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.company_id = company.id;
    userInfo.default_unit_id = company.default_unit;
    meta.company_id = company.id;
    meta.default_unit_id = company.default_unit;
  } else if (this.passport.user.role == 'CUSTOMER') {
    var customer = '';
    try {
      customer = (yield Customer.getForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving customer role for user',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.customer_id = customer.id
    meta.customer_id = customer.id;
  } else if (this.passport.user.role === 'FOODPARKMGR') {
    var foodPark = {};
    try {
      foodPark = (yield FoodPark.getManagedFoodPark(this.passport.user.id))[0];
      console.log(foodPark);
    } catch (err) {
      logger.error('Error retrieving customer role for user',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.food_park_id = foodPark.id;
    userInfo.country_id = this.passport.user.country_id;
    meta.customer_id = foodPark.id;
  } else if (this.passport.user.role == 'ADMIN') {
    var admin = '';
    try {
      admin = (yield Admin.getForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving admin role for user',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.admin_id = admin.id
    meta.admin_id = admin.id;
  } else if (this.passport.user.role == 'UNITMGR') {
    var unit = '';
    try {
      unit = (yield Unit.getForUser(this.passport.user.id))[0];
      company = (yield Company.getSingleCompany(unit.company_id))[0]
    } catch (err) {
      logger.error('Error retrieving unit for unit manager',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.unit_id = unit.id;
    userInfo.company_id = company.id;
    userInfo.owner_id = company.user_id;
    userInfo.country_id = this.passport.user.country_id;
    meta.unit_id = unit.id;
  } else if (this.passport.user.role == 'DRIVER') {
    var drivers = '';
    try {
      drivers = (yield Driver.getDriversByUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving drives for driver user',
        { fn: 'login', user_id: this.passport.user.id, error: err });
      throw err;
    }
    userInfo.drivers = drivers;
    meta.drivers = drivers;
  }
  debug('done')
  debug('userInfo: ' + userInfo)
  this.status = 200;
  this.body = {
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo
  };
  debug(this.body);
  logger.info('login completed for user ', meta);
  return;
};

exports.renderLogin = function* (next) {
  if (!this.isAuthenticated()) {
    yield this.render('login', {
      title: 'Login Form',
      messages: this.flash.error || this.flash.info,
    });
  } else {
    this.body = 'Logged in.';
    return;
    return this.redirect('/');
  }
};

exports.renderRegister = function* (next) {
  if (!this.state.user) {
    yield this.render('register', {
      title: 'Register',
      messages: this.flash.error,
    });
  } else {
    this.redirect('/');
  }
};


var createMoltinCompany = function* (company) {
    var meta = { fn: 'createMoltinCompany', company_name: company.name };
    logger.info('create moltin company', meta );
    var results = '';
    try {
        results = yield msc.createCompany(company);
    } catch (err) {
        meta.error = err;
        logger.error('Error creating company in ecommerce system for owner', meta);
        throw (err);
    }
    debug(results);
    meta.moltin_company_id = results.id;
    logger.info('moltin company created', meta);
    return results;
};


var createMoltinDefaultCategory = function* (company) {
    var meta = { fn: 'createMoltinDefaultCategory', company_name: company.name };
    logger.info('create moltin default category', meta);
    var results = '';
    try {
        results = yield msc.createDefaultCategory(company)
    } catch (err) {
        meta.error = err;
        logger.error('Error creating moltin default category', meta);
        throw (err);
    }
    meta.default_cat = results.id;
    logger.info('default category created', meta);
    return results;
};


var createMoltinDailySpecialCategory = function* (company, defaultCat) {
    var meta = { fn: 'createMoltinDailySpecialCategory', company_name: company.name, default_cat: defaultCat};
    logger.info('createMoltinDailySpecialCategory', meta);
    var category = '';
    try {
        category = yield msc.createCategory(company, "Daily Specials", defaultCat);
    } catch (err) {
        meta.error = err;
        logger.error('Error creating daily special category', meta);
        throw (err);
    }
    meta.daily_specials_cat_id = category.id;
    logger.info('daily specials category created', meta);
    return category;
};


var createMoltinDeliveryChargeCategory = function* (company, defaultCat) {
    var meta = { fn: 'createMoltinDeliveryChargeCategory', company_name: company.name, default_cat: defaultCat };
    logger.info('createMoltinDeliveryChargeCategory', meta);
    var category = '';
    try {
        category = yield msc.createCategory(company, "Delivery Charge Category", defaultCat);
    } catch (err) {
        meta.error = err;
        logger.error('Error creating delivery charge category', meta);
    }
    meta.delivery_chg_cat_id = category.id;
    logger.info('createMoltinDeliveryChargeCategory', meta);
    return category;
};


var createMoltinDeliveryChargeItem = function* (company, deliveryCat) {
  var meta = { fn: 'createMoltinDeliveryChargeItem', company_name: company.name, delivery_chg_cat_id: deliveryCat };
  logger.info('start create of Moltin Delivery Charge Item', meta);
  var chargeItem = '';
  var title = "Delivery Charge";
  var status = 1; // live
  var description = "Delivery Charge";
  try {
    var country = (yield Country.getSingleCountry(company.country_id));
    if (country.length && country[0].currency) {
      var currency = country[0].currency;
    } else {
      var error = {
        message: 'country.currency is undefined'
      }
      throw error;
    }

    chargeItem = yield msc.createMenuItem(company, title, status, config.deliveryCharge, deliveryCat, description, null, currency);
  } catch (err) {
    meta.error = err;
    logger.error('Error creating delivery charge item', meta);
    throw (err)
  }
  meta.delivery_chg_item_id = chargeItem.id;
  logger.info('createMoltinDeliveryChargeItem', meta);
  return chargeItem;
};


var createCompany = function* (company_name, email, country_id, userId) {
  var meta = { fn: 'createCompany', company_name: company_name, param_user_id: userId, country_id: country_id };
  logger.info('start create of SFEZ company', meta);
  debug('..email ' + email);
  var company = {
    name: company_name,
    email: email,
    userId: userId,
    country_id: country_id
  };
  var moltinCompany = '';
  try {
    moltinCompany = yield createMoltinCompany(company)
  } catch (err) {
    meta.error = err;
    logger.error('Error during Moltin company creation', meta);
    throw (err);
  }
  debug(moltinCompany);
  company.order_sys_id = moltinCompany.id;
  meta.moltin_company_id = moltinCompany.id;
  logger.info('Moltin company successfully created', meta);

  debug('..create default category');
  var moltinCat = '';
  try {
    moltinCat = yield createMoltinDefaultCategory(company);
  } catch (err) {
    meta.error = err;
    logger.error('Error during Moltin default category creation', meta);
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }
  company.default_cat = moltinCat.id;
  company.base_slug = moltinCat.slug;

  meta.default_cat = moltinCat.id;

  logger.info('Moltin default category successfully created', meta);

  debug('..create daily special category');
  var dailySpecialCat = '';
  try {
    var dailySpecialCat = yield createMoltinDailySpecialCategory(company, company.default_cat);
  } catch (err) {
    meta.error = err;
    logger.error('Error during Moltin daily special category creation', meta);
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(company.order_sys_id);
    throw (err);
  }

  meta.daily_special_cat_id = dailySpecialCat.id;

  logger.info('daily special category successfully created', meta);

  debug('..create delivery charge category');
  var deliveryChgCat = '';
  try {
    var deliveryChgCat = yield createMoltinDeliveryChargeCategory(company, company.default_cat);
  } catch (err) {
    meta.error = err;
    logger.error('Error during Moltin delivery charge category creation', meta);
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(company.order_sys_id);
    throw (err);
  }
  meta.delivery_chg_cat_id = deliveryChgCat.id;

  logger.info('delivery charge category successfully created', meta);

  debug('..create delivery charge item');
  var deliveryChgItem = '';
  try {
    deliveryChgItem = yield createMoltinDeliveryChargeItem(company, deliveryChgCat.id);
  } catch (err) {
      meta.error = err;
    logger.error('Error during Moltin delivery charge item creation', meta);
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(company.order_sys_id);
    throw (err);
  }
  meta.delivery_chg_item_id = deliveryChgItem.id;
  logger.info('delivery charge item successfully created', meta);

  //get tax band from country
  var taxband = '';
  try {
    var country = (yield Country.getSingleCountry(country_id));
    if (country.length > 0) {
      taxband = country[0].tax_band;
    }
  } catch (err) {
    meta.error = err;
    logger.error('Error during Country retrieval', meta);
    throw (err);
  }
  if (!taxband) {
    taxband = config.defaultTaxBand;
  }
  meta.taxband = taxband;

  var sfezCompany = '';
  try {
    sfezCompany = (yield Company.createCompany(company_name, email, userId, moltinCompany.id,
      moltinCat.id, moltinCat.slug, deliveryChgCat.id, deliveryChgItem.id, config.deliveryCharge,
      dailySpecialCat.id, country_id, taxband))[0];
  } catch (err) {
    meta.error = err;
    logger.error('Error creating SFEZ company', meta);
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(company.order_sys_id);
    throw (err);
  }
  debug('..SFEZ company');
  debug(sfezCompany);

  meta.company_id = sfezCompany.id;

  logger.info('SFEZ company successfully created', meta);
  return sfezCompany;
};

function* removeMoltinCompanyOnFailure(moltinCompanyId) {
  var results = '';
  if (moltinCompanyId) {
    try {
      results = yield msc.deleteCompany(moltinCompanyId);
    } catch (err) {
      logger.error('Error removing Moltin company',
        { fn: 'removeMoltinCompanyOnFailure', moltin_company_id: moltinCompanyId, error: err });
      throw (err);
    }
    debug(results);
    logger.info('Moltin company successfully deleted', {
      fn: 'removeMoltinCompanyOnFailure',
      moltin_company_id: moltinCompanyId
    });
  }
}

function* removeCompanyOnFailure(companyId) {
  var results = '';
  if (companyId) {
    try {
      results = yield Company.deleteCompany(companyId);
    } catch (err) {
      logger.error('Error removing SFEZ company',
        { fn: 'removeCompanyOnFailure', company_id: companyId, error: err });
      throw (err);
    }
    debug(results);
    logger.info('SFEZ company successfully deleted', {
      fn: 'removeCompanyOnFailure',
      company_id: companyId
    });
  }
}

function* removeUserOnFailure(userId) {
  var results = '';
  if (userId) {
    try {
      results = yield User.deleteUser(userId);
    } catch (err) {
      logger.error('Error removing SFEZ user',
        { fn: 'removeUserOnFailure', param_user_id: userId, error: err });
      throw (err);
    }
    debug(results);
    logger.info('SFEZ user successfully deleted', {
      fn: 'removeUserOnFailure',
      param_user_id: userId
    });
  }
}

exports.register = function* (next, mapping) {
  var meta = { fn: 'register'}
  logger.info('Registering', meta)
  if (!this.isAuthenticated()) {
    if (mapping) {
      this.body = mapping;
    }

    var first_name = this.body.first_name;
    var last_name = this.body.last_name;
    var company_name = this.body.company_name;
    var email = this.body.email;
    var password = this.body.password;
    var country_id = this.body.country_id;
    var church_name = this.body.church_name;
    var territory_id = this.body.territory_id;
    var phone = this.body.phone;

    meta.church_name = church_name;

    const sentRole = this.body.role; //this is the value sent by the call; 
    //it will be stored in another const as upper case after it is confirmed to have a value
    //otherwise we get errors trying to assign to a const

    meta.role = sentRole;
    logger.info('Registration data snapshot', meta);

    var missingDataMsg = '';

    if (!email) {
        missingDataMsg += 'email address, ';
    }
    if (!first_name) {
      missingDataMsg += 'first name, ';
    }
    if (!last_name) {
      missingDataMsg += 'last name, ';
    }

    if (!password) {
      missingDataMsg += 'password, ';
    }

    var role = ''; 
    if (!sentRole || ['OWNER', 'CUSTOMER', 'ADMIN', 'DRIVER', 'FOODPARKMGR', 'HUBMGR', 'PODMGR'].indexOf(sentRole.toUpperCase()) < 0) {
        missingDataMsg += 'role [CUSTOMER|OWNER|ADMIN|FOODPARKMGR|HUBMGR|PODMGR], ';

        mdm = missingDataMsg.substring(0, missingDataMsg.length-2);
        this.throw(422, 'Please provide value(s) for: '+ mdm);
        
    } else {
        role = sentRole.toUpperCase();
    }
    if (role === 'PODMGR' || role === 'OWNER') {

      if (!church_name) {
        missingDataMsg += 'church name, ';
      }
      if (!country_id) {
        missingDataMsg += 'country, ';
      }

      if (missingDataMsg) {
          mdm = missingDataMsg.substring(0, missingDataMsg.length-2);
          this.throw(422, 'Please provide value(s) for: '+ mdm);
      }

      logger.info('Checking for duplicate church name', meta);
      try {
        existingChurch = (yield Church.churchForChurchName(church_name))[0];
      } catch (err) {
          meta.error = err;
          logger.error('Error during registration', meta);
          throw err;
      }
      if (existingChurch) {
        logger.error('Church name is already in use', meta);
        this.throw(422, 'That Church name is already in use.' );
      }
    }

    if (role === 'HUBMGR') {
      logger.info('Checking if MainHub is created or not', meta);
      try {
        existingFoodPark = (yield FoodPark.getMainHub(this.body.food_park_id))[0];
        if (existingFoodPark === undefined) {
          logger.error('Error during registration: MainHub ID is not proper');
          this.throw(422, 'Improper Main Hub selected');
        }
      } catch  (err) {
        meta.error = err;
        logger.error('Error during registration', meta);
        throw err;
      }
      
      if (existingFoodPark && existingFoodPark.foodpark_mgr !== null) {
        logger.error('Manager already available for the food park you selected')
        this.throw(422, 'Manager already available for the food park you selected');
      }
    }


    logger.info('Checking for duplicate user name/email', meta);
    try {
      existingUser = (yield User.userForUsername(email))[0];
    } catch (err) {
        meta.error = err;
        logger.error('Error during duplicate user name search', meta);
        throw err;
    }
    if (existingUser) {
        logger.error('User name is already in use', meta);
        this.throw(422, 'That email is already in use.');
    }

    if (role == 'DRIVER') {

      if (!territory_id) {
        logger.error('Please enter a territory', meta);
        this.throw(422, 'Please enter a territory.');
      }

      if (!phone) {
        logger.error('Please enter a phone number', meta);
        this.throw(422, 'Please enter your phone number.');
      }

    }

    if (role === 'ADMIN') {
      if (!this.body.admin_register_code || this.body.admin_register_code !== process.env.ADMIN_REGISTER_CODE) {
        this.status = 401;
        this.body = { error: 'You may not register an admin (wrong or absent code).' };
        return;
      }
    }

    var user = {
      first_name: first_name,
      last_name: last_name,
      username: email,
      password: password,
      role: role,
      territory_id: territory_id,
      country_id: country_id,
      phone: phone,
      provider: 'local',
      provider_id: 'local',
      provider_data: '{}'
    };

    debug('register: creating user');
    try {
      var userObject = (yield User.createUser(user))[0];

      if (role === 'PODMGR' ) {
        emailComponents = email.split('@');
        const eml = emailComponents[0] + '-church@' + emailComponents[1];
        user.username = eml;
        user.role = 'OWNER';  
        var tempObject = (yield User.createUser(user))[0];
      }
    } catch (err) {
      console.error('register: error creating user');
      console.error(err)
      throw err;
    }
    debug('...user created with id ' + userObject.id)

    if (role == 'OWNER' || role == 'PODMGR') {
      debug('register: creating church');

      try {
        var church = (yield Church.createChurch(church_name, email, country_id, userObject.id))[0];
      } catch (err) {
        console.error('register: error creating church');
        console.error(err);
        debug('deleting user ' + userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }

      logger.info(church)
      logger.info('...church created with id ' + church.id)
      userObject.church_id = church.id
      logger.info(userObject)
      // try {
      //   var company = yield createCompany(company_name, email, country_id, userObject.id);
      // } catch (err) {
      //   console.error('register: error creating company');
      //   console.error(err)
      //   // clean up user
      //   debug('deleting user ' + userObject.id);
      //   yield removeUserOnFailure(userObject.id);
      //   throw err;
      // }
      // debug(company)
      // debug('...company created with id ' + company.id)
      // userObject.company_id = company.id
      // debug(userObject)

    } else if (role == 'CUSTOMER') {
      debug('register: creating customer with user id ' + userObject.id);

      try {
        var customer = (yield Customer.createCustomer(userObject.id))[0]
      } catch (err) {
        console.error('register: error creating customer');
        console.error(err);
        // clean up user
        debug('deleting user ' + userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
      debug('...customer created with id ' + customer.id)
      debug(customer)
      userObject.customer_id = customer.id

    } else if (role == 'ADMIN') {
      debug('register: creating admin');

      try {
        var admin = (yield Admin.createAdmin(userObject.id))[0];
      } catch (err) {
        console.error('register: error creating admin');
        console.error(err);
        // clean up user
        debug('deleting user ' + userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
      debug('...admin created with id ' + admin.id)
      userObject.admin_id = admin.id
    } else if (role === 'FOODPARKMGR' || role ==='HUBMGR') {
      try {
        yield FoodPark.setManager(this.body.food_park_id, userObject.id);
      } catch (err) {
        console.error('could not set manager on food park');
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
    }

    debug('register: completed. Authenticating user...')
    var userInfo = setUserInfo(userObject);
    this.status = 201;
    this.body = {
      token: 'JWT ' + sts.generateToken(userInfo),
      user: userInfo
    };
    return;
  }

  this.status = 422;
  this.body = { error: 'A user is already logged in.' };
};

exports.fbLogin = function* () {
  const fbid = this.body.fbid;
  const fb_token = this.body.fb_token;
  const fb_email = this.body.fb_email;
  const first_name = this.body.first_name;
  const last_name = this.body.last_name;
  const default_language = this.body.default_language;

  logger.info("FBID: " + fbid);
  logger.info("fb_token: " + fb_token);
  var user = (yield (User.findByFB(fbid)))[0];
  logger.info(user);
  if (!user) {
    var mapping = {};
    mapping.first_name = first_name;
    mapping.last_name = last_name;
    mapping.default_language = default_language;
    if (fb_email) {
      mapping.username = fb_email;
    }
    else {
      mapping.username = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      }) + '@sfez.com';
    }
    mapping.password = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    mapping.role = 'CUSTOMER';
    mapping.fbid = fbid;
    mapping.fb_token = fb_token;
    mapping.fb_login = true;
    var user = mapping;
    debug('register: creating user');
    try {
      var userObject = (yield User.createUser(user))[0];
    } catch (err) {
      console.error('register: error creating user');
      console.error(err)
      throw err;
    }
    debug('...user created with id ' + userObject.id)
    debug('register: creating customer with user id ' + userObject.id);

    try {
      var customer = (yield Customer.createCustomer(userObject.id))[0];
    } catch (err) {
      console.error('register: error creating customer');
      console.error(err);
      // clean up user
      debug('deleting user ' + userObject.id);
      yield removeUserOnFailure(userObject.id);
      throw err;
    }
    debug('...customer created with id ' + customer.id)
    debug(customer)
    userObject.customer_id = customer.id;
    debug('register: completed. Authenticating user...')
    var userInfo = setUserInfo(userObject);
    this.status = 201;
    this.body = {
      token: 'JWT ' + sts.generateToken(userInfo),
      user: userInfo
    };
    return;
  }
  else {
    yield (User.updateUser(user.id, { default_language: default_language }));
  }
  var id = { id: user.id };
  logger.info(user);
  var userInfo = (yield (User.updateFB(id.id, fbid, fb_token)))[0];
  logger.info(userInfo);
  var customerId = (yield (Customer.getCustomerIdForUser(id.id)))[0];
  if (customerId) {
    logger.info("customerId: " + customerId);
    userInfo.customer_id = customerId.id;
  }
  this.body = {
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo
  };
  return;
}

exports.fbRegister = function* () {
  var sfezId = this.body.sfezId;
  var fbId = this.body.fbid;
  var fb_token = this.body.fb_token;
  console.log("FB REGISTER: " + sfezId);
  var user = (yield (User.updateFB(sfezId, fbId, fb_token)))[0];
  return user;
}

exports.fbAuth = function* () {
  var self = this;
  var retUser;
  passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_CLIENT_ID,
    clientSecret: config.FACEBOOK_CLIENT_SECRET,
    callbackURL: 'http://198.199.86.137:1337/auth/fb',
    //callbackURL : 'http://127.0.0.1:11080/auth/fb',
    profileFields: ['id', 'email', 'first_name', 'last_name']
  },
    function (access_token, refresh_token, profile, done) {
      var returnPayload;
      var fbProfile = profile;
      logger.info(access_token);
      logger.info(refresh_token);
      logger.info('PROFILE:');
      logger.info(profile);
      logger.info(fbProfile._raw.last_name);
      var user = (yield(User.findByFB(fbProfile.id)))[0];
      var info = {
        id: user.id,
        username: user.username,
        role: user.role
      };
      logger.info("Res of findByFB: " + user);
      if (user) {
        logger.info('found user: ' + user.id + ", " + user.name);

        returnPayload = {
          jwt: sts.generateToken(info),
          fbToken: access_token
        };
        self.body = returnPayload;
        return done(null, returnPayload);
      }
      else {
        logger.info("New User -- " + fbProfile.emails[0].value);
        var newUser = {
          username: fbProfile.emails[0].value,
          password: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }),
          first_name: fbProfile.first_name,
          last_name: fbProfile.last_name,
          fbid: fbProfile.id,
          fb_token: access_token,
          fb_login: true,
          role: 'CUSTOMER',
          provider: 'facebook'
        }
        returnPayload = {
          jwt: sts.generateToken(user),
          fbToken: access_token
        };
        self.body = returnPayload;
        logger.info(newUser);
        var usr = yield(User.createUser(newUser));
        return done(null, newUser);
      }
    }));
  yield passport.authenticate('facebook', {
    scope: [
      // 'pages_messaging_subscriptions',  // Requires Facebook Review of app login
      'email', 'public_profile'], failureRedirect: '/#'
  },
    function* (req, res, next) {
      logger.info(res);
      logger.info('req:' + req);
    }
  );
}

// exports.fbDone = function*() {
//   passport.authenticate('facebook', { failureRedirect: '/' },
//   function(req, res) {
//     res.redirect('/auth/fbRegister');
//   });
// }

exports.roleAuthorization = function* (role, role2) {
  debug('roleAuthorization')
  debug(this.passport.user);
  if (this.passport.user) {
    try {
      var user = (yield User.getSingleUser(this.passport.user.id))[0]
      debug(user)
    } catch (err) {
      debug(err);
      this.status = 422
      this.body = { error: 'No user was found.' }
      return;
    }
    if (user.role == role || user.role == role2) {
      debug('found ' + user.role)
      yield next();
    }
    debug('401 Unauthorized');
    this.status = 401
    this.body = { error: 'You are not authorized to view this content.' }
    return;
  }
}

exports.isAuthorized = function* (role, role2) {
  debug('isAuthorized');
  debug(this.passport.user);
  if (this.passport.user) {
    if (this.passport.user.role == role || this.passport.user.role == role2) {
      debug('found ' + this.passport.user.role)
      return true;
    }
    return false
  } else {
    return false
  }
}

exports.logout = function (req, res) {
  req.logout();
  res.redirect('/');
};

exports.saveOAuthUserProfile = function (req, profile, done) {
  User.findOne({
    provider: profile.provider,
    providerId: profile.providerId,
  },
    function (err, user) {
      if (err) {
        return done(err);
      } else {
        if (!user) {
          var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
          User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
            profile.username = availableUsername;
            user = new User(profile);

            user.save(function (err) {
              if (err) {
                var message = _this.getErrorMessage(err);
                this.flash = { error: message };
                return res.redirect('/signup');
              }

              return done(err, user);
            });
          });
        } else {
          return done(err, user);
        }
      }
    }
  );
};
