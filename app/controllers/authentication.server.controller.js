var sts = require('./security.server.controller'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    User = require ('../models/user.server.model'),
    Company = require ('../models/company.server.model'),
    debug = require('debug')('authentication.server.controller');

exports.CUSTOMER = 'CUSTOMER'
exports.OWNER    = 'OWNER'
exports.SITE_MGR = 'SITEMGR'
exports.ADMIN    = 'ADMIN'

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
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role
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
  console.log('create Moltin company: entry');
  msc.createCompany(company, function(comp) {
    if (comp instanceof Error) {
      console.error(comp);
      return callback(comp)
    }
    console.log('create Moltin company: leaving')
    return  callback(null, comp);
  });
};

var createMoltinDefaultCategory= function(company, callback) {
  msc.createDefaultCategory(company, function(category) {
    if (category instanceof Error) {
      console.error(category)
      return callback(category)
    }
    return callback(null, category)
  });
};

var createCompany = function(companyName, email, userId, callback) {
  console.log('create company: userId is ')
  console.log(userId)
  var company = {
    name : companyName,
    email : email,
    userId : userId
  }
  createMoltinCompany(company, function(err, moltinCompany) {
    if (err) {
      console.error('createCompany: error during Moltin company creation')
      console.error(err)
      return callback(err)
    }
    console.log('moltin company successfully created : '+ moltinCompany.id)
    company.orderSysId = moltinCompany.id;
    createMoltinDefaultCategory(moltinCompany, function(err, moltinCat) {
      if (err) {
        console.error('createCompany: error during Moltin default category creation')
        console.error(err)
        return callback(err)
      }
      console.log('moltin category successfully created : '+ moltinCat.id)
      Company.createCompany(companyName, email, userId, moltinCompany.id, moltinCat.id, moltinCat.slug,
        function(err,companyId) {
          if (err) {
            console.error('createCompany: error creating company')
            console.error(err)
            return callback(err)
          }
          return callback(null,companyId)
        })
      })
    })
}

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

      console.log('register: checking for duplicate user name')
      debug('register: checking for duplicate user name')
      User.isUserForUsername(username, function(err, existingUser) {
          if (err) {
            console.error('register: error during registration');
            return res.status(500).send({ error: err});
          }
          console.log(existingUser)
          if (existingUser) {
            return res.status(422).send({ error: 'That user name is already in use.'});
          }
          var user = {
            name : name,
            email : email,
            username : username,
            password : password,
            role : role
          }
          console.log(user)
          if (role== 'OWNER') {
            var message = null;
            console.log('register: creating User-Owner');
            var provider = 'local'
            var providerId = 'local'
            var providerData = 'local'
            User.createUser(name, email, username, password, role,
              provider, providerId, providerData, function (err,userId) {
                if (err) {
                  console.error('register: error creating company');
                  return res.status(500).send({ error: err});
                }
                console.log('register: creating company')
                createCompany(companyName, email, userId, function(err, companyId) {
                  if (err) {
                    console.error('register: error creating company');
                    return res.status(500).send({ error: err});
                  }
                  var userInfo = setUserInfo(user);
                  return res.status(201).json({
                    token: 'JWT ' + sts.generateToken(userInfo),
                    user: userInfo
                  })
                })
              })
            }
            else if (role == 'CUSTOMER') {
              console.log('register: creating User-Customer');
              var message = null;
              debug(req.body);
              user.role = "CUSTOMER";
              createCustomer(user, next);
            } else if (role == 'ADMIN') {
              console.log('register: creating User-Customer');
              var message = null;
              debug(req.body);
              user.role = "ADMIN";
              createCustomer(user, next);
            }
        })
      }
      else {
          return res.status(422).send({ error: 'A user is already logged in.'});
      }
};

exports.roleAuthorization = function(role) {
  return function(req, res, next) {
    debug(req.user)
    const user = req.user;
    User.getSingleUser(user._id, function(err, foundUser) {
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
