var reportModel = require("../models/reporting.server.model");
var foodparkModel = require("../models/foodpark.server.model");

exports.getTerritoryReport = function*() {
  var graphReport = new Array();
  var territoryId = this.params.territoryId;
  var start = this.query.start;
  var end = this.query.end;

  if (!territoryId || isNaN(territoryId)) {
    this.status = 400;
    return;
  }

  try {
    
    var mainHubs = yield foodparkModel.getMainHubsInTerritory(territoryId);
    for (item in mainHubs) {
      var report = new Object();
      const mainHub = mainHubs[item];
      const foodParkId =  mainHub['id'];

      var foodPark = yield reportModel.getMainHub(foodParkId);
      report["mainhub"] = foodPark[0];
  
      var masterLoadCount = (yield reportModel.getMasterLoadsCountForMainHub(
        foodParkId,
        start,
        end
      )).rows[0];
      report["master_loads"] = masterLoadCount["count"];
  
      var regionalHubs = yield reportModel.getRegionalHubsForFoodPark(
        foodParkId,
        start,
        end
      );
      for (item in regionalHubs) {
        var regionalhub = regionalHubs[item];
        var pods = yield reportModel.getPodsForRegionalHub(
          regionalhub["id"],
          start,
          end
        );
  
        var regionalHubCount = 0;
        for (podItem in pods) {
          var pod = pods[podItem];
          var podLoadCount = (yield reportModel.getMasterLoadsCountForPod(
            pod["id"],
            start,
            end
          )).rows[0];
          pod["load_count"] = podLoadCount["count"];
          regionalHubCount += parseInt(podLoadCount["count"], 10);
        }
        regionalhub["load_count"] = regionalHubCount;
        regionalhub["pods"] = pods;
        regionalhub["pods_count"] = pods.length;
      }
  
      report["regionalhubs"] = regionalHubs;

      graphReport.push(report);
    }
    this.body = graphReport;
  } catch (err) {
    console.error("error getting admin graphs reporting");
    throw err;
  }
};

exports.getFoodParkReport = function*() {
  var report = new Object();

  var foodParkId = this.params.foodParkId;
  var start = this.query.start;
  var end = this.query.end;

  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return;
  }

  try {
    var foodPark = yield reportModel.getMainHub(foodParkId);
    report["mainhub"] = foodPark[0];

    var masterLoadCount = (yield reportModel.getMasterLoadsCountForMainHub(
      foodParkId,
      start,
      end
    )).rows[0];
    report["master_loads"] = masterLoadCount["count"];

    var regionalHubs = yield reportModel.getRegionalHubsForFoodPark(
      foodParkId,
      start,
      end
    );
    for (item in regionalHubs) {
      var regionalhub = regionalHubs[item];
      var pods = yield reportModel.getPodsForRegionalHub(
        regionalhub["id"],
        start,
        end
      );

      var regionalHubCount = 0;
      for (podItem in pods) {
        var pod = pods[podItem];
        var podLoadCount = (yield reportModel.getMasterLoadsCountForPod(
          pod["id"],
          start,
          end
        )).rows[0];
        pod["load_count"] = podLoadCount["count"];
        regionalHubCount += parseInt(podLoadCount["count"], 10);
      }
      regionalhub["load_count"] = regionalHubCount;
      regionalhub["pods"] = pods;
      regionalhub["pods_count"] = pods.length;
    }

    report["regionalhubs"] = regionalHubs;

    this.body = report;
  } catch (err) {
    console.error("error getting foodpark report");
    throw err;
  }
};
