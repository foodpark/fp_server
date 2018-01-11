/**
 * @author Sávio Muniz
 */

var StatsHelper = require('../utils/stats-helper');

exports.getVendorOrderCount = function * () {
    try {
      this.body = yield StatsHelper.getStats('vendor', 'sum', this.query.start, this.query.end, this.params.companyId);
    } catch (err) {
      throwDefaultError(err);
    }
};

exports.getSupportOrderCount = function * () {
  try {
    this.body = yield StatsHelper.getStats('support', 'sum', this.query.start, this.query.end);
  } catch (err) {
    throwDefaultError(err);
  }
};

exports.getVendorOrderPercentage = function * () {
  try {
    this.body = yield StatsHelper.getStats('vendor', 'percentage', this.query.start, this.query.end, this.params.companyId);
  } catch (err) {
    throwDefaultError(err);
  }
};

exports.getSupportOrderPercentage = function * () {
  try {
    this.body = yield StatsHelper.getStats('support', 'percentage', this.query.start, this.query.end);
  } catch (err) {
    throwDefaultError(err);
  }
};


function throwDefaultError(err) {
  console.error('error generating stats');
  throw(err);
}
