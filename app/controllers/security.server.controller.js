var sts = require('./security.server.controller'),
    jwt = require('jsonwebtoken'),
    config = require('../../config/config'),
    passport = require('passport');

var moltinAccessToken='';

exports.generateToken = function(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // seconds
  });
};
