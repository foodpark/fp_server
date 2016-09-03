module.exports = function(app) {
  var auth = require('./routes/authentication.server.routes')();
  var store = require('./routes/storefront.server.routes')();

  app.use(auth.routes());
  app.use(auth.allowedMethods());
//  app.use(store.routes());
//  app.use(store.allowedMethods());
};
