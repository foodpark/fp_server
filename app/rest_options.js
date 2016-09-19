var _ = require('lodash');
var Queries = require('koa-resteasy').Queries;
var Company = require('./models/company.server.model');
var Customer = require('./models/customer.server.model');
var User = require('./models/user.server.model');
var Unit = require('./models/unit.server.model')

function *beforeSaveReview() {
  console.log('beforeSaveReview: user is ');
  console.log(this.passport.user);

  var customer = (yield Customer.getForUser(this.passport.user.id))[0];
  if (!customer) {
    throw new error('Customer entry not found for user '+ this.passport.user.id);
  }
  this.resteasy.object.customer_id = customer.id;

  var rating = calculateTotalReviewRating(this.resteasy.object.answers.answers);
  if (rating > -1) {
    this.resteasy.object.rating = rating;
  }

  /*var answers = this.resteasy.object.answers.answers;
  if (answers && answers.length) {
    var total = 0.0;
    for (var i = 0; i < answers.length; i++) {
      total += answers[i].answer;
    }

    this.resteasy.object.rating = total / answers.length;
    //TODO: if UI sends over an 'overall' rating answer, give that value more weight.
  }*/
  this.resteasy.object.status = 'New';
}

function *beforeSaveUnit() {
  /** A Unit is associated with a User-UnitMgr
    * Owners create/update/delete Units and by association
    * create/update/delete the User-UnitMgr.
    * User-UnitMgr username/password are replicated in Unit so that they can be
    * displayed to the Owner, specifically that the password can be shown/updated
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
  var username = this.resteasy.object.username;
  var password = this.resteasy.object.password;
  var existingUser = '';
  var unit = '';
  var createOrUpdateUser = false; // assume no create/update of user
  if (username) {
    // username present, possible create or update
    createOrUpdateUser = true;
    try {
      existingUser = (yield User.userForUsername(username))[0];
    } catch (err) {
      console.error('create unit: error during creation');
      throw err;
    }
  }
  if (this.resteasy.operation == 'update') {
    // Update an existing unit. We need to retrieve the Unit and also
    // check for username uniqueness in case the username is being changed.
    // Name isn't being changed if the Unit username and User username are the
    // the same for unit.unit_mgr_id == user.id. If the unit and user aren't
    // associated, then any existing user found is a failure of uniqueness.
    // No existing user found means a new username is being entered for the Unit
    // and User-UnitMgr
    var unitId = this.params.id
    if (!unitId) { // must have unit id for update
      throw new Error('update operation requires unit id')
    }
    try {
      unit = (yield Unit.getSingleUnit(unitId))[0];
    } catch (err) {
      console.error('update unit: error retrieving unit during update');
      throw err;
    }
    if (existingUser && (existingUser.id == unit.unit_mgr_id)) {
      // No other unit/user is using (potentially new) username
      existingUser = ''
      // check if username/password changed. Must use unit to check password,
      // as password in Users is encrypted
      if (username==unit.username && password == unit.password) {
        // No changes to User record
        createOrUpdateUser = false;
      } // else there's a new username or password and we'll need to use the
        // unit.unit_mgr_id for the update
    } // else no existingUser and this is an update to username
      // Or existingUser doesn't belong to this unit so throw error below
  }
  if (existingUser) {
    throw new Error('That user name is already in use.');
    return;
  }
  if (createOrUpdateUser) {
    var unitmgr = { role: 'UNITMGR', username: username, password: password}
    if (unit) unitmgr.id = unit.unit_mgr_id // update the right one
    console.log(unitmgr)
    try {
      var user = (yield User.createOrUpdateUser(unitmgr))[0]
    } catch (err) {
      console.error('create/update unit: error creating/updating User-UnitMgr');
      throw err;
    }
    if (!unit) {
      this.resteasy.object.unit_mgr_id = user.id; // a new Unit
      // get the company
      if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
        this.resteasy.object.company_id = m[1]
      } else {
        // no company context is an error
        throw new Error ('No company context for unit')
      }
    }
  }
}

function *afterCreateReview(review) {
  var reviewApproval = { review_id: review.id, status: review.status, updated_at: this.resteasy.knex.fn.now(), created_at: this.resteasy.knex.fn.now() };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('review_approvals')
      .insert(reviewApproval)
  );
}

function *beforeUpdateReview(review) {
  this.resteasy.object.status = 'Updated';

  var rating = calculateTotalReviewRating(this.resteasy.object.answers.answers);
  if (rating > -1) {
    this.resteasy.object.rating = rating;
  }
}

function calculateTotalReviewRating(answers) {
  if (answers && answers.length) {
    var total = 0.0;
    for (var i = 0; i < answers.length; i++) {
      total += answers[i].answer;
    }
    return total / answers.length;
    //TODO: if UI sends over an 'overall' rating answer, give that value more weight.
  }
  return -1;
}

function *afterUpdateReview(review) {
  var updatedApproval = { status: 'Updated', updated_at: this.resteasy.knex.fn.now() };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('review_approvals').where('review_id', review.id)
      .update(updatedApproval)
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
    authorize: function *(operation, object) {
      console.log('checking authorization of ' + operation + ' on ')
      console.log(this.params)
      if (operation == 'create') {
        if (this.params.table == 'companies' || this.params.table == 'units') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'OWNER') {
            this.throw('Create Unauthorized - Owners only',401);
          } // else continue          }
        } else if (this.params.table == 'customers' || this.params.table == 'favorites' || this.params.table == 'reviews') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'CUSTOMER') {
            this.throw('Create Unauthorized - Customers only',401);
          } // else continue          }
        }
      } else if (operation == 'update' || operation == 'delete') {
        if (this.params.table == 'companies' || this.params.table == 'units') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'OWNER') {
            this.throw('Update Unauthorized - Owners only',401);
          } else {
            // verify user is modifying the correct company
            var coId = this.params.id
            if (!this.params.table == 'companies' && (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/)))) {
              coId = m[1]
            }
            console.log('verifying owner')
            var valid = (yield Company.verifyOwner(this.params.id, this.passport.user.id))[0]
            console.log(valid)
            if (!valid) {
              this.throw('Update Unauthorized - incorrect Owner',401);
            } // else continue
          }
        } else if (this.params.table == 'customers' ||  this.params.table == 'favorites' || this.params.table == 'reviews') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'CUSTOMER') {
            this.throw('Update Unauthorized - Customers only',401);
          } else {
            // verify user is modifying the correct review
            var custId = this.params.id
            if (!this.params.table == 'customers' && (this.params.context && (m = this.params.context.match(/customers\/(\d+)$/)))) {
              custId = m[1]
            }
            console.log('verifying customer')
            var valid = (yield Customer.getForUser(this.passport.user.id))[0];// .verifyUser(custId, this.passport.user.id))[0]
            console.log(valid)
            if (!valid) {
              this.throw('Update Unauthorized - User may not update this customer',401);
            } // else continue
            console.log(valid)
          }
        }

      } else if (operation == 'read') {
        console.log('got a read')
      } else {
        console.error('authorize: unknown operation' + operation)
        this.throw('Unknown operation - '+ operation, 405)
      }
    },

    beforeSave: function *() {
      if (this.resteasy.table == 'reviews') {
        if (this.resteasy.operation == 'create') {
          yield beforeSaveReview.call(this);
        } else if (this.resteasy.operation == 'update') {
          yield beforeUpdateReview.call(this);
        }
      } else if (this.resteasy.table == 'units') {
        yield beforeSaveUnit.call(this);
      }
    },

    /*beforeUpdate: function *() {
      if (this.resteasy.table == 'reviews') {
        yield beforeUpdateReview.call(this);
      }
    },*/

    afterQuery: function *(res) {
      if (this.resteasy.operation == 'create') {
        if (this.resteasy.table == 'reviews') {
          yield afterCreateReview.call(this, res[0]);
        }
      } else if (this.resteasy.operation == 'update') {
        if (this.resteasy.table == 'review_approvals') {
          yield afterUpdateReviewApproval.call(this, res[0]);
        } else if (this.resteasy.table == 'reviews') {
          yield afterUpdateReview.call(this, res[0]); // set record in review_approvals to 'Updated'
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
  /**  if (this.resteasy.operation == 'read' && this.resteasy.table == 'units' && context && (m = context.match(/companies\/(\d+)$/))) {
      return query.select(['units.*', 'checkins.check_in AS unit_check_in', 'checkins.check_out AS unit_check_out']).join('checkins', 'checkins.unit_id', 'units.id')
        .whereRaw('checkins.company_id = ? AND checkins.check_in <= now() AND ( checkins.check_out IS NULL OR checkins.check_out >= now() )', [m[1]]);
      /*        .where('checkins.company_id', '=', m[1])
              .where('checkins.check_in', '<=', this.resteasy.knex.fn.now())
              .where('checkins.check_out', 'IS', null); */
  //  }

  },
};
