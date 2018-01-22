/**
 * @author Sávio Muniz
 */

var knex = require('../../config/knex');
var debug = require('debug')('packages.model');

var ParseUtils = require('../utils/parseutils');

const PACKAGES_TABLE = "packages";
const PACKAGE_GIVEN_TABLE = "package_given";

exports.createPackage = function (itemPackage) {
  return knex(PACKAGES_TABLE).insert(itemPackage).returning('*');
};

exports.updatePackage = function (data, id) {
  return knex(PACKAGES_TABLE).update(data).where({'id' : id});
};

exports.getPackage = function (id) {
  return knex(PACKAGES_TABLE).select().where({'id': id}).first();
};

exports.getCompanyPackages = function (companyId) {
  return knex(PACKAGES_TABLE).select().where({'company' : companyId, 'available' : true}).returning('*');
};

exports.getGivenPackage = function (user, itemPackage) {
  return knex(PACKAGE_GIVEN_TABLE).select().where({'gifted_user' : user, 'package' : itemPackage}).first();
};

exports.getActivePackageById = function (itemPackage) {
  return knex(PACKAGE_GIVEN_TABLE).select().whereRaw(`package = ${itemPackage} and quantity > 0`).first();
};

exports.getQRCodeGivenPackage = function (qrcode) {
  return knex(PACKAGE_GIVEN_TABLE).select().where({'qr_code' :  qrcode}).first();
};

exports.createGivenPackage = function (giftedUser, itemPackage, quantity, qrcode) {
  if (!quantity)
    quantity = 1;

  var newPackage = { gifted_user : giftedUser, package : itemPackage, quantity : quantity, qr_code : qrcode};
  return knex(PACKAGE_GIVEN_TABLE).insert(newPackage).returning('*');
};

exports.updateGivenPackage = function (giftedUser, itemPackage, quantity) {
  return knex(PACKAGE_GIVEN_TABLE).update({quantity: quantity}).where({'gifted_user' : giftedUser, 'package' : itemPackage});
};

exports.getUserGiftedPackages = function (giftedUser) {
  return knex(PACKAGE_GIVEN_TABLE).select().whereRaw(`gifted_user = ${giftedUser} and quantity > 0`);
};



