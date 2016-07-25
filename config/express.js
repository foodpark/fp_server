var config = require('./config'),
    express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session');

module.exports = function() {
	var app = express();
  app.use(express.static('./public'));

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.use(session({
    secret: config.secret,
		saveUninitialized: true,
		resave: true
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  require('../app/routes/authentication.server.routes.js')(app);
	require('../app/routes/checkins.server.routes.js')(app);
	require('../app/routes/companies.server.routes.js')(app);
	require('../app/routes/customers.server.routes.js')(app);
	require('../app/routes/favorites.server.routes.js')(app);
	require('../app/routes/index.server.routes.js')(app);
	require('../app/routes/loyalty.server.routes.js')(app);
	require('../app/routes/reviews.server.routes.js')(app);
	require('../app/routes/sites.server.routes.js')(app);
	require('../app/routes/users.server.routes.js')(app);

	return app;
}
