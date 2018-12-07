var knex = require('../../config/knex');
var debug = require('debug')('loads.model');


exports.getAllLoads = function(id) {
  return knex('loads');
  // var retLoads = [];
  // var loads = knex('loads');
  // for (let index = 0; index < loads.length; index++) {
  //   var element = loads[index];
  //   var loadItems = getAllLoadItems(element.id);
  //   let tempLoad = {
  //     id: element['id'],
  //     name: element['name'],
  //     created_at: element['created_at'],
  //     updated_at: element['updated_at'],
  //     load_items: loadItems
  //   }
  //   retLoads.push(tempLoad);
  // }

  // return retLoads;
}

exports.getAllLoadItems = function(loadId) {
  return knex('load_items').select().where('load_id', loadId);
}
