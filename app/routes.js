var Mount = require('koa-mount');
var config = require('../config/config');

module.exports = function(app) {
  require('./routes/index.server.routes')(app);
  require('./routes/authentication.server.routes')(app);
  require('./routes/storefront.server.routes')(app);
  require('./routes/reviews.server.routes')(app);


  var apiversion = '/api/'+ config.apiVersion + '/rel';
  app.use(Mount(apiversion,require('./routes/api')));
};
