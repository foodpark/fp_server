var Koa = require('koa');
var Body = require('koa-better-body');
var error = require('koa-json-error');
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
var admin = require("firebase-admin");
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
router.all('/*', cors(
  {
    origin: '*',
    method: 'GET,PUT,POST,DELETE,OPTIONS',
    headers: 'Content-type,Accept,X-Access-Token,X-Key,Authorization'
  }
));
/* router.all('/*', function *(next) {
  console.log("setting CORS headers")
  console.log(this.response.headers)
  // CORS headers
  console.log("set allowed origin to *")
  this.response.header("Access-Control-Allow-Origin", "*");
  console.log("set allowed methods to GET,PUT,POST,DELETE,OPTIONS")
  this.response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Custom headers for CORS
  console.log("set allowed headers to Content-type,Accept,X-Access-Token,X-Key")
  this.response.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
  console.log(this.response);
  if (this.request.method == 'OPTIONS') {
    console.log("Got preflight request")
    this.response.status=200;
    return;
  } else {
    console.log("No preflight")
    next();
  }
}); */
app.use(router.routes());
app.use(router.allowedMethods());

require('./app/routes')(app);

function formatError(err) {
    return {
        success: false,
        message: err.message,
        status: err.status
    }
}

var server = app.listen(config.port);
module.exports = app;
module.exports = server; // support unit test


var serviceAccount = require("./config/SFEZ-10ff25a209ed.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sfez-17981.firebaseio.com/"
});

console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
