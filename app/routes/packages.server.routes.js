/**
 * @author Sávio Muniz
 */

var packages = require('../controllers/packages.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/' + config.apiVersion + '/rel/packages/';
  var apiCompanyPath = '/api/' + config.apiVersion + '/rel/companies/';
  var apiUserPackages = '/api/' + config.apiVersion + '/rel/users/:userId/packages/';
  var apiPackageGiven = '/api/' + config.apiVersion + '/rel/users/:userId/packages/:packageId';

  router.post(apiPath, requireJWT, packages.createPackage);
  router.get(apiPath + ':packageId', requireJWT, packages.getPackage);
  router.get(apiCompanyPath + ':companyId/packages' , requireJWT, packages.getCompanyPackages);
  router.put(apiPath + ':packageId', requireJWT, packages.updatePackage);

  router.post(apiPackageGiven, requireJWT, packages.givePackage);
  router.get(apiPackageGiven + '/redeem', requireJWT, packages.redeemPackage);
  router.post(apiPath + 'redeem/multiple', requireJWT, packages.redeemMultiplePackages);
  router.get(apiUserPackages, requireJWT, packages.getUserGiftedPackages);
  router.get(apiPath + ':qrcode/redeem', requireJWT, packages.redeemPackage);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
