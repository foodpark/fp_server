var reportModel = require('../models/reporting.server.model');

exports.getFoodParkReport = function* () {
  
  var report = new Object();

  var foodParkId = this.params.foodParkId;
  var start = this.query.start;
  var end = this.query.end;
  
  if (!foodParkId || isNaN(foodParkId)) {
    this.status = 400;
    return
  }
  
  try {
    var foodPark = yield reportModel.getMainHub(foodParkId)
    report['mainhub'] = foodPark;
    
    var masterLoadCount = (yield reportModel.getMasterLoadsCountForMainHub(foodParkId, start, end)).rows[0]
    report['master_loads'] = masterLoadCount['count'];

    var regionalHubs = yield reportModel.getRegionalHubsForFoodPark(foodParkId, start, end);
    for (item in regionalHubs) {
      var regionalhub = regionalHubs[item];
      var pods = yield reportModel.getPodsForRegionalHub(regionalhub['id'], start, end);
      regionalhub['pods'] = pods;
      regionalhub['pods_count'] = pods.length;
    }

    report['regionalhubs'] = regionalHubs;
      
    this.body = report;
  } catch (err) {
    console.error('error getting foodpark checkins')
    throw(err)
  }
}
