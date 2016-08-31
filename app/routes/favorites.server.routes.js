var favorites = require('../../app/controllers/favorites.server.controller');

module.exports=function(app) {
	app.route('/api/favorites').post(favorites.create).get(favorites.list);
  app.route('/api/favorites/companies/:companyId').get(favorites.listFavoritesForCompany);
  app.route('/api/favorites/customers/:customerId').get(favorites.listFavoritesForCustomer);
  app.route('/api/favorites/units/:unitId').get(favorites.listFavoritesForUnit);
};
