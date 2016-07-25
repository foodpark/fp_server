var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config')
    passport = require('passport');



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

var generateToken = function(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // seconds
  });
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
    token: 'JWT ' + generateToken(userInfo),
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


exports.register = function(req, res, next) {
    if (!req.user) {
      const email = req.body.email;
      const name = req.body.name;
      const username = req.body.username;
      const password = req.body.password;
      const role = req.body.role;

      if (!email) {
        return res.status(422).send({ error: 'Please enter an email addres.'});
      }
      if (!name) {
        return res.status(422).send({ error: 'Please enter your name.'});
      }
      if (!username) {
        return res.status(422).send({ error: 'Please enter a user name.'});
      }
      if (!password) {
        return res.status(422).send({ error: 'Please enter a password.'});
      }
      if (!role) {
        return res.status(422).send({ error: 'Please specify member or owner.'});
      }

      User.findOne({ username: username }, function(err, existingUser) {
          if (err) { return next(err); }
          if (existingUser) {
            return res.status(422).send({ error: 'That user name is already in use.'});
          }

          var user = new User(req.body);

          if (role=='Owner') {
            // Crete SFEZ company
            var company = new Company();
            //todo: Create Moltin company

            console.log(req.body);
            company.name = req.body.companyname;
            company.user = user;
            var message = null;
            user.role = 'Owner';
            user.roleId = company.id;
            company.save(function(err) {
              if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/api/register');
              }
            });
          }
          else if (role == 'Member') {
            var customer = new Customer();
            console.log(req.body);
            customer.name = user.name;
            customer.user = user;
            var message = null;
            user.role = "customer";
            user.roleId = customer.id;
            customer.save(function(err) {
              if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/api/register');
              }
            });
          }
          user.provider = 'local';
          user.save(function(err, user) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/api/register');
              };
              var userInfo = setUserInfo(user);

              res.status(201).json({
              token: 'JWT ' + generateToken(userInfo),
              user: userInfo
            });
          });
        });
      }
      else {
        return res.redirect('/');
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
