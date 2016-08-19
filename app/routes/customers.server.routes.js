var customers = require('../../app/controllers/customers.server.controller'),
auth = require('../../app/controllers/authentication.server.controller');;

module.exports=function(app) {
	app.route('/api/customers').post(auth.roleAuthorization("Customer"), customers.create).get(customers.list);
	app.route('/api/customers/:customerId').get(customers.read);
	app.route('/api/customers/:customerId').put(auth.roleAuthorization("Customer"), customers.update);
	app.route('/api/customers/:customerId').delete(auth.roleAuthorization("Customer"), customers.delete);
	app.param('customerId',customers.customerById);
};
