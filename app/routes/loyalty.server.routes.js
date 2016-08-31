var loyalties = require('../../app/controllers/loyalties.server.controller');

module.exports=function(app) {
	app.route('/api/loyalty').post(loyalties.create).get(loyalties.list);
  app.route('/api/loyalty/:loyaltyId').get(loyalties.read).put(loyalties.update);
	app.param('loyaltyId',loyalties.loyaltyById);
  app.route('/api/loyalty/companies/:companyId').get(loyalties.listLoyaltiesForCompany);
  app.route('/api/loyalty/customers/:customerId').get(loyalties.listLoyaltiesForCustomer);
  app.route('/api/loyalty/units/:unitId').get(loyalties.listLoyaltiesForUnit);
};
