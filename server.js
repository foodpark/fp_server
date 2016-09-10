var Koa = require('koa');
var Body = require('koa-better-body');
var Helmet = require('koa-helmet');
var Session = require('koa-session');
var Views = require('koa-views');
var Flash = require('koa-flash');

var Passport = require('./config/passport');
var passport = Passport();

var config = require('./config/config');
var dbConfig = require('./config/knex');

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

require('./app/routes')(app);

app.listen(config.port);
module.exports = app;
console.log(process.env.NODE_ENV + ' server running at http://localhost:' + config.port);
