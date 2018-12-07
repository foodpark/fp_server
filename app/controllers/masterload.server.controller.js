
var MasterLoads = require('../models/masterload.server.model');

exports.fetchLoads = function* () {
  
  try {
    var loads = yield Loads.getAllLoads();
    this.body = loads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }

  return;  
}
