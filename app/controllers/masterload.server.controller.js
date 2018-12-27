var MasterLoads = require("../models/masterload.server.model");

exports.createMasterLoad = function*(next) {
  var load = this.body;

  var masterload = yield MasterLoads.getMasterLoad(load.name, load.main_hub_id);
  if (masterload.length != 0) {
    this.status = 422;
    this.body = {
      error: "Master load name already exists, please provide different name"
    };
    return;
  }

  try {
    var response = yield MasterLoads.createMasterLoad(this.body);
    this.status = 201;
    this.body = { message: "Masterload created" };
  } catch (err) {
    logger.error("Error crerating master load");
    debug("Error creating master load");
    this.status = 500;
    this.body = { error: "Error in  creating  mater load" };
    throw err;
  }
};

exports.deleteMasterLoad = function*() {
  var masterLoadId = this.params.master_load_id;

  yield MasterLoads.deleteMasterLoad(masterLoadId);

  this.status = 202;
  this.body = {
    success: "Deleted masterload " + masterLoadId
  };
};

exports.fetchLoads = function*() {
  try {
    var retMasterLoads = [];

    var masterloads = yield MasterLoads.getAllMasterLoads();

    for (let index = 0; index < masterloads.length; index++) {
      var element = masterloads[index];
      let donations = yield MasterLoads.getDonations(element.id);

      let tempMasterLoad = {
        id: element["id"],
        name: element["name"],
        excelfile: element["excelfile"],
        created_at: element["created_at"],
        updated_at: element["updated_at"],
        main_hub_id: element["main_hub_id"],
        pod_loads: donations
      };

      retMasterLoads.push(tempMasterLoad);
    }

    this.body = retMasterLoads;
  } catch (err) {
    console.error("error getting loads");
    throw err;
  }

  return;
};
