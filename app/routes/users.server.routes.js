var users = require('../../app/controllers/users.server.controller');
var passport = require('passport');

module.exports = function(app) {
    app.route('/users').get(users.list);

    app.route('/users/:userId').get(users.read).put(users.update).delete(users.delete);

    app.param('userId', users.userByID);

    app.route('/register-company')
        .get(users.renderRegisterCompany)
        .post(users.registerCompany);

    app.route('/register-customer')
        .get(users.renderRegisterCustomer)
        .post(users.registerCustomer);

    app.route('/login')
        .get(users.renderLogin)
        .post(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }));


    app.get('/logout', users.logout);

    app.get('/oauth/facebook', passport.authenticate('facebook', {
      failureRedirect: '/login',
      scope:['email']
    }));

    app.get('/oauth/facebook/callback', passport.authenticate('facebook', {
      failureRedirect: '/login',
      successRedirect: '/',
      scope:['email']
    }));
};
