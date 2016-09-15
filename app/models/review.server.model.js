var knex = require ('../../config/knex');
var Promise = require('bluebird');

exports.validateReviewById = function(error, reviewId) {
  knex('reviews').select('id').where('id', parseInt(reviewId))
  .catch(function(error) {
    console.log('Validation failed for review ID ' + reviewId + ': ' + error);
    throw error;
  })
  .returns('id');
}

exports.getReviewsForUser = function(userId) {
  return knex('reviews').select().where('user_id', parseInt(userId));
};

exports.getReviewsForCompanyAndUser = function(companyId, userId) {
  return knex('reviews').select().where(
    {
      user_id: parseInt(userId),
      company_id: parseInt(companyId)
    }
  );
};

exports.getReviewsForCompany = function(companyId) {
  return knex('reviews').select().where('company_id', parseInt(companyId));
};

exports.getReviewsByStatus = function(status) {
  return knex('reviews').select().where('status', 'ILIKE', status);
};

exports.createReview = function(error, userId, companyId, unitId, comment, answers, rating) {
  console.log('Creating review for company ' + companyId + ' by user ' + userId);

  knex.transaction(function(t) {
    return knex('reviews')
    .transacting(t)
    .returning('id')
    .insert(
      {
        user_id: parseInt(userId),
        company_id: parseInt(companyId),
        unit_id: parseInt(unitId),
        comment: comment,
        status: 'New',
        rating: parseFloat(rating),
        answers: [answers] // assuming param is alrady in JSON form
        // TODO: save the current UTC time stamp in 'created_at', or change schema definition so inserts default to CURRENT_TIMESTAMP
      }
    )
    .then(function(response) {
      var newReviewId = response;
      console.log('Creating record in review_approvals for new review ID ' + newReviewId);
      return knex('review_approvals')
      .transacting(t)
      .returning('review_id')
      .insert(
        {
          review_id: parseInt(newReviewId),
          status: 'New'
          // TODO: save the current UTC time stamp in 'created_at', or change schema definition so inserts default to CURRENT_TIMESTAMP
        }
      );
    })
    .then(t.commit)
    .catch(function(error) {
      t.rollback();
      console.error(error);
      throw error;
    });
  })
  .then(function(response) {
    console.log('Review creation successful: ID ' + response);
    return response;
  })
  .catch(function(error) {
    console.error('Review creation failed: ' + error);
    throw error;
  });
};

exports.updateReview = function(error, reviewId, userId, comment) {
  console.log('Updating review ID ' + reviewId + ' by user ID ' + userId);
  // Using transaction
  knex.transaction(function(t) {
    return knex('reviews')
    .transacting(t)
    .where({ id: parseInt(reviewId), user_id: parseInt(userId) })
    .update({ comment: comment, status: 'Updated' })
    .then(function(reviewId) {
      return knex('review_approvals')
      .transacting(t)
      .where('review_id', parseInt(reviewId))
      .update('status', 'Updated');
    })
    .then(t.commit)
    .catch(function(error) {
      t.rollback();
      console.error(error);
      throw error;
    });
  })
  .then(function() {
    console.log('Review update successful for review ID: ' + reviewId);
  })
  .catch(function(error) {
    console.error('Review update failed: ' + error);
    throw error;
  });
};

exports.updateReviewApproval = function(reviewId, auditorUserId, status) {
  console.log('Updating review_approvals record for review ID ' + reviewId);
  return knex('review_approvals').where('review_id', parseInt(reviewId)).update(
    {
      status: status,
      reviewer_id: parseInt(auditorUserId)
      // TODO: save the current UTC time stamp in 'updated_at', or change schema definition to default to CURRENT_TIMESTAMP
    }
  );
};

exports.deleteReview = function(reviewId) {
  console.log('Deleting review ' + reviewId);
  knex.transaction(function(t) {
    return knex('reviews')
    .transacting(t)
    .where('id', parseInt(reviewId))
    .del()
    .then(function(reviewId) {
      return knex('review_approvals')
      .transacting(t)
      .where('review_id', parseInt(reviewId))
      .del();
    })
    .then(t.commit)
    .catch(function(error) {
      t.rollback;
      console.error(error);
    });
  })
  .then(function() {
    console.log('Review deletion successful');
  })
  .catch(function(error) {
    console.error('Review deletion failed. ' + error);
  });
};
