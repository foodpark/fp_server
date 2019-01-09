var podmanagerModel = require('../models/podmanager.server.model');

exports.getPodManagersInMainHub = function*() {
  var ordermanagement = new Object();

  var foodParkId = this.params.foodParkId;

  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return;
  }

  try {
    var pods = yield podmanagerModel.getPodManagersInMainHub(foodParkId);
    this.body = pods['rows'];
  } catch (err) {
    console.error('error getting foodpark checkins');
    throw err;
  }
};

exports.getPodOrderManagementDetails = function*() {
  var ordermanagement = new Object();

  var churchId = this.params.churchId;

  if (!churchId || isNaN(churchId)) {
    this.status = 400;
    return;
  }

  try {
    var orders = yield loadsModel.getAllLoadsForPod(churchId);

    var retLoads = [];
    for (orderitem in orders) {
      var element = orders[orderitem];
      var pallets = yield loadsModel.getPallets(element.id);
      var boxes = yield loadsModel.getBoxes(element.id);
      var items = yield loadsModel.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        driver_id: element['driver_id'],
        driver_name: element['driver_name'],
        status: element['status'],
        pallets: pallets,
        boxes: boxes,
        items: items
      };
      retLoads.push(tempLoad);
    }
    ordermanagement['orders'] = retLoads;

    this.body = ordermanagement;
  } catch (err) {
    console.error('error getting foodpark checkins');
    throw err;
  }
};
