var units = require('../../app/controllers/units.server.controller');

module.exports=function(app) {
	app.route('/api/units').post(units.create).get(units.list);
  app.route('/api/units/:unitId').get(units.read).put(units.update).delete(units.delete);
	app.param('unitId',units.unitById);
  app.route('/api/units/companies/:companyId').get(units.listUnitsForCompany);
};
