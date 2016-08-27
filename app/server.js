var Koa = require('koa');
var Body = require('koa-better-body');
var Mount = require('koa-mount');
var Helmet = require('koa-helmet');
var Session = require('koa-session');
var Views = require('koa-views');
var Flash = require('koa-flash');
var Resteasy = require('koa-resteasy')(require('../config/knex'));

var Passport = require('../config/passport');
var passport = Passport();

var config = require('../config/config');
var dbConfig = require('../config/knex');

var RestOptions = require('./rest_options');


var app = Koa();

app.use(require('koa-error')());
app.keys = [config.secret];

app.use(Helmet());
app.use(Body());
app.use(Session(app));
app.use(Flash());
app.use(Views(__dirname + '/views', { extension: 'ejs' }));

app.use(passport.initialize());
app.use(passport.session());

app.use(Mount('/api', Resteasy(RestOptions)));

require('./routes')(app);


app.listen(config.port);
module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
