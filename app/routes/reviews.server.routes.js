var reviews = require('../../app/controllers/reviews.server.controller');
var auth = require('../../app/controllers/authentication.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');


module.exports = function(app) {
	var router = new Router();
	var apiVersion = '/api/' + config.apiVersion;

  router.get(apiVersion + '/reviews/user', reviews.listReviewsForUser);
	router.get(apiVersion + '/reviews/:status', reviews.listReviewsByStatus);
	router.get(apiVersion + '/reviews/companies/:companyId', reviews.listReviewsForCompany);
	router.post(apiVersion + '/reviews/companies/:companyId', reviews.create);
	router.get(apiVersion + '/reviews/companies/:companyId/user', reviews.listReviewsForCompanyAndUser);
	router.put(apiVersion + '/reviews/:reviewId/companies/:companyId', reviews.update);
	router.put(apiVersion + '/reviews/:reviewId/companies/:companyId/approvals', reviews.updateApproval)
	router.delete(apiVersion + '/reviews/:reviewId', reviews.deleteReview);
	router.param('reviewId', reviews.validateId);
}
