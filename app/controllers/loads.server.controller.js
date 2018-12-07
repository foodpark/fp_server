
var Loads = require('../models/loads.server.model');

exports.fetchLoads = function* () {
  
  try {
    //var loads = yield Loads.getAllLoads();
    
    var retLoads = [];
    var loads = yield Loads.getAllLoads();
    for (let index = 0; index < loads.length; index++) {
      var element = loads[index];
      var loadItems = yield Loads.getAllLoadItems(element.id);
      let tempLoad = {
        id: element['id'],
        name: element['name'],
        created_at: element['created_at'],
        updated_at: element['updated_at'],
        load_items: loadItems
      }
      retLoads.push(tempLoad);
    }
    this.body = retLoads;
  } catch (err) {
    console.error('error getting loads')
    throw(err)
  }

  return;  
}
