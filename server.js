process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
    express = require('./config/express'),
    mongoose = require('./config/mongoose'),
    passport = require('./config/passport'),
    moltin = require('moltin')({
      publicId: config.clientId,
      secretKey: config.client_secret
    });

var db = mongoose(),
   app = express(),
   passport = passport();

	moltin.Authenticate( function() {
    app.listen(config.port);
    module.exports=app;
    console.log(process.env.NODE_ENV+ " server running at http://localhost:"+ config.port);
  });
