var Mount = require('koa-mount');

module.exports = function(app) {
  require('./routes/index.server.routes')(app);
  require('./routes/authentication.server.routes')(app);
  require('./routes/storefront.server.routes')(app);

  app.use(Mount('/api',require('./routes/api')));
};
