var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    sts = require('./security.server.controller'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    debug = require('debug')('authentication.server.controller');

exports.CUSTOMER = 'Customer'
exports.ONWER = 'Owner'
exports.SITE_MGR = 'SiteMgr'
exports.ADMIN = 'Admin'

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
    }
    else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }

    return message;
};

var setUserInfo = function(user) {
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    roleId: user.roleId
  };
};


exports.login = function(req, res, next) {
  var userInfo = setUserInfo(req.user);
  res.status(200).json({
    token: 'JWT ' + sts.generateToken(userInfo),
    user: userInfo
  });
};

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Login Form',
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.renderRegister = function(req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/');
    }
};

var createMoltinCompany = function(company, callback) {
  debug('start');
  msc.createCompany(company, function(comp) {
    if (comp instanceof Error) {
      console.error(comp);
      return callback(comp)
    }
    debug('leaving')
    return callback (comp);
  });
};

var createMoltinDefaultCategory= function(company, callback) {
  debug('start');
  msc.createDefaultCategory(company, function(category) {
    if (category instanceof Error) {
      console.error(category)
      return callback(category)
    }
    debug('leaving')
    return callback (category)
  });
};

var createCompany = function(companyName, email, user, next, callback) {
  var company = new Company();
  company.name = companyName;
  company.email = email;
  company.user = user;
  createMoltinCompany(company, function(moltinCompany) {
    if (moltinCompany instanceof Error) {
      console.error('moltin company create failed');
      console.error(moltinCompany +' : '+ getErrorMessage(moltinCompany));
      return callback (moltinCompany);
    }
    debug('moltin company successfully created : '+ moltinCompany.id)
    company.orderSysId = moltinCompany.id;
    user.roleId = company.id;
    createMoltinDefaultCategory(moltinCompany, function(moltinCat) {
      if (moltinCat instanceof Error) {
        console.error('moltin category create failed');
        console.error(moltinCat +' : '+ getErrorMessage(moltinCat));
        return callback (moltinCat);
      }
      debug('moltin category successfully created : '+ moltinCat.id)
      company.defaultCategory = moltinCat.id;
      company.baseSlug = moltinCat.slug;
      company.save(function(err, company) {
        if (err) {
          console.error('createCompany: error during company save');
          console.error(err);
          return callback(err)
        };
        return callback(user)
      })
    })
  });
};

var createCustomer = function(user) {
  var customer = new Customer();
  customer.name = user.name;
  customer.user = user;
  customer.save(function(err) {
    if (err) {
      return (err);
    }
  });
};

exports.register = function(req, res, next) {
    if (!req.user) {
      const email = req.body.email;
      const name = req.body.name;
      const companyName = req.body.companyName;
      const username = req.body.username;
      const password = req.body.password;
      const role = req.body.role;

      if (!email) {return res.status(422).send({ error: 'Please enter an email address.'});}
      if (!name) {return res.status(422).send({ error: 'Please enter your name.'});}
      if (!companyName) {return res.status(422).send({ error: 'Please enter a company name.'});}
      if (!username) {return res.status(422).send({ error: 'Please enter a user name.'});}
      if (!password) {return res.status(422).send({ error: 'Please enter a password.'});}
      if (!role) {return res.status(422).send({ error: 'Please specify member or owner.'});}

      User.findOne({ username: username }, function(err, existingUser) {
          if (err) { return next(err); }
          if (existingUser) {
            return res.status(422).send({ error: 'That user name is already in use.'});
          }

          var user = new User(req.body);
          user.provider = 'local';
          var method = "register";
          if (role=='Owner') {
            var message = null;
            debug('register: creating Owner');
            debug(req.body);
            user.role = 'Owner';
            createCompany(companyName, email, user, next, function(user) {
              if (user instanceof Error) {
                console.error('register: error creating company');
                return res.status(500).send({ error: err});
              }
              user.save(function(err, user) {
                if (err) {
                  console.error('register: error during user save');
                  console.error(err);
                  var message = getErrorMessage(err);
                  return res.status(500).send({ error: message });
                };
                var userInfo = setUserInfo(user);
                return res.status(201).json({
                  token: 'JWT ' + sts.generateToken(userInfo),
                  user: userInfo
                });
              });
            });
          }
          else if (role == 'Customer') {
            var message = null;
            debug(req.body);
            user.role = "Customer";
            var customer = createCustomer(user, next);
            user.roleId = customer.id;
          }
        });
      }
      else {
          return res.status(422).send({ error: 'A user is already logged in.'});
      }
};

exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    debug(req.user)
    const user = req.user;
    User.findById(user._id, function(err, foundUser) {
      if (err) {
        debug(err)
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }
      if (foundUser.role == role) {
        debug('found')
        return next();
      }
      debug('401 Unauthorized')
      res.status(401).json({ error: 'You are not authorized to view this content.' });
      return next('Unauthorized');
    })
  }
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};

exports.saveOAuthUserProfile = function(req, profile, done) {
    User.findOne({
            provider: profile.provider,
            providerId: profile.providerId
        },
        function(err, user) {
            if (err) {
            return done(err);
            }
            else {
                if (!user) {
                    var possibleUsername = profile.username || ((profile.email) ? profile.email.split('@')[0] : '');
                    User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
                        profile.username = availableUsername;
                        user = new User(profile);

                        user.save(function(err) {
                            if (err) {
                                var message = _this.getErrorMessage(err);
                                req.flash('error', message);
                                return res.redirect('/signup');
                            }

                            return done(err, user);
                        });
                    });
                }
                else {
                    return done(err, user);
                }
            }
        }
    );
  };
