/**
 * @author Sávio Muniz
 */

var OrderHistory = require('../../models/orderhistory.server.model');
var FoodPark = require('../../models/foodpark.server.model');
var UnitStatsHelper = require('./unit-stats-builder');
var ItemStatsHelper = require('./item-stats-builder');
var CustomerStatsHelper = require('./customer-stats-builder');
var ParseUtils = require('../parseutils');


const PERSPECTIVE_QUERY_BUILDER = {
  vendor : function * (start, end, id) {
    return `company_id=${id} and created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  },
  support : function * (start, end) {
    return `created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  },
  foodpark : function * (start, end, id) {
    return `created_at between to_timestamp(${start}) and to_timestamp(${end}) and unit_id in (${(yield getManagedFoodParkUnits(id))})`;
  }
};

const CATEGORY_HANDLER = {
  unit : {
    sum : UnitStatsHelper.generateSumStats,
    percentage : UnitStatsHelper.generatePercentageStats
  },
  item: {
    sum : ItemStatsHelper.generateSumStats,
    percentage : ItemStatsHelper.generatePercentageStats
  },
  customer : {
    sum : CustomerStatsHelper.generateSumStats,
    percentage : CustomerStatsHelper.generatePercentageStats
  }, 
  total : {
    sum : generateTotalSumStats
  }
};

function * getManagedFoodParkUnits(id) {
  var unitArray = [];
  var units = yield FoodPark.getFoodParkManagedUnits(id);

  units.forEach(function (unit) {
    unitArray.push(unit.unit_id);
  });

  return unitArray;
}

exports.getStats = function * (perspective, category, operation, start, end, id) {
  if (!start)
    start = 0;

  if (!end)
    end = (new Date()).getTime()/1000;

  var orderInput = yield getInputOrders(perspective, start, end, id);

  return CATEGORY_HANDLER[category][operation](orderInput);
};

function * getInputOrders(perspective, start, end, id) {
  return OrderHistory.customQuery((yield PERSPECTIVE_QUERY_BUILDER[perspective](start, end, id)));
}

function generateTotalSumStats(orderInput) {
  var total = {
    amount : 0,
    count : orderInput.length
  };

  orderInput.forEach(function (order) {
    total.amount += ParseUtils.parseBalance(order.amount);
  });

  return total;
}


