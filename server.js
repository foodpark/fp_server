process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config'),
    express = require('./config/express'),
    db_config = require('./config/knex'),
    passport = require('./config/passport'),
    moltin = require('moltin')({
      publicId: config.clientId,
      secretKey: config.client_secret
    });


var app = express(),
    passport = passport(),
    pg = require('knex')(db_config);

moltin.Authenticate( function() {
  app.listen(config.port);
  module.exports=app;
  console.log(process.env.NODE_ENV+ " server running at http://localhost:"+ config.port);
});
