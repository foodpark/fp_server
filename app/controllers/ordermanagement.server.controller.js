var orderManagementModel = require("../models/ordermanagement.server.model");
var loadsModel = require("../models/loads.server.model");

exports.getMainHubOrderManagementDetails = function*() {
  var ordermanagement = new Object();

  var foodParkId = this.params.foodParkId;

  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return;
  }

  try {
    var regionalHubs = yield orderManagementModel.getRegionalHubsForFoodPark(foodParkId);
    for (item in regionalHubs) {
      var regionalhub = regionalHubs[item];
      var pods = yield orderManagementModel.getPodsForRegionalHub(regionalhub["id"]);

      var podObjects = [];
      for (poditem in pods) {
        var pod = pods[poditem];
        var orders = yield loadsModel.getAllLoadsForPod(pod['id']);

        var retLoads = [];
        for (orderitem in  orders) {
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
          }
          retLoads.push(tempLoad);
        }

        podObjects.push({'id': pod['id'], 'name': pod['name'], 'orders': retLoads});
      }

      regionalhub["pods"] = podObjects;
    }

    ordermanagement["regionalhubs"] = regionalHubs;
    this.body = ordermanagement;
  } catch (err) {
    console.error('error getting foodpark checkins')
    throw(err)
  }
};

exports.getPodOrderManagementDetails = function*() {

};
