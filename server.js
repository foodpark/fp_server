var Koa = require('koa');
var Body = require('koa-better-body');
var Helmet = require('koa-helmet');
var Session = require('koa-session');
var Views = require('koa-views');
var Flash = require('koa-flash');
var Router = require('koa-router');
var serve = require('koa-static-folder');

var Passport = require('./config/passport');
var passport = Passport();

var config = require('./config/config');
var dbConfig = require('./config/knex');
var firebase = require('firebase');
var cors = require('kcors');

var app = Koa();

app.use(require('koa-error')());
app.keys = [config.secret];

app.use(Helmet());
app.use(Body());
app.use(Session(app));
app.use(Flash());
app.use(Views(__dirname + '/app/views', { extension: 'ejs' }));

app.use(passport.initialize());
app.use(passport.session());

//This is a temporary home for vendor UI. Uses koa-static-folder and koa-send to send assets
app.use(serve('./public/vendors'));

// Enable Cross-Origin Resource Sharing
app.use(cors());
var router = new Router();
router.all('/*', cors());
/* router.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
}); */
app.use(router.routes())
app.use(router.allowedMethods())

require('./app/routes')(app);

var server = app.listen(config.port);
module.exports = app;
module.exports = server; // support unit test

firebase.initializeApp({
  serviceAccount: "./config/SFEZ-10ff25a209ed.json",
  databaseURL: "https://sfez-17981.firebaseio.com/"
});

console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
