var _ = require('lodash');
var Queries = require('koa-resteasy').Queries;

function *beforeSaveReview() {
  var answers = this.resteasy.object.answers;
  if (answers && answers.length) {
    var total = 0.0;
    for (var i = 0; i < answers.length; i++) {
      total += answers[i].answer;
    }

    this.resteasy.object.rating = total / answers.length;
  }
}

function *afterCreateReview(review) {
  var reviewApproval = { review_id: review.id, updated_at: this.resteasy.knex.fn.now(), created_at: this.resteasy.knex.fn.now() };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('review_approvals')
      .insert(reviewApproval)
  );
}

function *afterUpdateReviewApproval(approval) {
  var hash = { status: approval.status };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('reviews').where('reviews.id', approval.review_id).update(hash)
  );
}

module.exports = {
  beforeSave: function *() {
    if (this.resteasy.table == 'reviews') {
      yield beforeSaveReview.call(this);
    }
  },

  afterQuery: function *(res) {
    if (this.resteasy.operation == 'create' && this.resteasy.table == 'reviews') {
      yield afterCreateReview.call(this, res[0]);
    } else if (this.resteasy.operation == 'update' && this.resteasy.table == 'review_approvals') {
      yield afterUpdateReviewApproval.call(this, res[0]);
    }
  },
};
