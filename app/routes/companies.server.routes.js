var companies = require('../../app/controllers/companies.server.controller'),
auth = require('../../app/controllers/authentication.server.controller');

module.exports=function(app) {
	app.route('/api/companies').post(companies.create).get(companies.list);
	app.route('/api/companies/:companyId').get(companies.read);
	app.route('/api/companies/:companyId').put(auth.roleAuthorization("Owner"), companies.update);
	app.route('/api/companies/:companyId').delete(auth.roleAuthorization("Owner"), companies.delete);
	app.param('companyId',companies.companyById);
	app.route('/api/companies/:companyId/tags').post(auth.roleAuthorization("Owner"), companies.addTag).get(companies.listTags);
	app.route('/api/companies/:companyId/tags').delete(auth.roleAuthorization("Owner"), companies.deleteTag);
};
