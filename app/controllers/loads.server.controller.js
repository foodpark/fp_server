
var Loads = require('../models/loads.server.model');

exports.fetchLoads = function* () {
  try {
    var retLoads = [];
    var loads = yield Loads.getAllLoads();
    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var pallets = yield Loads.getPallets(element.id);
      var boxes = yield Loads.getBoxes(element.id);
      var items = yield Loads.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        pallets: pallets,
        boxes: boxes,
        items: items
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }
}

exports.fetchAvailablePodLoads = function*() {
  var churchId = this.params.churchId;
  try {
    var retLoads = [];
    const loadsQuerey = yield Loads.getAvailableLoadsForPod(churchId);
    var loads = loadsQuerey['rows'];

    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var pallets = yield Loads.getPallets(element.id);
      var boxes = yield Loads.getBoxes(element.id);
      var items = yield Loads.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        pallets: pallets,
        boxes: boxes,
        items: items
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }
}

exports.fetchRegionalHubLoads = function*() {
  var regionalHubId = this.params.regionalHubId;
  try {
    var retLoads = [];
    const loadsQuerey = yield Loads.getAllLoadsForRegionalHub(regionalHubId);
    var loads = loadsQuerey['rows'];

    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var pallets = yield Loads.getPallets(element.id);
      var boxes = yield Loads.getBoxes(element.id);
      var items = yield Loads.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        pallets: pallets,
        boxes: boxes,
        items: items
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }
}

exports.fetchFoodParkLoads = function*() {
  var mainHubId = this.params.mainHubId;
  try {
    var retLoads = [];
    const loadsQuerey = yield Loads.getAllLoadsForMainHub(mainHubId);
    var loads = loadsQuerey['rows'];

    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var pallets = yield Loads.getPallets(element.id);
      var boxes = yield Loads.getBoxes(element.id);
      var items = yield Loads.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        pallets: pallets,
        boxes: boxes,
        items: items
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }
}

exports.fetchPodLoads = function* () {
  var churchId = this.params.churchId;

  try {
    var retLoads = [];
    var loads = yield Loads.getAllLoadsForPod(churchId);
    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var pallets = yield Loads.getPallets(element.id);
      var boxes = yield Loads.getBoxes(element.id);
      var items = yield Loads.getItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        pallets: pallets,
        boxes: boxes,
        items: items
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }
}
