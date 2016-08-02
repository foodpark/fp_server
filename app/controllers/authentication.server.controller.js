var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    sts = require('./security.server.controller'),
    msc = require('./moltin.server.controller'),
    config = require('../../config/config'),
    passport = require('passport'),
    debug = require('debug')('authentication.server.controller'),
    moltin = require('moltin')({
      publicId: config.clientId,
      secretKey: config.client_secret
    });



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

var createMoltinCompany = function(company, next, callback) {
  debug('start');
  msc.createCompany(company, function(comp) {
    if (comp instanceof Error) {
      console.error(comp);
      return callback(comp)
    }
    debug('leaving')
    return callback (comp);
  });
/*  moltin.Authenticate( function() {
    moltin.Category.Create( {
      slug : 'name',
      status: 'email',
      title: 'title',
      description: 'descript',
      company:'1293770040725734215',
      menu_availability:'false'
    }, function(moltinCompany) {
      debug('createMoltinCompany: Created :'+ moltinCompany);
      company.orderSysId = moltinCompany._id;
      return next(company);
    }, function (err) {
      console.error('createMoltinCompany: Did not create moltin Company for '+ company);
      console.error('stack :'+ err.stack);
      return next (err);
    })
  })*/
};

var createCompany = function(companyName, email, user, next, callback) {
  var company = new Company();
  company.name = companyName;
  company.email = email;
  company.user = user;
  createMoltinCompany(company, next, function(company) {
    if (company instanceof Error) {
      console.error('moltin company create failed');
      console.error(company +' : '+ getErrorMessage(company));
      return callback (company);
    }
    debug('moltin company successfully created : '+ company.id)
    user.roleId = company.id;
    return callback(user)
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
      const username = req.body.username;
      const password = req.body.password;
      const role = req.body.role;

      if (!email) {return res.status(422).send({ error: 'Please enter an email address.'});}
      if (!name) {return res.status(422).send({ error: 'Please enter your name.'});}
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
            createCompany(name, email, user, next, function(user) {
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
    const user = req.user;

    User.findById(user._id, function(err, foundUser) {
      if (err) {
        res.status(422).json({ error: 'No user was found.' });
        return next(err);
      }
      if (foundUser.role == role) {
        return next();
      }
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
