module.exports = function(app) {
  var auth = require('./routes/authentication.server.routes')();

  app.use(auth.routes());
  app.use(auth.allowedMethods());
};
