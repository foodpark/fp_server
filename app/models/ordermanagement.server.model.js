var knex = require('../../config/knex');
var debug = require('debug')('ordermanagement.model');

exports.getRegionalHubsForFoodPark = function(foodparkId) {
  return  knex('regionalhubs').select('*').where('food_park_id', foodparkId);
}

exports.getPodsForRegionalHub = function(regionalHubId) {
  return  knex('churches').select('*').where('regional_hub_id', regionalHubId);
}
