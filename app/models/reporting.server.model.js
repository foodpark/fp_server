var knex = require('../../config/knex');
var debug = require('debug')('reporting.model');

exports.getMainHub = function(id) {
  return knex('food_parks').select().where('type', 'MAIN').andWhere('id', id);
}

exports.getRegionalHubsForFoodPark = function(foodparkId, start, end) {
  if (!start) {
    start = 0;
  }

  if (!end) {
    end = (new Date()).getTime()/1000;
  }

  let customQuery = `food_park_id=${foodparkId} and created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  return  knex('regionalhubs').select('*').whereRaw(customQuery);
}

exports.getPodsForRegionalHub = function(regionalHubId, start, end) {
  if (!start) {
    start = 0;
  }

  if (!end) {
    end = (new Date()).getTime()/1000;
  }

  let customQuery = `id=${regionalHubId} and created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  return  knex('churches').select('*').whereRaw(customQuery);
}

exports.getMasterLoadsCountForMainHub = function(mainHubId, start, end) {
  if (!start) {
    start = 0;
  }

  if (!end) {
    end = (new Date()).getTime()/1000;
  }

  let customQuery = `select count(*) from master_loads where main_hub_id=${mainHubId} and created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  return knex.raw(customQuery);
}
