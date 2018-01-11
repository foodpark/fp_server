/**
 * @author Sávio Muniz
 */

var OrderHistory = require('../models/orderhistory.server.model');
var ParseUtils = require('../utils/parseutils');
var FoodPark = require('../models/foodpark.server.model');

const PERSPECTIVE_QUERY_BUILDER = {
  vendor : function (start, end, id) {
    return `company_id=${id} and created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  },
  support : function (start, end) {
    return `created_at between to_timestamp(${start}) and to_timestamp(${end})`;
  },
  foodpark : function * (start, end, id) {
    console.log(yield getManagedFoodParkUnits(id));
    return `created_at between to_timestamp(${start}) and to_timestamp(${end}) and unit_id in ${(yield getManagedFoodParkUnits(id))}`;
  }
};

const CATEGORY_HANDLER = {
  sum : generateSumStats,
  percentage : generatePercentageStats
};

function getRawSumStats(orderInput) {
  var rawStats = {};
  orderInput.forEach(function (order) {
    var amount = ParseUtils.parseBalance(order.amount);

    if (rawStats[order.company_id]) {
      if (rawStats[order.company_id][order.unit_id]) {
        rawStats[order.company_id][order.unit_id].count += 1;
        rawStats[order.company_id][order.unit_id].amount += amount;
      }
      else {
        rawStats[order.company_id][order.unit_id] = {};
        rawStats[order.company_id][order.unit_id].count = 1;
        rawStats[order.company_id][order.unit_id].amount = amount;
      }
    }
    else {
      rawStats[order.company_id] = {};
      rawStats[order.company_id][order.unit_id] = {};
      rawStats[order.company_id][order.unit_id].count = 1;
      rawStats[order.company_id][order.unit_id].amount = amount;
    }
  });

  return rawStats
}

function generateSumStats(orderInput) {
  return formatSumStatsResponse(getRawSumStats(orderInput));
}

function generatePercentageStats(orderInput) {
  return formatPercentageStatsResponse(generateSumStats(orderInput));
}

function * getManagedFoodParkUnits(id) {
  var unitArray = [];
  var units = yield FoodPark.getFoodParkManagedUnits(id);

  units.forEach(function (unit) {
    unitArray.push(unit.unit_id);
  });

  return unitArray;
}

function formatPercentageStatsResponse(sumStats) {
  var countTotal = 0;
  var amountTotal = 0;

  sumStats.forEach(function (company) {
    countTotal += company.count;
    amountTotal += company.amount;
  });

  sumStats.forEach(function (company, companyIndex) {
    var companyCountSum = sumStats[companyIndex].count;
    var companyAmountSum = sumStats[companyIndex].amount;

    sumStats[companyIndex].count = getPercentage(companyCountSum,countTotal);
    sumStats[companyIndex].amount = getPercentage(companyAmountSum,amountTotal);

    company.units.forEach(function (unit, unitIndex) {
        sumStats[companyIndex].units[unitIndex].count = getPercentage(sumStats[companyIndex].units[unitIndex].count, companyCountSum);
        sumStats[companyIndex].units[unitIndex].amount = getPercentage(sumStats[companyIndex].units[unitIndex].amount, companyAmountSum);
    });
  });

  return sumStats;
}

function getPercentage(part, total) {
  return (part / total) * 100;
}

function formatSumStatsResponse(rawStats) {
  var statsResponse = [];
  Object.keys(rawStats).forEach(function (company_id) {
    var company = {company_id : company_id, count : 0, amount : 0, units : []};

    Object.keys(rawStats[company_id]).forEach(function(unit_id) {
      company.count += rawStats[company_id][unit_id].count;
      company.amount += rawStats[company_id][unit_id].amount;
      company.units.push({
          unit_id : unit_id,
          count : rawStats[company_id][unit_id].count,
          amount : rawStats[company_id][unit_id].amount
      });
    });

    statsResponse.push(company);
  });

  return statsResponse;
}

exports.getStats = function * (perspective, category, start, end, id) {
  var orderInput = yield getInputOrders(perspective, start, end, id);

  return CATEGORY_HANDLER[category](orderInput);
};

function * getInputOrders(perspective, start, end, id) {
  return OrderHistory.customQuery(PERSPECTIVE_QUERY_BUILDER[perspective](start, end, id));
}



