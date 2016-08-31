var reviews = require('../../app/controllers/reviews.server.controller');

module.exports=function(app) {
	app.route('/api/reviews').post(reviews.create).get(reviews.list);
  app.route('/api/reviews/:reviewId').get(reviews.read).put(reviews.update).delete(reviews.delete);
	app.param('reviewId',reviews.reviewById);
  app.route('/api/reviews/companies/:companyId').get(reviews.listReviewsForCompany);
  app.route('/api/reviews/customers/:customerId').get(reviews.listReviewsForCustomer);
  app.route('/api/reviews/units/:unitId').get(reviews.listReviewsForUnit);
};
