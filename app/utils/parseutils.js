/**
 * @author Sávio Muniz
 */

exports.parseBalance = function (currencyString) {
  const REGEX = /[^0-9.]/g;
  return Number(currencyString.replace(REGEX, ''));
};

exports.getPercentage = function(part, total) {
  return (part / total) * 100;
};
