/**
 * @author Sávio Muniz
**/
var pawnshop = require('../controllers/pawnshop.server.controller');
var passport = require('koa-passport');
var Router = require('koa-router');
var config = require('../../config/config');

module.exports = function (app) {
  var router = new Router();
  var apiPath = '/api/'+ config.apiVersion + '/rel/';

  router.get(apiPath + 'requests/all', pawnshop.getAllRequests);
  router.get(apiPath + 'requests/:request_id/', pawnshop.getRequestsById);
  router.get(apiPath + 'customers/:customer_id/requests', pawnshop.getRequestsByCustomerId)
  router.post(apiPath + 'requests/create', pawnshop.createRequest)
  router.delete(apiPath + 'requests/:request_id', pawnshop.deleteRequest)
  router.put(apiPath + 'requests/:request_id', pawnshop.updateRequest)

  router.get(apiPath + 'companies/:company_id/offers', pawnshop.getOffersByCompany);
  router.post(apiPath + 'offers', pawnshop.createOffer);
  router.put(apiPath + 'offers/:offer_id', pawnshop.updateOffer)
  router.delete(apiPath + 'offers/:offer_id', pawnshop.deleteOffer)
  router.get(apiPath + 'companies/:company_id/units/:unit_id/offers', pawnshop.getOffersByUnit)

  router.get(apiPath + 'contracts/:contract_id', pawnshop.getContractsById);
  router.get(apiPath + 'customers/:customer_id/contracts', pawnshop.getContractsByCustomerId);
  router.get(apiPath + 'companies/:company_id/contracts', pawnshop.getContractsByCompanyId);
  router.delete(apiPath + 'contracts/:contract_id', pawnshop.deleteContract);
  router.post(apiPath + 'contracts', pawnshop.createContract);
  router.get(apiPath + 'contracts/qrcode/:qr_code', pawnshop.getContractsByQrCode);

  router.get(apiPath + 'count/*', pawnshop.getCountByContext);
  router.get(apiPath + 'mapsearch/pawnshops', pawnshop.getPawnshopsByTerritory);

  app.use(router.routes());	
  app.use(router.allowedMethods());
};