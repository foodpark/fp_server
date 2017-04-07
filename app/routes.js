var Mount = require('koa-mount');
var config = require('../config/config');

module.exports = function(app) {
  require('./routes/index.server.routes')(app);
  require('./routes/authentication.server.routes')(app);
  require('./routes/favorites.server.routes')(app);
  require('./routes/storefront.server.routes')(app);
  require('./routes/webhook.server.routes')(app);
  require('./routes/payment.server.routes')(app);
  require('./routes/order.server.routes')(app);
  require('./routes/specials.server.routes')(app);


  var apiversion = '/api/'+ config.apiVersion + '/rel';
  app.use(Mount(apiversion,require('./routes/api')));
};
