/**
 * @author Sávio Muniz
 */

var ParseUtils = require('../parseutils');
var Commissions = require('../../models/commission.server.model');
var Companies = require('../../models/company.server.model');
var Customers = require('../../models/customer.server.model');
var Units = require('../../models/unit.server.model');

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

  var companyPromises = [];
  var customerPromises = [];
  var unitPromises = [];

  orderInput.forEach(function (order) {
    var orderOutput = {};
    companyPromises.push(Companies.getSingleCompany(order.company_id));
    customerPromises.push(Customers.getUser(order.customer_id));
    unitPromises.push(Units.getSingleUnit(order.unit_id));
    orderOutput.company_id = order.company_id;
    orderOutput.unit_id = order.unit_id;
    orderOutput.customer_id = order.customer_id;
    orderOutput.amount = ParseUtils.parseBalance(order.amount);
    orderOutput.date = order.created_at;
    orderOutput.order_details = order.order_detail;
    orderOutput.type = getType(order);
    orderOutput.commission = (ParseUtils.parseBalance(order.amount) * commissions[order.commission_type]).toFixed(2);

    rawStats.push(orderOutput);
  });

  var rawStatsCompanies = Promise.all(companyPromises).then(function (companies) {
    companies.forEach(function (company,index) {
      rawStats[index].company_name = company[0].name;
    });

    return rawStats;
  });

  rawStats = yield rawStatsCompanies;

  yield rawStats;

  var rawStatsCustomers = Promise.all(customerPromises).then(function (customers) {
    customers.forEach(function (customer,index) {
      rawStats[index].customer_name = customer.rows[0].name || customer.rows[0].first_name + " " + customer.rows[0].last_name[0] ;
    });

    return rawStats;
  });

  rawStats = yield rawStatsCustomers;

  yield rawStats;

  var rawStatsUnits = Promise.all(unitPromises).then(function (units) {
    units.forEach(function (unit,index) {
      rawStats[index].unit_name = unit[0].name;
    });

    return rawStats;
  });

  rawStats = yield rawStatsUnits;

  return yield rawStats;
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
