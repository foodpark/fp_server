var sts = require('./security.server.controller');
var msc = require('./moltin.server.controller');
var config = require('../../config/config');
var User = require('../models/user.server.model');
var Company = require('../models/company.server.model');
var Customer = require('../models/customer.server.model');
var Admin = require('../models/admin.server.model');
var Unit = require('../models/unit.server.model');
var debug = require('debug')('auth');
var _ = require('lodash');
var logger = require('winston');
var FacebookStrategy = require('passport-facebook').Strategy;
var passport = require('passport');


exports.CUSTOMER = 'CUSTOMER';
exports.OWNER    = 'OWNER';
exports.UNIT_MGR = 'UNITMGR';
exports.ADMIN    = 'ADMIN';

var getErrorMessage = function(err) {
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
  }  else {
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
  debug(info)
  return info
};

exports.login = function *(next) {
  debug('login complete')
  debug(this.passport.user)
  debug('calling')
  meta = {
    fn : 'login',
    user_id : this.passport.user.id,
    role : this.passport.user.role
  };
  logger.info('User logging in', meta);
  userInfo = setUserInfo(this.passport.user)
  if (this.passport.user.role == 'OWNER') {
    var company = '';
    try {
      company = (yield Company.companyForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving company for owner',
        {fn: 'login', user_id: this.passport.user.id, error: err});
      throw err;
    }
    userInfo.company_id = company.id;
    meta.company_id = company.id;
  } else if (this.passport.user.role == 'CUSTOMER') {
    var customer = '';
    try {
      customer = (yield Customer.getForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving customer role for user',
        {fn: 'login', user_id: this.passport.user.id, error: err});
      throw err;
    }
    userInfo.customer_id = customer.id
    meta.customer_id = customer.id;
  } else if (this.passport.user.role == 'ADMIN') {
    var admin = '';
    try {
      admin = (yield Admin.getForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving admin role for user',
        {fn: 'login', user_id: this.passport.user.id, error: err});
      throw err;
    }
    userInfo.admin_id = admin.id
    meta.admin_id = admin.id;
  } else if (this.passport.user.role == 'UNITMGR') {
    var unit = '';
    try {
      unit = (yield Unit.getForUser(this.passport.user.id))[0];
    } catch (err) {
      logger.error('Error retrieving unit for unit manager',
        {fn: 'login', user_id: this.passport.user.id, error: err});
      throw err;
    }
    userInfo.unit_id = unit.id
    meta.unit_id = unit.id;
  }
  debug('done')
  debug('userInfo: '+ userInfo)
  this.status = 200;
  this.body = {
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo
  };
  debug(this.body);
  logger.info('login completed for user ', meta);
  return;
};

exports.renderLogin = function*(next) {
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

exports.renderRegister = function*(next) {
  if (!this.state.user) {
    yield this.render('register', {
      title: 'Register',
      messages: this.flash.error,
    });
  }  else {
    this.redirect('/');
  }
};


var createMoltinCompany = function *(company) {
  logger.info('create moltin company', {fn: 'createMoltinCompany', company_id:company.id});
  var results = '';
  try {
    results = yield msc.createCompany(company)
  } catch (err) {
    logger.error('Error creating company for owner',
      {fn: 'createMoltinCompany', company_id: company.id, error: err});
    throw (err);
  }
  debug(results);
  logger.info('moltin company created', {fn: 'createMoltinCompany', company_id: company.id,
    results: results.id});
  return results
};


var createMoltinDefaultCategory = function *(company) {
  logger.info('create moltin default category', {fn: 'createMoltinDefaultCategory', company_id:company.id});
  var results = '';
  try {
    results = yield msc.createDefaultCategory(company)
  } catch (err) {
    logger.error('Error creating moltin default category',
      {fn: 'createMoltinDefaultCategory', company_id: company.id, error: err});
    throw (err);
  }
  logger.info('default category created', {fn: 'createMoltinDefaultCategory', company_id: company.id});
  return results;
};


var createMoltinDailySpecialCategory = function *(company, defaultCat) {
  logger.info('createMoltinDailySpecialCategory', {fn: 'createMoltinDailySpecialCategory',
    company_id:company.id, default_cat: defaultCat});
  var category = '';
  try {
    category = yield msc.createCategory(company, "Daily Specials", defaultCat);
  } catch (err) {
      logger.error('Error creating daily special category',
        {fn: 'createMoltinDailySpecialCategory', company_id: company.id,
        default_cat: defaultCat, error: err});
      throw(err);
  }
  logger.info('daily specials category created', {fn: 'createMoltinDailySpecialsCategory',
    company_id:company.id, default_cat: defaultCat});
  return category;
};


var createMoltinDeliveryChargeCategory = function *(company, defaultCat) {
  logger.info('createMoltinDeliveryChargeCategory',
    {fn: 'createMoltinDeliveryChargeCategory', company_id: company.id, default_cat: defaultCat});
  var category = '';
  try {
    category = yield msc.createCategory(company, "Delivery Charge Category", defaultCat);
  } catch (err) {
      logger.error('Error creating delivery charge category',
        {fn: 'createMoltinDailySpecialCategory', company_id: company.id, default_cat: defaultCat, error: err});
  }
  logger.info('createMoltinDeliveryChargeCategory',
    {fn: 'createMoltinDeliveryChargeCategory', company_id: company.id, default_cat: defaultCat});
  return category;
};


var createMoltinDeliveryChargeItem = function *(company, deliveryCat) {
  logger.info('start create of Moltin Delivery Charge Item',
    {fn: 'createMoltinDeliveryChargeItem', company_id: company.id, delivery_cat: deliveryCat});
  var chargeItem = '';
  var title = "Delivery Charge";
  var status = 1; // live
  var description = "Delivery Charge";
  try {
    chargeItem = yield msc.createMenuItem(company, title, status, config.deliveryCharge, deliveryCat, description);
  } catch (err) {
    logger.error('Error creating delivery charge item',
      {fn: 'createMoltinDailySpecialCategory', company_id: company.id, default_cat: defaultCat, error: err});
    throw(err)
  }
  logger.info('createMoltinDeliveryChargeItem',
    {fn: 'createMoltinDeliveryChargeItem', company_id: company.id, delivery_chg_cat_id: deliveryCat,
    delivery_cat_item: chargeItem.id});
  return chargeItem;
};


var createCompany = function *(company_name, email, userId) {
  logger.info('start create of SFEZ company', {fn: 'createCompany',
    company_name: company_name, param_user_id: userId});
  debug('..email '+ email);
  var company = {
    name: company_name,
    email: email,
    userId: userId,
  };
  var moltinCompany = '';
  try {
    moltinCompany = yield createMoltinCompany(company)
  } catch (err) {
    logger.error('Error during Moltin company creation',
      {fn: 'createCompany', company_name: company_name, param_user_id: userId, error: err});
    throw (err);
  }
  debug(moltinCompany);
  company.order_sys_id = moltinCompany.id;

  logger.info('Moltin company successfully created', {fn: 'createCompany',
    company_name: company_name, param_user_id: userId, moltin_company_id: moltinCompany.id});

  debug('..create default category');
  var moltinCat = '';
  try {
    moltinCat = yield createMoltinDefaultCategory(moltinCompany);
  } catch (err) {
    logger.error('Error during Moltin default category creation',
      {fn: 'createCompany', param_user_id: userId,
      company_name: company_name, moltin_company_id: moltinCompany.id, error: err});
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }
  company.default_cat = moltinCat.id;
  company.base_slug = moltinCat.slug;

  logger.info('Moltin default category successfully created', {fn: 'createCompany',
    company_name: company_name, param_user_id: userId,
    moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id});

  debug('..create daily special category');
  var dailySpecialCat = '';
  try {
    var co =
    dailySpecialCat = yield createMoltinDailySpecialCategory(company, moltinCat.id);
  } catch (err) {
    logger.error('Error during Moltin daily special category creation',
      {fn: 'createCompany',
      company_name: company_name, param_user_id: userId,
      moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id, error: err});
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }

  logger.info('daily special category successfully created', {fn: 'createCompany',
    company_name: company_name, param_user_id: userId,
    moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
    daily_special_cat_id: dailySpecialCat.id});

  debug('..create delivery charge category');
  var deliveryChgCat = '';
  try {
    var co =
    deliveryChgCat = yield createMoltinDeliveryChargeCategory(company, moltinCat.id);
  } catch (err) {
    logger.error('Error during Moltin delivery charge category creation',
      {fn: 'createCompany',
      company_name: company_name, param_user_id: userId,
      moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id, error: err});
    debug('Removing Moltin company');
    yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }

  logger.info('delivery charge category successfully created', {fn: 'createCompany',
    company_name: company_name, param_user_id: userId,
    moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
    daily_special_cat_id: dailySpecialCat.id, delivery_chg_cat_id: deliveryChgCat.id});

  debug('..create delivery charge item');
  var deliveryChgItem = '';
  try {
    deliveryChgItem = yield createMoltinDeliveryChargeItem(company, deliveryChgCat.id);
  } catch (err) {
    logger.error('Error during Moltin delivery charge item creation',
      {fn: 'createCompany', param_user_id: userId,
      company_name: company_name, moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
      delivery_chg_cat_id: deliveryChgCat.id, error: err});
      debug('Removing Moltin company');
      yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }

  logger.info('delivery charge item successfully created', {fn: 'createCompany',
    param_user_id: userId,
    company_name: company_name, moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
    daily_special_cat_id: dailySpecialCat.id, delivery_chg_cat_id: deliveryChgCat.id,
    delivery_chg_item_id: deliveryChgItem.id});

 var sfezCompany = '';
  try {
    sfezCompany = yield Company.createCompany(company_name, email, userId, moltinCompany.id,
      moltinCat.id, moltinCat.slug, deliveryChgCat.id, deliveryChgItem.id, config.deliveryCharge,
      dailySpecialCat.id);
  } catch (err) {
    logger.error('Error creating SFEZ company',
      {fn: 'createCompany', param_user_id: userId,
      company_name: company_name, moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
      delivery_chg_cat_id: deliveryChgCat.id, delivery_chg_item_id: deliveryChgItem.id, error: err});
      debug('Removing Moltin company');
      yield removeMoltinCompanyOnFailure(moltinCompany.id);
    throw (err);
  }
  debug('..SFEZ company');
  debug(sfezCompany);

  logger.info('SFEZ company successfully created', {fn: 'createCompany',
    param_user_id: userId,
    company_id: sfezCompany.id, moltin_company_id: moltinCompany.id, default_cat_id: moltinCat.id,
    daily_special_cat_id: dailySpecialCat.id, delivery_chg_cat_id: deliveryChgCat.id,
    delivery_chg_item_id: deliveryChgItem.id});
  return sfezCompany;
};

function * removeMoltinCompanyOnFailure(moltinCompanyId) {
  var results ='';
  if (moltinCompanyId) {
    try {
      results = yield msc.deleteCompany(company_name, email, userId, moltinCompany.id,
        moltinCat.id, moltinCat.slug, deliveryChgCat.id, deliveryChgItem.id, config.deliveryCharge,
        dailySpecialCat.id);
    } catch (err) {
      logger.error('Error removing Moltin company',
        {fn: 'removeMoltinCompanyOnFailure', param_user_id: userId, company_id: companyId, error: err});
      throw (err);
    }
    debug(results);
    logger.info('Moltin company successfully deleted', {fn: 'removeMoltinCompanyOnFailure',
      param_user_id: userId, company_id: companyId});
  }
}

function * removeCompanyOnFailure(moltinCompanyId) {
  var results ='';
  if (companyId) {
    try {
      results = yield Company.createCompany(company_name, email, userId, moltinCompany.id,
        moltinCat.id, moltinCat.slug, deliveryChgCat.id, deliveryChgItem.id, config.deliveryCharge,
        dailySpecialCat.id);
    } catch (err) {
      logger.error('Error removing SFEZ company',
        {fn: 'removeCompanyOnFailure', param_user_id: userId, company_id: companyId, error: err});
      throw (err);
    }
    debug(results);
    logger.info('SFEZ company successfully deleted', {fn: 'removeCompanyOnFailure',
      param_user_id: userId, company_id: companyId});
  }
}

function * removeUserOnFailure(userId) {
  var results ='';
  if (userId) {
    try {
      results = yield User.deleteUser(userId);
    } catch (err) {
      logger.error('Error removing SFEZ user',
        {fn: 'removeUserOnFailure', param_user_id: userId, error: err});
      throw (err);
    }
    debug(results);
    logger.info('SFEZ user successfully deleted', {fn: 'removeUserOnFailure',
      param_user_id: userId});
  }
}

exports.register = function*(next, mapping) {
  debug("register")
  if (!this.isAuthenticated()) {
    if (mapping) {
      this.body = mapping;
    }
    const first_name = this.body.first_name;
    const last_name = this.body.last_name;
    const company_name = this.body.company_name;
    const email = this.body.email;
    const password = this.body.password;
    const role = this.body.role.toUpperCase();

    if (!email) {
      this.throw(422, 'Please enter an email address.');
      //this.status = 422
      //this.body = {error: 'Please enter an email address.'}
      //return;
    }
    if (!first_name) {
      this.status = 422
      this.body = {error: 'Please enter your first name.'}
      return;
    }
    if (!last_name) {
      this.status = 422
      this.body = {error: 'Please enter your last name.'}
      return;
    }
    if (!password) {
      this.status = 422
      this.body = {error: 'Please enter a password.'}
      return;
    }
    if (!role || ['OWNER','CUSTOMER','ADMIN'].indexOf(role) < 0) {
      this.status = 422
      this.body = {error: 'Missing role: CUSTOMER / OWNER / ADMIN'}
      return;
    }
    if (role == 'OWNER') {
      if (!company_name) {
        this.status = 422
        this.body = {error: 'Please enter a company name.'}
        return;
      }
      debug('register: checking for duplicate company name');
      try {
        existingCompany = (yield Company.companyForCompanyName(company_name))[0];
      } catch (err) {
        console.error('register: error during registration');
        console.error(err)
        throw err;
      }
      if (existingCompany) {
        this.status = 422;
        this.body = { error: 'That company name is already in use.'};
        return;
      }
    }

    debug('register: checking for duplicate user name/email');
    try {
      existingUser = (yield User.userForUsername(email))[0];
    } catch (err) {
      console.error('register: error during registration');
      console.error(err)
      throw err;
    }
    if (existingUser) {
      this.status = 422;
      this.body = { error: 'That email is already in use.'};
      return;
    }

    var user = {
      first_name: first_name,
      last_name: last_name,
      username: email,
      password: password,
      role: role,
      provider: 'local',
      provider_id: 'local',
      provider_data: '{}'
    };

    debug('register: creating user');
    try {
      var userObject =  (yield User.createUser(user))[0];
    } catch (err) {
      console.error('register: error creating user');
      console.error(err)
      throw err;
    }
    debug('...user created with id '+ userObject.id)

    if (role == 'OWNER') {
      debug('register: creating company');

      try {
        var company  = (yield createCompany(company_name, email, userObject.id))[0];
      } catch (err) {
        console.error('register: error creating company');
        console.error(err)
        // clean up user
        debug('deleting user '+ userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
      debug(company)
      debug('...company created with id '+ company.id)
      userObject.company_id = company.id
      debug(userObject)

    } else if (role == 'CUSTOMER') {
      debug('register: creating customer with user id '+ userObject.id);

      try {
        var customer = (yield Customer.createCustomer(userObject.id))[0]
      } catch (err) {
        console.error('register: error creating customer');
        console.error(err);
        // clean up user
        debug('deleting user '+ userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
      debug('...customer created with id '+ customer.id)
      debug(customer)
      userObject.customer_id = customer.id

    } else if (role == 'ADMIN') {
      debug('register: creating admin');

      try {
        var admin = (yield Admin.createAdmin(userObject.id))[0]
      } catch (err) {
        console.error('register: error creating admin');
        console.error(err);
        // clean up user
        debug('deleting user '+ userObject.id);
        yield removeUserOnFailure(userObject.id);
        throw err;
      }
      debug('...admin created with id '+ admin.id)
      userObject.admin_id = admin.id

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
  this.body = { error: 'A user is already logged in.'};
};

exports.fbLogin = function*() {
  const fbid = this.body.fbid;
  const fb_token = this.body.fb_token;
  const fb_email = this.body.fb_email;
  const first_name = this.body.first_name;
  const last_name = this.body.last_name;

  logger.info("FBID: " + fbid);
  logger.info("fb_token: " + fb_token);
  var user = (yield(User.findByFB(fbid)))[0];
  logger.info(user);
  if (!user) {
    var mapping = {};
    mapping.first_name = first_name;
    mapping.last_name = last_name;
    if (fb_email) {
      mapping.username = fb_email;
    }
    else {
      mapping.username = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      }) + '@sfez.com';
    }
    mapping.password = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
    mapping.role = 'CUSTOMER';
    mapping.fbid = fbid;
    mapping.fb_token = fb_token;
    var user = mapping;
    debug('register: creating user');
    try {
      var userObject = (yield User.createUser(user))[0];
    } catch (err) {
      console.error('register: error creating user');
      console.error(err)
      throw err;
    }
    debug('...user created with id '+ userObject.id)
    debug('register: creating customer with user id '+ userObject.id);

    try {
      var customer = (yield Customer.createCustomer(userObject.id))[0]
    } catch (err) {
      console.error('register: error creating customer');
      console.error(err);
      // clean up user
      debug('deleting user '+ userObject.id);
      yield removeUserOnFailure(userObject.id);
      throw err;
    }
    debug('...customer created with id '+ customer.id)
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
  var id = { id : user.id };
  logger.info(user);
  yield(User.updateFB(id.id, fbid, fb_token));
  var info = {
    id: user.id,
    username: user.username,
    role: user.role
  };
  this.body = sts.generateToken(info);
  return;
}

exports.fbRegister = function*() {
  var sfezId = this.body.sfezId;
  var fbId = this.body.fbid;
  var fb_token = this.body.fb_token;
  console.log("FB REGISTER: " + sfezId);
  var user = (yield(User.updateFB(sfezId, fbId, fb_token)))[0];
  return user;
}

exports.fbAuth = function*() {
  var self = this;
  var retUser;
  passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_CLIENT_ID,
    clientSecret: config.FACEBOOK_CLIENT_SECRET,
    callbackURL : 'http://198.199.86.137:1337/auth/fb',
    //callbackURL : 'http://127.0.0.1:11080/auth/fb',
    profileFields: ['id', 'email', 'first_name', 'last_name']
  },
  function(access_token, refresh_token, profile, done) {
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

      returnPayload = { jwt : sts.generateToken(info),
                        fbToken : access_token};
      self.body = returnPayload;
      return done(null, returnPayload);
    }
    else {
      logger.info("New User -- " + fbProfile.emails[0].value);
      var newUser = {
        username: fbProfile.emails[0].value,
        password: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
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
      returnPayload = { jwt : sts.generateToken(user),
                        fbToken : access_token};
      self.body = returnPayload;
      logger.info(newUser);
      var usr = yield(User.createUser(newUser));
      return done(null, newUser);
    }}));
  yield passport.authenticate('facebook', {
    scope: [
      // 'pages_messaging_subscriptions',  // Requires Facebook Review of app login
      'email', 'public_profile'], failureRedirect : '/#'},
    function *(req, res, next) {
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

exports.roleAuthorization = function *(role, role2) {
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
      debug('found '+ user.role)
      yield next();
    }
    debug('401 Unauthorized');
    this.status = 401
    this.body = { error: 'You are not authorized to view this content.' }
    return;
  }
}

exports.isAuthorized = function *(role, role2) {
  debug('isAuthorized');
  debug(this.passport.user);
  if (this.passport.user) {
    if (this.passport.user.role == role || this.passport.user.role == role2) {
      debug('found '+ this.passport.user.role)
      return true;
    }
    return false
  } else {
    return false
  }
}

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.saveOAuthUserProfile = function(req, profile, done) {
    User.findOne({
      provider: profile.provider,
      providerId: profile.providerId,
    },
        function(err, user) {
          if (err) {
            return done(err);
          }          else {
            if (!user) {
              var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
              User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                profile.username = availableUsername;
                user = new User(profile);

                user.save(function(err) {
                  if (err) {
                    var message = _this.getErrorMessage(err);
                    this.flash = { error: message };
                    return res.redirect('/signup');
                  }

                  return done(err, user);
                });
              });
            }            else {
              return done(err, user);
            }
          }
        }
    );
  };
