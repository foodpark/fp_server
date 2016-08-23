var sts = require('./security.server.controller'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    User = require('../models/user.server.model'),
    Company = require('../models/company.server.model'),
    Customer = require('../models/customer.server.model'),
    debug = require('debug')('authentication.server.controller');

var _ = require('lodash');

exports.CUSTOMER = 'CUSTOMER';
exports.OWNER    = 'OWNER';
exports.SITE_MGR = 'SITEMGR';
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

var setUserInfo = function(user) {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

exports.login = function*(next) {
  this.body = _.keys(this);
  return;

  var userInfo = setUserInfo(this.user);
  this.status = 200;
  this.body = {
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo,
  };
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

var createMoltinCompany = function(company, callback) {
  console.log('create Moltin company: entry');
  msc.createCompany(company, function(comp) {
    if (comp instanceof Error) {
      console.error(comp);
      return callback(comp);
    }

    console.log('create Moltin company: leaving');
    return callback(null, comp);
  });
};

var createMoltinDefaultCategory = function(company, callback) {
  msc.createDefaultCategory(company, function(category) {
    if (category instanceof Error) {
      console.error(category);
      return callback(category);
    }

    return callback(null, category);
  });
};

var createCompany = function(companyName, email, userId) {
  return new Promise(function(resolve, reject) {
    console.log('create company: userId is ');
    console.log(userId);
    var company = {
      name: companyName,
      email: email,
      userId: userId,
    };
    createMoltinCompany(company, function(err, moltinCompany) {
      if (err) {
        console.error('createCompany: error during Moltin company creation');
        console.error(err);
        reject(err);
        return;
      }

      console.log('moltin company successfully created : ' + moltinCompany.id);
      company.orderSysId = moltinCompany.id;
      createMoltinDefaultCategory(moltinCompany, function(err, moltinCat) {
        if (err) {
          console.error('createCompany: error during Moltin default category creation');
          console.error(err);
          reject(err);
        }

        console.log('moltin category successfully created : ' + moltinCat.id);
        Company.createCompany(companyName, email, userId, moltinCompany.id, moltinCat.id, moltinCat.slug,
                              function(err, companyId) {
                                if (err) {
                                  console.error('createCompany: error creating company');
                                  console.error(err);
                                  reject(err);
                                } else {
                                  resolve(companyId);
                                }
                              });
      });
    });
  });
};

exports.register = function*(next) {
  if (!this.isAuthenticated()) {
    const email = this.body.email;
    const name = this.body.name;
    const companyName = this.body.companyName || this.body.companyname;
    const username = this.body.username;
    const password = this.body.password;
    const role = this.body.role.toUpperCase();

    if (!email) {return res.status(422).send({ error: 'Please enter an email address.'});}

    if (!name) {return res.status(422).send({ error: 'Please enter your name.'});}

    if (!username) {return res.status(422).send({ error: 'Please enter a user name.'});}

    if (!password) {return res.status(422).send({ error: 'Please enter a password.'});}

    if (!role) {return res.status(422).send({ error: 'Please specify member or owner.'});}

    if (role == 'OWNER') {
      if (!companyName) {return res.status(422).send({ error: 'Please enter a company name.'});}
    }

    console.log('register: checking for duplicate user name');
    debug('register: checking for duplicate user name');

    try {
      existingUser = (yield User.userForUsername(username))[0];
    } catch (err) {
      console.error('register: error during registration');
      throw err;
    }

    if (existingUser) {
      this.status = 422;
      this.body = { error: 'That user name is already in use.'};
      return;
    }

    var user = {
      name: name,
      email: email,
      username: username,
      password: password,
      role: role,
    };
    console.log(user);
    if (role == 'OWNER') {
      var message = null;
      console.log('register: creating User-Owner');

      var provider = 'local';
      var provider_id = 'local';
      var provider_data = null;

      try {
        var userObject = (yield User.createUser(Object.assign(user, { provider, provider_id, provider_data })))[0];
      } catch (err) {
        console.error('register: error creating user');
        throw err;
      }

      try {
        var companyId  = yield createCompany(companyName, email, userObject.id);
      } catch (err) {
        console.error('register: error creating company');
        throw err;
      }

      var userInfo = setUserInfo(user);
      this.status = 201;
      this.body = {
        token: 'JWT ' + sts.generateToken(userInfo),
        user: userInfo,
      };
      return;
    } else if (role == 'CUSTOMER') {
      console.log('register: creating User-Customer');
      var message = null;
      debug(this.body);
      user.role = 'CUSTOMER';

      var provider = 'local';
      var provider_id = 'local';
      var provider_data = null;

      try {
        var userObject = User.createUser(Object.assign(user, { provider, provider_id, provider_data }));
      } catch (err) {
        console.error('register: error creating user');

        throw err;
      }

      user.userId = userObject.id;

      console.log('register: creating customer');

      try {
        var customerId = yield Customer.createCustomer(name, userId); // , function(err, customerId) {
      } catch (err) {
        console.error('register: error creating customer');
        throw err;
      }

      var userInfo = setUserInfo(user);
      return res.status(201).json({
        token: 'JWT ' + sts.generateToken(userInfo),
        user: userInfo,
      });

      return;
    } else if (role == 'ADMIN') {
      console.log('register: creating User-Customer');
      var message = null;
      debug(this.body);
      user.role = 'ADMIN';
      createCustomer(user, next);
      return;
    }
  }

  this.status = 422;
  this.body = { error: 'A user is already logged in.'};

};

exports.roleAuthorization = function(role) {
  return function*(next) {
    debug(this.user);
    const user = this.user;
    User.getSingleUser(user._id, function(err, foundUser) {
      if (err) {
        debug(err);
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }

      if (foundUser.role == role) {
        debug('found');
        return next();
      }

      debug('401 Unauthorized');
      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    });
  };
};

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
