/**
 * @author Sávio Muniz
 */

var ParseUtils = require('../parseutils');
var Commissions = require('../../models/commission.server.model');

exports.generateDetailedStats = generateDetailedStats;

function * generateDetailedStats (orderInput) {
  return yield getRawDetailedStats(orderInput);
}

exports.generateSumStats = generateSumStats;

function * generateSumStats(orderInput) {
  return yield formatSumStats(orderInput);
}

function * formatSumStats(orderInput) {
  var detailedStats = yield getRawDetailedStats(orderInput);

  var commissionTotal = 0;

  detailedStats.forEach(function (order) {
    commissionTotal += Number(order.commission);
  });

  return {total_commission : commissionTotal.toFixed(2)};
}

function * getRawDetailedStats(orderInput) {
  var rawStats = [];

  var commissions = yield getCommissions();

  orderInput.forEach(function (order) {
    var orderOutput = {};
    orderOutput.unit_id = order.unit_id;
    orderOutput.company_id = order.company_id;
    orderOutput.amount = order.amount;
    orderOutput.date = order.created_at;
    orderOutput.customer = order.customer_id;
    orderOutput.order_details = order.order_detail;
    orderOutput.type = getType(order);
    orderOutput.commission = (ParseUtils.parseBalance(order.amount) * commissions[order.commission_type]).toFixed(2);

    rawStats.push(orderOutput);
  });

  return rawStats;
}

function * getCommissions() {
  var mappedCommissions = {};
  var commissions = yield Commissions.getAllCommissions();
  commissions.forEach(function (commission) {
    mappedCommissions[commission.name] = commission.value
  });
  return mappedCommissions;
}

function getType(order) {
  if (order.context === 'cod')
    return "Cash on Delivery";
  else if (order.context === 'hotel')
    return "Room Service";
  else if (order.context === null && order.for_delivery)
    return "Delivery";
  else if (order.context === null && !order.for_delivery)
    return "Pick up";
}
