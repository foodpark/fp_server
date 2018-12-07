
var MasterLoads = require('../models/masterload.server.model');

exports.fetchLoads = function* () {
  
  try {
    var retMasterLoads = [];

    var masterloads = yield MasterLoads.getAllMasterLoads();

    for (let index = 0; index < masterloads.length; index++) {
      var element = masterloads[index];
      let donations = yield MasterLoads.getDonations(element.id);

      let tempMasterLoad = {
        id: element['id'],
        name: element['name'],
        excelfile: element['excelfile'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        main_hub_id: element['main_hub_id'],
        donataions: donations
      }

      retMasterLoads.push(tempMasterLoad);
    };

    this.body = retMasterLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }

  return;  
}
