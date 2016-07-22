var User = require('mongoose').model('User'),
    Company = require('mongoose').model('Company'),
    Customer = require('mongoose').model('Customer'),
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

exports.renderLogin = function(req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Log-in Form',
            messages: req.flash('error') || req.flash('info')
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.renderRegisterCompany = function(req, res, next) {
    if (!req.user) {
        res.render('register-company', {
            title: 'Register Company',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/companies');
    }
};

exports.renderRegisterCustomer = function(req, res, next) {
    if (!req.user) {
        res.render('register-customer', {
            title: 'Register Customer',
            messages: req.flash('error')
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.registerCompany = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        // Crete SFEZ company
        var company = new Company();
        //todo: Create Moltin company

        console.log(req.body);
        company.name = req.body.companyname;
        company.user = user;
        var message = null;
        user.type = "company";
        user.typeId = company.id;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register-company');
            };
            company.save(function (err) {
                if (err) {
                  console.log(err);
                  User.remove(user, function(err) {
                    if (err) console.log(err);
                  });
                  return next(err);
                }
            });
            req.login(user, function(err) {
                if (err) {return next(err);}
                return res.redirect('/');
            });
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.registerCustomer = function(req, res, next) {
    if (!req.user) {
        var user = new User(req.body);
        // Crete SFEZ consumer
        var customer = new Customer();

        console.log(req.body);
        customer.name = user.name;
        customer.user = user;
        var message = null;
        user.type = "customer";
        user.typeId = customer.id;
        user.provider = 'local';
        user.save(function(err) {
            if (err) {
                var message = getErrorMessage(err);
                req.flash('error', message);
                return res.redirect('/register-customer');
            };
            customer.save(function (err) {
                if (err) {
                  console.log(err);
                  User.remove(user, function(err) {
                    if (err) console.log(err);
                  });
                  return next(err);
                }
            });
            req.login(user, function(err) {
                if (err) {return next(err);}
                return res.redirect('/');
            });
        });
    }
    else {
        return res.redirect('/');
    }
};

exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


exports.list = function(req, res, next) {
    User.find({}, function(err, users) {
        if (err) {
            return next(err);
        }
        else {
            res.json(users);
        }
    });
};
exports.read = function(req, res) {
    res.json(req.user);
};

exports.userByID = function(req, res, next, id) {
    User.findOne({
            _id: id
        },
        function(err, user) {
            if (err) {
                return next(err);
            }
            else {
                req.user = user;
                next();
            }
        }
    );
};
exports.update = function(req, res, next) {
    User.findByIdAndUpdate(req.user.id, req.body, function(err, user) {
        if (err) {
            return next(err);
        }
        else {
            res.json(user);
        }
    });
};
exports.delete = function(req, res, next) {
    req.user.remove(function(err) {
        if (err) {
            return next(err);
        }
        else {
            res.json(req.user);
        }
    })
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
