var users = require('../../app/controllers/users.server.controller'),
    passport = require('passport');

module.exports=function(app) {
	app.route('/users').post(users.create).get(users.list);
	//app.route('/users/:userId').get(users.read).put(users.update);
	//app.param('userId',users.userById);
  app.route('/register')
    .get(users.renderRegister)
    .post(users.register);
  app.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));
  app.get('/logout', users.logout);
};
