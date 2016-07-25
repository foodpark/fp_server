var sites = require('../../app/controllers/sites.server.controller');

module.exports=function(app) {
	app.route('/api/sites').post(sites.create).get(sites.list);
  app.route('/api/sites/:siteId').get(sites.read).put(sites.update).delete(sites.delete);
	app.param('siteId',sites.siteById);
  app.route('/api/sites/companies/:companyId').get(sites.listSitesForCompany);
};
