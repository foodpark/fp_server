var _ = require('lodash');
var Queries = require('koa-resteasy').Queries;
var User = require('./models/user.server.model');

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

function *beforeSaveUnit() {
  /** A Unit is associated with a User-UnitMgr
    * Owners create/update/delete Units and by association
    * create/update/delete the User-UnitMgr.
    * Username/password are replicated here so that they can easily be
    * dsplayed to the Owner, specifically that the password can be shown/updated
    * 1. Creating a unit - make sure the unit name is unique in Units,
    *    as well as the username in users
    * 2. Update a unit - if the username/password is changed, it also needs
    *    to be changed in Users
    *    a. A changed username must be checked for uniqueness in Users
    *    b. A unit being updated has to be retrieved first, because the uniqueness
    *       check will return at least this unit if the username hasn't changed,
    *       and we need the unit_mgr_id in order to update the right User record
    *       if the username has changed
    */
  console.log(this.resteasy)
  var username = this.resteasy.object.username;
  var password = this.resteasy.object.password;
  var existingUser = '';
  var unit = '';
  var createOrUpdateUser = true;
  try {
    existingUser = (yield User.userForUsername(username))[0];
  } catch (err) {
    console.error('create unit: error during creation');
    throw err;
  }
  if (this.resteasy.operation == 'update') {
    // Update an existing unit. We need to retrieve the Unit and also
    // check for username uniqueness in case the username is being changed.
    // Name isn't being changed if the Unit username and User username are the
    // the same for unit.unit_mgr_id == user.id. If the unit and user aren't
    // associated, then any existing user found is a failure of uniqueness.
    // No existing user found means a new username is being entered for the Unit
    // and User-UnitMgr
    var unitId = this.resteasy.object.id
    if (!unitId) { // must have unit id for update
      throw new Error('update operation requires unit id')
    }
    try {
      unit = (yield Unit.getSingleUnit(unitId))[0];
    } catch (err) {
      console.error('update unit: error retrieving unit during update');
      throw err;
    }
    if (existingUser.id == unit.unit_mgr_id) {
      // No other unit/user is using (potentially new) username
      existingUser = ''
      // check if changed. Must use unit to check password, as password in
      // Users is encrypted
      if (username==unit.username && password == unit.password) {
        // No changes to User record
        createOrUpdateUser = false;
      } // eles there's a new username or password and we'll need to use the
        // unit.unit_mgr_id for the update
    } // else the existingUser doesn't belong to this unit. Error thrown below
  }
  if (existingUser) {
    throw new Error('That user name is already in use.');
    return;
  }
  if (createOrUpdateUser) {
    var unitUser = { role: 'SITEMGR', username: username, password: password}
    if (unit) unitUser.id = unit.unit_mgr_id // update the right one
    try {
      var user = (yield User.createOrUpdateUser(unitUser))[0]
    } catch (err) {
      console.error('create/update unit: error creating/updating User-UnitMgr');
      throw err;
    }
    if (!unit) this.resteasy.object.unit_mgr_id = user.id; // a new Unit
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
      } else if (this.resteasy.table == 'units') {
        yield beforeSaveUnit.call(this);
      }
    },

    afterQuery: function *(res) {
      if (this.resteasy.operation == 'create') {
        if (this.resteasy.table == 'reviews') {
          yield afterCreateReview.call(this, res[0]);
        }
      } else if (this.resteasy.operation == 'update') {
        if (this.resteasy.table == 'review_approvals') {
          yield afterUpdateReviewApproval.call(this, res[0]);
        }
      }
    },
  },

  // the apply context option allows you to specify special
  // relationships between things, in our case, /companies/:id/units,
  // for example.  Which does a search through the checkins table for
  // active checkins.
  applyContext: function(query) {
    var context = this.params.context;
    var m;
    if (this.resteasy.table == 'units' && context && (m = context.match(/companies\/(\d+)$/))) {
      return query.select(['units.*', 'checkins.check_in AS unit_check_in', 'checkins.check_out AS unit_check_out']).join('checkins', 'checkins.unit_id', 'units.id')
        .whereRaw('checkins.company_id = ? AND checkins.check_in <= now() AND ( checkins.check_out IS NULL OR checkins.check_out >= now() )', [m[1]]);
      /*        .where('checkins.company_id', '=', m[1])
              .where('checkins.check_in', '<=', this.resteasy.knex.fn.now())
              .where('checkins.check_out', 'IS', null); */
    }
  },
};
