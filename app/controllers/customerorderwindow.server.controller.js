var CustomerOrderWindow = require ('../models/customerorderwindow.server.model');

exports.getForUnit = function*(next) {
  var unitId = this.query.unitId;
  if (!unitId) {
    this.throw('Unit ID is required', 404);
  }

  console.log('CustomerOrderWindow: Validating unit ID ' + unitId);
  var validatedUnitId = (yield CustomerOrderWindow.validateUnitId(unitId))[0];
  if (!validatedUnitId) {
    this.throw('Unit ID not found', 404);
  }

  console.log('Getting customer order window for unit ' + unitId);
  var custOrderWindow = (yield CustomerOrderWindow.getForUnit(unitId))[0];

  this.body = custOrderWindow;
  return;
}

exports.methodNotAllowed = function*(next) {
  this.throw('To update a customer order window, apply PATCH to companies/{companyId}/units/{unitId}', 405);
}
