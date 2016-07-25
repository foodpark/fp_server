var checkins = require('../../app/controllers/checkins.server.controller');

module.exports=function(app) {
	app.route('/api/checkins').post(checkins.create).get(checkins.list);
  app.route('/api/checkins/companies/:companyId').get(checkins.listCheckinsForCompany);
  app.route('/api/checkins/customers/:customerId').get(checkins.listCheckinsForCustomer);
  app.route('/api/checkins/sites/:siteId').get(checkins.listCheckinsForSite);
};
