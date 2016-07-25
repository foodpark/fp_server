var companies = require('../../app/controllers/companies.server.controller');

module.exports=function(app) {
	app.route('/api/companies').post(companies.create).get(companies.list);
	app.route('/api/companies/:companyId').get(companies.read).put(companies.update);
	app.param('companyId',companies.companyById);
	app.route('/api/companies/:companyId/tags').post(companies.addTag);
};
