var sts = require('./security.server.controller'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    User = require('../models/user.server.model'),
    Company = require('../models/company.server.model'),
    Customer = require('../models/customer.server.model'),
    Admin = require('../models/admin.server.model'),
    debug = require('debug')('auth');

var _ = require('lodash');

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
  if (user.company_id) info.company_id = user.company_id
  else if (user.customer_id) info.customer_id = user.customer_id
  else if (user.admin_id) info.admin_id = user.admin_id
  debug(info)
  return info
};

exports.login = function *(next) {
  debug('login complete')
  debug(this.passport.user)
  debug('calling')
  userInfo = setUserInfo(this.passport.user)
  if (this.passport.user.role == 'OWNER') {
    try {
      var company = (yield Company.companyForUser(this.passport.user.id))[0];
    } catch (err) {
      console.error('login: error retrieving company for Owner '+this.passport.user.id);
      console.error(err)
      throw err;
    }
    userInfo.company_id = company.id;
  } else if (this.passport.user.role == 'CUSTOMER') {
    try {
      var customer = (yield Customer.getForUser(this.passport.user.id))[0];
    } catch (err) {
      console.error('login: error retrieving company for Owner '+this.passport.user.id);
      console.error(err)
      throw err;
    }
    userInfo.customer_id = customer.id
  } else if (this.passport.user.role == 'ADMIN') {
    try {
      var admin = (yield Admin.getForUser(this.passport.user.id))[0];
    } catch (err) {
      console.error('login: error retrieving company for Owner '+this.passport.user.id);
      console.error(err)
      throw err;
    }
    userInfo.admin_id = admin.id
  }
  debug('done')
  debug('userInfo: '+ userInfo)
  this.status = 200;
  this.body = {
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo
  };
  debug(this.body)
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
  debug('createMoltinCompany');
  try {
    var results = yield msc.createCompany(company)
  } catch (err) {
    console.error(err);
    throw (err);
  }
  debug('createMoltinCompany: moltin company created');
  return results
};

var createMoltinDefaultCategory = function *(company) {
  debug('createMoltinDefaultCategory');
  try {
    var results = yield msc.createDefaultCategory(company)
  } catch (err) {
    console.error(err);
    throw (err);
  }
  return results;
};

var createMoltinDeliveryChargeCategory = function *(company, defaultCat) {
  debug('createMoltinDeliveryChargeCategory');
  debug(company);
  debug('default cat '+ defaultCat);
  var category = '';
  try {
    category = yield msc.createCategory(company, "Delivery Charge Category", defaultCat);
  } catch (err) {
      console.error('error creating delivery charge category in ordering system ');
      throw(err);
  }
  return category;
};

var createMoltinDeliveryChargeItem = function *(company, deliveryCat) {
  debug('createMoltinDeliveryChargeItem');
  var chargeItem = '';
  var title = "Delivery Charge";
  var status = 1; // live
  var description = "Delivery Charge";
  try {
    chargeItem = yield msc.createMenuItem(company, title, status, config.deliveryCharge, deliveryCat, description);
  } catch (err) {
    console.error(err)
    console.error('error creating delivery charge item in ordering system ')
    throw(err)
  }
  return chargeItem;
};

var createCompany = function *(company_name, email, userId) {
  debug('createCompany');
  debug('user id is '+ userId);
  var company = {
    name: company_name,
    email: email,
    userId: userId,
  };
  var moltinCompany = '';
  try {
    moltinCompany = yield createMoltinCompany(company)
  } catch (err) {
    console.error('createCompany: error during Moltin company creation');
    console.error(err);
    throw (err);
  }
  debug('..moltin company successfully created : ' + moltinCompany.id);
  debug(moltinCompany);
  company.order_sys_id = moltinCompany.id;

  debug('..create default category');
  var moltinCat = '';
  try {
    moltinCat = yield createMoltinDefaultCategory(moltinCompany);
  } catch (err) {
    console.error('createCompany: error during Moltin default category creation');
    console.error(err);
    // TODO: Either delete Moltin company and SFEZ user, or queue for category creation
    throw (err);
  }
  debug('moltin category successfully created : ' + moltinCat.id);
  company.default_cat = moltinCat.id;
  company.base_slug = moltinCat.slug;

  debug('..create delivery charge category');
  var deliveryChgCat = '';
  try {
    var co = 
    deliveryChgCat = yield createMoltinDeliveryChargeCategory(company, moltinCat.id);
  } catch (err) {
    console.error('createCompany: error during Moltin delivery charge category creation');
    console.error(err);
    throw (err);
  }

  debug('..create delivery charge item');
  var deliveryChgItem = '';
  try {
    deliveryChgItem = yield createMoltinDeliveryChargeItem(company, deliveryChgCat.id);
  } catch (err) {
    console.error('createCompany: error during Moltin delivery charge item creation');
    console.error(err);
    throw (err);
  }

 var sfezCompany = '';
  try {
    sfezCompany = yield Company.createCompany(company_name, email, userId, moltinCompany.id, 
      moltinCat.id, moltinCat.slug, deliveryChgCat.id, deliveryChgItem.id, config.deliveryCharge);
  } catch (err) {
    console.error('createCompany: error creating company');
    console.error(err);

    // TODO: add compensating transactions
    throw (err);
  }
  debug('..SFEZ company');
  debug(sfezCompany);
  return sfezCompany;
};

exports.register = function*(next) {
  debug("register")
  if (!this.isAuthenticated()) {
    const first_name = this.body.first_name;
    const last_name = this.body.last_name;
    const company_name = this.body.company_name;
    const email = this.body.email;
    const password = this.body.password;
    const role = this.body.role.toUpperCase();

    if (!email) {
      this.status = 422
      this.body = {error: 'Please enter an email address.'}
      return;
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
        debug('deleting user '+ userObject.id)
        try {
          var del = yield User.deleteUser(userObject.id)
        } catch (delErr) {
          console.err('register: error cleaning up user')
          throw delErr
        }
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
        console.error(err)
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
        console.error(err)
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
  debug('isAuthorized')
  debug(this.passport.user);
  if (this.passport.user) {
    try {
     var user = (yield User.getSingleUser(this.passport.user.id))[0]
     debug(user)
    } catch (err) {
      debug(err);
      throw new Error('No user was found for id '+ this.passport.user.id)
    }
    if (user.role == role || user.role == role2) {
      debug('found '+ user.role)
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
