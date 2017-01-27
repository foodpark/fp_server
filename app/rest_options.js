var _ = require('lodash');
var Queries = require('koa-resteasy').Queries;
var Company = require('./models/company.server.model');
var Customer = require('./models/customer.server.model');
var LoyaltyRewards = require('./models/loyaltyrewards.server.model');
var OrderHistory = require('./models/orderhistory.server.model');
var User = require('./models/user.server.model');
var msc = require('./controllers/moltin.server.controller');
var payload = require('./utils/payload');
var timestamp = require('./utils/timestamp');
var push = require('./controllers/push.server.controller');
var User = require('./models/user.server.model');
var Unit = require('./models/unit.server.model');
var debug = require('debug')('rest_options');


function *simplifyDetails(orderDetail) {
  var items = orderDetail
  debug('array length '+ items.length)
  var menuItems = {};
  for (i = 0; i < items.length; i++ ) {
    item = items[i];
    debug('menu item ')
    debug(item.product.value)
    debug('quantity ')
    debug(item.quantity)
    debug('amount')
    var itemDetail = {
      title : item.product.value,
      quantity : item.quantity,

    }
    if (item.product.data.modifiers) {
      debug('modifiers')
      var modifiers = item.product.data.modifiers
      itemDetail.options = []
      itemDetail.selections = {}
      for (var j in modifiers) {
        debug(modifiers[j].title)
        var mod = modifiers[j]
        debug(mod)
        if (!mod.type && mod.data.type.value == 'Variant') { // price associated with Variant
          debug(mod.data.title + ': '+ mod.var_title)
          itemDetail.selections[mod.data.title] = mod.var_title
        } else { // option items or single selections
          var titles = []
          for (var k in mod.variations) {
            var variation = mod.variations[k]
            debug('...'+ variation.title)
            titles.push(variation.title)
          }
          debug(titles)
          if (mod.type.value == 'Single') {
            itemDetail.options = titles
          } else if (mod.type.value == 'Variant') {
            itemDetail.selections[mod.title]=titles
          }
        }
      }
    }
    debug(itemDetail.selections)
    menuItems[item.product.value] = itemDetail
  }
  debug(menuItems)
  return menuItems
}

function *beforeSaveOrderHistory() {
  debug('beforeSaveOrderHistory');
  debug(this.resteasy.object);
  debug('..operation '+ this.resteasy.operation)
  if (this.resteasy.operation == 'create') {
    debug('...create')
    if (this.resteasy.object.order_sys_order_id) {
      debug('..getting customer name')
      try {
        debug('..user ')
        debug(this.passport.user)
        var user = this.passport.user
        var customer = (yield Customer.getForUser(user.id))[0]
        debug('..customer')
        debug(customer)
      } catch (err) {
        console.error('beforeSaveOrderHistory: error getting customer name');
        throw err;
      }
      var customerName = user.first_name + " " + user.last_name.charAt(0)
      debug("..customer name is "+ customerName);
      this.resteasy.object.customer_name = customerName;
      this.resteasy.object.customer_id = customer.id;

      //set company
      if (!this.resteasy.object.company_id) {
        debug(this.params.context)
        var coId = this.params.context.match(/companies\/(\d+)\//)
        debug(coId)
        this.resteasy.object.company_id = coId[1];
      }

      var moltin_order_id = this.resteasy.object.order_sys_order_id
      debug('order sys order id: '+ moltin_order_id)
      try {
        var order = yield msc.findOrder(moltin_order_id)
        var order_details = yield msc.getOrderDetail(moltin_order_id)
        order_details = yield simplifyDetails(order_details)
      } catch (err) {
        console.error(err)
        throw(err)
      }
      debug('...total amount '+ order.totals.formatted.total)
      this.resteasy.object.amount = order.totals.formatted.total
      debug('...order details ')
      debug(order_details)
      this.resteasy.object.order_detail = order_details
      // Set the initial state
      this.resteasy.object.status = {
        order_requested : ''
      }
      debug(this.resteasy.object)
      debug('...preprocessing complete. Ready to save')
    } else {  // order_sys_order_id is required
      console.error('No order id for the ordering system')
      throw new Error('order_sys_order_id is required');
    }
  } else if (this.resteasy.operation == 'update') {
    debug('...update')
    debug('...limit payload elements')
    try {
      // this will modify this.resteasy.object
      yield payload.limitOrderHistPayloadForPut(this.resteasy.object)
    } catch (err) {
      console.error(err)
      throw(err)
    }
    debug('..limited payload is..')
    debug(this.resteasy.object)
    if (this.resteasy.object.status) {
      try {
        var savedStatus = (yield OrderHistory.getStatus(this.params.id))[0]
      } catch (err) {
        console.error(err)
        throw(err)
      }
      var newStat = this.resteasy.object.status
      debug (savedStatus)
      debug('..status sent is '+ newStat)
      if (!savedStatus.status[newStat]) {
        // add subsequent state
        savedStatus.status[newStat] = ''
      } // else previously set
      debug(savedStatus)
      this.resteasy.object.status = savedStatus.status
    } else {
      debug('...not a status update')
    }
  }
}


function *afterCreateOrderHistory(orderHistory) {
  debug('afterCreateOrderHistory')

  try {
    unit = (yield Unit.getSingleUnit(orderHistory.unit_id))[0];
  } catch (err) {
    console.error('afterCreateOrderHistory: error retrieving unit');
    throw err;
  }
  debug(unit)

  if (!unit.gcm_id && !unit.fcm_id) {
    console.error('afterCreateOrderHistory: No fcm/gcm id for unit '+ unit.name +' ('+ unit.id +'). Cannot notify')
    throw new Error ('No fcm/gcm id for unit '+ unit.name +' ('+ unit.id +'). Cannot notify')
  }
  var msgTarget = {
    to     : 'unit',
    toId   : unit.id,
    gcmId  : unit.gcm_id,
    fcmId  : unit.fcm_id,
    title  : "Order Requested!",
    status : "order_requested"
  }
  debug('sending notification to unit '+ unit.name +' ('+ unit.id +')')
  yield push.notifyOrderUpdated(orderHistory.id, msgTarget)
  debug('..returned from notifying')

  var hash = {
    status : {
      order_requested: timestamp.now()
    }
  }
  this.resteasy.queries.push(
    this.resteasy.transaction.table('order_history').where('order_history.id', orderHistory.id).update(hash)
  );
}

function *afterUpdateOrderHistory(orderHistory) {
  debug('afterUpdateOrderHistory')

  var deviceId = ''
  var title = ''
  var orderHistoryStatus = orderHistory.status
  debug(orderHistoryStatus)
  var keys = Object.keys(orderHistoryStatus)
  debug("...number of entries= "+ keys.length)
  var updated = false
  for (var i = 0; i < keys.length; i++) {
    debug(' name=' + keys[i] + ' value=' + orderHistoryStatus[keys[i]]);
    if (!orderHistoryStatus[keys[i]]) { // notification not yet sent
      var status = keys[i]
      debug('...status '+ status)
      var msgTarget = { order_id : orderHistory.id }
      if (status == 'order_paid' || status == 'pay_fail') {
        debug('...status update from customer. Notify unit')
        // get unit 
        try {
          var unit = (yield Unit.getSingleUnit(orderHistory.unit_id))[0];
        } catch (err) {
          console.error('afterUpdateOrderHistory: error retrieving unit '+ orderHistory.unit_id);
          throw err;
        }
        debug('..Unit gcm id is '+ unit.gcm_id)
        msgTarget.to = 'unit'
        msgTarget.toId = unit.id
        msgTarget.gcmId = unit.gcm_id
        msgTarget.fcmId = unit.fcm_id
      } else {
        debug('...status update from unit. Notify customer '+ orderHistory.customer_id)
        // get customer device id
        try {
          var customer = (yield Customer.getSingleCustomer(orderHistory.customer_id))[0];
        } catch (err) {
          console.error('afterUpdateOrderHistory: error retrieving customer '+ orderHistory.customer_id);
          throw err;
        }
        debug('..Customer gcm id is '+ customer.gcm_id)
        msgTarget.to = 'customer' 
        msgTarget.toId = customer.id
        msgTarget.gcmId = customer.gcm_id
        msgTarget.fcmId = customer.fcm_id
      }
      if (!msgTarget.gcmId && !msgTarget.fcmId){
        console.error('afterUpdateOrderHistory: Cannot notify! No fcm/gcm id for ' + msgTarget.to +' '+ msgTarget.toId)
        throw new Error ('Cannot notify! No fcm/gcm id for '+ msgTarget.to)
      }
      switch(status) {
          // From Customer
          case 'order_paid':
              msgTarget.title = "Order Paid"
              break;
          case 'pay_fail':
              msgTarget.title = "Payment Failed"
              break;
          // From Unit
          case 'order_declined':
              msgTarget.title = "Order Declined"
              break;
          case 'order_accepted':
              msgTarget.title = "Order Accepted"
              break;
          case 'order_in_queue':
              msgTarget.title = "Order In Queue"
              break;
          case 'order_cooking':
              msgTarget.title = "Order Cooking"
              break;
          case 'order_ready':
              msgTarget.title = "Order Ready"
              break;
          case 'order_picked_up':
              msgTarget.title = "Order Picked Up"
              break;
          case 'no_show':
              msgTarget.title = "No Show"
              break;
          case 'order_dispatched':
              msgTarget.title = "Order Dispatched"
              break;
          case 'order_delivered':
              msgTarget.title = "Order Delivered"
              break;
          default:
              throw new Error ('Unkown status '+ status +' for order '+ orderHistory.id)
      }
      msgTarget.status = status
      
      debug('sending notification to '+ msgTarget.to +' ('+ msgTarget.toId +')')
      yield push.notifyOrderUpdated(orderHistory.id, msgTarget)
      debug('..returned from notifying');

      // record notification time
      orderHistoryStatus[keys[i]] = timestamp.now();
      debug(orderHistoryStatus)
      updated = true;
    }
  }
  if (updated) {
    debug(orderHistoryStatus)
    this.resteasy.queries.push(
      this.resteasy.transaction.table('order_history').where('order_history.id', orderHistory.id).update({ status: orderHistoryStatus})
    );
  }
}

/*
fcm: https://fcm.googleapis.com/fcm/send
gcm: https://gcm-http.googleapis.com/gcm/send
curl --header "Authorization: key=AIzaSyBHjuQ6j05yKC-BYJa6C2ER9-JfNEaPvYI" \
       --header Content-Type:"application/json" \
       https://gcm-http.googleapis.com/gcm/send \
       -d "{\"registration_ids\":[\"cFjGDbV8s5o:APA91bHk_FrAcpIkX8ATzv5lisTtgU4Qdz7mhO_lV4sDzvpXXO075K4qRligKMieeAedqYOmRFSOqGc8w-w5uGkehdavuUjZZ77Q1vOrO3WDq5jnwVvY2LaP7aW02DCQJVx0E79g1jX9\"]}"
       */
// \"registration_ids\":[\"cFjGDbV8s5o:APA91bHk_FrAcpIkX8ATzv5lisTtgU4Qdz7mhO_lV4sDzvpXXO075K4qRligKMieeAedqYOmRFSOqGc8w-w5uGkehdavuUjZZ77Q1vOrO3WDq5jnwVvY2LaP7aW02DCQJVx0E79g1jX9\"
//   "dSEAkJd05m0:APA91bGkJgqyfvkGjpL4MuBi419c-S9VZhRQ7U5aAJUoxffBwVqs3zEkaBu452emgWS-dbufPmw9u0KyHg2__CLd0mkALrWQULCqCe8OtMUbRaDPDDE9AP_1TUzfQ2e5P5392ufYtS4f",


function *beforeSaveReview() {
  debug('beforeSaveReview: user is ')
  debug(this.params.user)
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
  debug('beforeSaveUnit')
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
    debug(existingUser);
  }
  debug(this.resteasy.operation);
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
    debug('unit');
    debug(unit);
    if (existingUser && (existingUser.id == unit.unit_mgr_id)) {
      // No other unit/user is using (potentially new) username
      existingUser = '';
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
  debug(existingUser);
  if (existingUser) {
    console.err('User name '+ existingUser.username +' already in use')
    throw new Error('That user name is already in use.');
  }
  debug('..create or update user ');
  debug(createOrUpdateUser);
  if (createOrUpdateUser) {
    var unitmgr = { role: 'UNITMGR', username: username, password: password}
    if (unit) unitmgr.id = unit.unit_mgr_id // update the right one
    debug(unitmgr);
    try {
      var user = (yield User.createOrUpdateUser(unitmgr))[0]
    } catch (err) {
      console.error('create/update unit: error creating/updating User-UnitMgr');
      throw err;
    }
    debug(user);
    if (!unit) {
      debug('..adding unit mgr '+ user.id +' to new unit')
      this.resteasy.object.unit_mgr_id = user.id; // a new Unit
      // get the company
      debug('..getting company')
      if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
        debug('..adding company '+ m[1] +' to new unit')
        this.resteasy.object.company_id = m[1]
      } else {
        // no company context is an error
        console.err('No company context for unit: '+ this.params.context);
        throw new Error ('No company context for unit')
      }
    }
    debug('..unit');
    debug(this.resteasy.object);
  }
}

function *beforeSaveCompanies() {
  debug('beforeSaveCompanies');
  debug(this.resteasy.object);
  debug(this.params);
  var company = (yield Company.getSingleCompany(this.params.id))[0];
  debug('company '+ company.id);
  if (company.delivery_chg_amount != this.resteasy.object.delivery_chg_amount) {

    var amount = this.resteasy.object.delivery_chg_amount;
    debug('..delivery charge amount has changed to '+ amount +'. Updating..')
    // Update moltin
    var item = '';
    var data = { price: amount};
    try {
        item = yield msc.updateMenuItem(company.delivery_chg_item_id, data)
    } catch (err) {
      console.error(err);
      throw new Error ('Error trynig to update delivery charge in ordering system');
    }
    debug('..delivery charge updated')
  }
}

function *beforeSaveLoyaltyRewards() {
  if (this.resteasy.operation == 'create') {
    if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
      var coId = m[1];
      var exists = (yield LoyaltyRewards.isCompanyFound(coId))[0];
      console.log('LoyaltyRewards.isCompanyFound:')
      console.log(exists);
      // if vendor already has loyalty rewards defined for their company ID, do not allow a second set to be saved.
      if (exists) {
        this.throw('Company has existing rewards defined. Use PUT/PATCH to modify.',405);
      }
    } else {
      throw new Error ('No company context found for loyalty rewards');
    }
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

function *afterReadOrderHistory(orderHistory) {
  debug('afterReadOrderHistory')
  if (orderHistory.order_sys_order_id && !orderHistory.order_detail) {
    try {
      var moltin_order_items = yield msc.getOrderDetail(orderHistory.order_sys_order_id)
      var details = yield simplifyDetails(moltin_order_items)
    } catch (err) {
      console.error(err)
      throw(err)
    }
    debug('..order details')
    debug(details)
    var orderDetail = { order_detail: details};
    try {
      var updatedOrder = yield OrderHistory.updateOrder(orderHistory.id, orderDetail)
    } catch (err) {
      console.error(err)
      throw(err)
    }
    debug('updatedOrder')
    debug(updatedOrder)
  }
  /* this.resteasy.queries.push(
    this.resteasy.transaction.table('order_history').where('order_history.id', order_history.id).update(order_detail)
  );*/
}

function *afterReadUnit(unit) {

  if (this.this.resteasy.table == 'units' && context && (m = context.match(/companies\/(\d+)$/))) {
    debug(m[0])
    debug(m[1])
    return query.select('units.*').whereRaw('units.company_id = ?', m[1]);
  }
}

module.exports = {
  hooks: {
    authorize: function *(operation, object) {
      console.log('checking authorization of ' + operation + ' on ')
      console.log(this.params)
      if (operation == 'create') {
        if (this.params.table == 'companies' || this.params.table == 'food_parks' || this.params.table == 'roles' ||
            this.params.table == 'order_status_audit' || this.params.table == 'territories') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'ADMIN') {
            this.throw('Create Unauthorized - Admin only',401);
          } // else continue
        } else if (this.params.table == 'units' || this.params.table == 'loyalty_rewards') {
          if(!this.isAuthenticated() || !this.passport.user || (this.passport.user.role != 'OWNER' && this.passport.user.role != 'ADMIN')) {
            this.throw('Create Unauthorized - Owners/Admin only',401);
          } // else continue          }
        } else if (this.params.table == 'customers' || this.params.table == 'favorites' || this.params.table == 'reviews' ||
                   this.params.table == 'order_history') {
          debug('checking POST order_history '+ this.params.table)
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'CUSTOMER') {
            this.throw('Create Unauthorized - Customers only',401);
          } // else continue          }
        }
        console.log("...authorized")
      } else if (operation == 'update' && this.params.table == 'units' && this.isAuthenticated() && this.passport.user && this.passport.user.role == 'UNITMGR') {
        debug('unit mgr update')
        if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
          var compId = m[1]
        }
        debug('.. for company '+ compId)
        var valid = (yield Unit.verifyUnitManager(compId, this.params.id, this.passport.user.id))[0]
        debug(valid)
        if (!valid) {
          this.throw('Update Unauthorized - incorrect Unit Manager',401);
        } // else continue
        console.log("...authorized")

      } else if (operation == 'update' || operation == 'delete') {
        if (this.params.table == 'territories' || this.params.table == 'food_parks' || this.params.table == 'roles' ||
            this.params.table == 'order_status_audit' || this.params.table == 'users') {
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'ADMIN') {
            this.throw('Update/Delete Unauthorized - Admin only',401);
          } // else continue
        } else if (this.params.table == 'companies' || this.params.table == 'units' || this.params.table == 'loyalty_rewards') {
          if(!this.isAuthenticated() || !this.passport.user || (this.passport.user.role != 'OWNER' && this.passport.user.role != 'ADMIN')) {
            this.throw('Update/Delete Unauthorized - Owners/Admin only',401);
          } else {
            if (this.passport.user.role == 'OWNER') {
              // verify user is modifying the correct company
              var coId = this.params.id
              if (this.params.table != 'companies' && (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/)))) {
                coId = m[1]
              }
              console.log('verifying owner')
              var valid = (yield Company.verifyOwner(coId, this.passport.user.id))[0]
              console.log(valid)
              if (!valid) {
                this.throw('Update/Delete Unauthorized - incorrect Owner',401);
              } // else continue
              console.log(valid)
            }
          }
        } else if (this.params.table == 'customers' ||  this.params.table == 'favorites' || this.params.table == 'reviews') {
          if(!this.isAuthenticated() || !this.passport.user || (this.passport.user.role != 'CUSTOMER' && this.passport.user.role != 'ADMIN')) {
            this.throw('Update/Delete Unauthorized - Customers only',401);
          } else {
            if (this.passport.user.role == 'CUSTOMER') {
              // verify user is modifying the correct review
              var custId = this.params.id
              if (!this.params.table == 'customers' && (this.params.context && (m = this.params.context.match(/customers\/(\d+)$/)))) {
                custId = m[1]
              }
              console.log('verifying customer')
              var valid = (yield Customer.verifyUser(custId, this.passport.user.id))[0]
              console.log(valid)
              if (!valid) {
                this.throw('Update/Delete Unauthorized - User may not update this customer',401);
              } // else continue
              console.log(valid)
            }
          }
        } 
        console.log("...authorized")
      } else if (operation == 'read') {
        console.log('got a read')
      } else {
        console.error('authorize: unknown operation' + operation)
        this.throw('Unknown operation - '+ operation, 405)
      }
    },

    beforeSave: function *() {
      if (this.resteasy.table == 'reviews') {
        yield beforeSaveReview.call(this);
      } else if (this.resteasy.table == 'units') {
        yield beforeSaveUnit.call(this);
      } else if (this.resteasy.table == 'loyalty_rewards') {
        debug('saving loyalty rewards')
        yield beforeSaveLoyaltyRewards.call(this);
      } else if (this.resteasy.table == 'companies') {
        debug('saving companies')
        yield beforeSaveCompanies.call(this);
      } else if (this.resteasy.table == 'order_history') {
        debug('saving order_history')
        yield beforeSaveOrderHistory.call(this);
      }
    },

    afterQuery: function *(res) {
      if (this.resteasy.operation == 'create') {
        if (this.resteasy.table == 'reviews') {
          yield afterCreateReview.call(this, res[0]);
        } else if (this.resteasy.table == 'order_history') {
          yield afterCreateOrderHistory.call(this, res[0]);
        }
      } else if (this.resteasy.operation == 'update') {
        if (this.resteasy.table == 'review_approvals') {
          yield afterUpdateReviewApproval.call(this, res[0]);
        } else if (this.resteasy.table == 'order_history') {
            yield afterUpdateOrderHistory.call(this, res[0]);
          }
      } else if (this.resteasy.operation == 'read') {
        if (this.resteasy.table == 'order_history') {
          yield afterReadOrderHistory.call(this, res[0]);
        }
      }
    },
  },

  // the apply context option allows you to specify special
  // relationships between things, in our case, /companies/:id/units,
  // for example.
  applyContext: function(query) {
    debug('applyContext')
    var context = this.params.context;
    var m;
    debug(this.resteasy.operation)
    debug(this.resteasy.table)
    debug(context)
    if (this.resteasy.operation == 'read' && this.resteasy.table == 'units' && context && (m = context.match(/companies\/(\d+)$/))) {
      debug('company id '+ m[1])
      return query.select('*').where('company_id', m[1]);
    }
  },
};
