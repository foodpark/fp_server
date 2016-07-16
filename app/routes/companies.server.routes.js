var companies = require('../../app/controllers/companies.server.controller');

module.exports=function(app) {
	app.route('/companies').post(companies.create).get(companies.list);
	app.route('/companies/:companyId').get(companies.read).put(companies.update);
	app.param('companyId',companies.companyById);
};
