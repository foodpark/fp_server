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
  hooks: {
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
  },

  // the apply context option allows you to specify special
  // relationships between thigns, in our case, /companies/:id/sites,
  // for example.  Which does a search through the checkins table for
  // active checkins.
  applyContext: function(query) {
    var context = this.params.context;
    var m;
    if (this.resteasy.table == 'sites' && context && (m = context.match(/companies\/(\d+)$/))) {
      return query.select(['sites.*', 'checkins.check_in AS site_check_in', 'checkins.check_out AS site_check_out']).join('checkins', 'checkins.site_id', 'sites.id')
        .whereRaw('checkins.company_id = ? AND checkins.check_in <= now() AND ( checkins.check_out IS NULL OR checkins.check_out >= now() )', [m[1]]);
      /*        .where('checkins.company_id', '=', m[1])
              .where('checkins.check_in', '<=', this.resteasy.knex.fn.now())
              .where('checkins.check_out', 'IS', null); */
    }
  },
};
