var _ = require('lodash');
var Queries = require('../koa-resteasy').Queries;
var Company = require('./models/company.server.model');
var Customer = require('./models/customer.server.model');
var Favorites = require('./models/favorites.server.model');
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
    if (! this.resteasy.object.order_sys_order_id) { // is required
      console.error('No order id for the ordering system')
      throw new Error('order_sys_order_id is required', 422);
    }
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
    debug('..get company id');
    if (!this.resteasy.object.company_id) {
      debug(this.params.context)
      var coId = this.params.context.match(/companies\/(\d+)\//)
      debug(coId)
      this.resteasy.object.company_id = coId[1];
    }
    //set unit
    debug('..get unit id');
    if (!this.resteasy.object.unit_id) {
      debug(this.params.context)
      var unId = this.params.context.match(/units\/(\d+)/)
      debug(unId)
      this.resteasy.object.unit_id = unId[1];
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
  debug('returning from beforeSaveOrderHistory');
}


function *afterCreateOrderHistory(orderHistory) {
  debug('afterCreateOrderHistory')
  debug(orderHistory);
  var unit = '';
  try {
    unit = (yield Unit.getSingleUnit(orderHistory.unit_id))[0];
  } catch (err) {
    console.error('afterCreateOrderHistory: error retrieving unit');
    throw err;
  }
  debug(unit);
  if (!unit.gcm_id && !unit.fcm_id) {
    console.error('afterCreateOrderHistory: No fcm/gcm id for unit '+ unit.name +' ('+ unit.id +'). Cannot notify')
    throw new Error ('No fcm/gcm id for unit '+ unit.name +' ('+ unit.id +'). Cannot notify')
  }

  var customer = '';
  try {
    customer = (yield Customer.getSingleCustomer(orderHistory.customer_id))[0];
  } catch (err) {
    console.error('afterCreateOrderHistory: error retrieving customer');
    throw err;
  }
  debug(customer);
  
  var orderDetail = JSON.stringify(orderHistory.order_detail, null, 2);
  debug(orderDetail);
  var msg = 'Pickup Time: '+  orderHistory.desired_pickup_time +'\n'+
            'Customer: '+ this.passport.user.first_name +' '+ this.passport.user.last_name.charAt(0) +'\n'+
            'Order Details: ' + orderDetail +'\n';
  debug('msg');
  debug(msg);
  var msgTarget = {
    to     : 'unit',
    toId   : unit.id,
    gcmId  : unit.gcm_id,
    fcmId  : unit.fcm_id,
    title  : "Order Accept/Decline",
    message : msg,
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

var display = {
	order_requested	 : 'was requested',
	order_declined   : 'was rejected',
	order_accepted   : 'was accepted',
	pay_fail         : 'payment failed',
	order_in_queue   : 'is in queue',
	order_cooking    : 'is cooking',
	order_ready	     : 'is ready',
	order_picked_up  : 'was picked up',
	no_show          : ': customer was no show',
	order_dispatched : 'was dispatched',
	order_delivered	 : 'was delivered'
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
        var customer ='';
        try {
          customer = (yield Customer.getSingleCustomer(orderHistory.customer_id))[0];
        } catch (err) {
          console.error('afterUpdateOrderHistory: error retrieving customer '+ orderHistory.customer_id);
          throw err;
        }
        debug('..Customer gcm id is '+ customer.gcm_id)
        var company = '';
        try {
          company = (yield Company.getSingleCompany(orderHistory.company_id))[0];
        } catch (err) {
          console.error('afterUpdateOrderHistory: error retrieving company '+ orderHistory.company_id);
          throw err;
        }
        debug('..Company name is '+ company.name);
        msgTarget.to = 'customer' 
        msgTarget.toId = customer.id
        msgTarget.gcmId = customer.gcm_id
        msgTarget.fcmId = customer.fcm_id
      }
      if (!msgTarget.gcmId && !msgTarget.fcmId){
        console.error('afterUpdateOrderHistory: Cannot notify! No fcm/gcm id for ' + msgTarget.to +' '+ msgTarget.toId)
        throw new Error ('Cannot notify! No fcm/gcm id for '+ msgTarget.to)
      }
      var orderNum = orderHistory.order_sys_order_id;
      orderNum = orderNum.substring(orderNum.length-4);
      debug(orderNum);
      var custName = this.passport.user.first_name +' '+ this.passport.user.last_name.charAt(0);
      debug(custName);
      debug(status);
      switch(status) {
          // From Customer
          case 'order_paid':
              msgTarget.title = "Payment Processed";
              msgTarget.message = custName +"'s payment was processed at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'pay_fail':
              msgTarget.title = "Payment Failed";
              msgTarget.message = custName +" payment failed at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          // From Unit
          case 'order_declined':
              msgTarget.title = "Order Declined";
              msgTarget.message = company.name +" did not accept your order at this time. Please try again some other time.";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_accepted':
              msgTarget.title = "Order Accepted";
              msgTarget.message =  'Pickup Time: '+  orderHistory.desired_pickup_time +'\n'  +
                                   'Customer: '+ custName +'\n'+
                                   'Order: '+ orderNum;
              msgTarget.body = "Order accepted at "+ timestamp.now();
              break;
          case 'order_in_queue':
              msgTarget.title = "Order In Queue";
              msgTarget.message = "Your order "+ orderNum +" put in queue at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'order_cooking':
              msgTarget.title = "Order Cooking";
              msgTarget.message = "Your order "+ orderNum +" started cooking at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'order_ready':
              msgTarget.title = "Order Ready";
              msgTarget.message = "Your order "+ orderNum +" is ready! Good to go at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'order_picked_up':
              msgTarget.title = "Order Picked Up";
              msgTarget.message = "Your order "+ orderNum +" was picked up at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'no_show':
              msgTarget.title = "No Show";
              msgTarget.message = "Your order "+ orderNum +" was not picked up! Did you forget?";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_dispatched':
              msgTarget.title = "Order Dispatched";
              msgTarget.message = "Your order "+ orderNum +" was dispatched at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'order_delivered':
              msgTarget.title = "Order Delivered";
              msgTarget.message = "Your order "+ orderNum +" was delivered at "+ timestamp.now() +". Thanks again!";
              msgTarget.body = msgTarget.message;
              break;
          default:
              throw new Error ('Unkown status '+ status +' for order '+ orderHistory.id)
      }
      msgTarget.status = status
      
      debug(msgTarget);
      debug('sending notification to '+ msgTarget.to +' ('+ msgTarget.toId +')');
      yield push.notifyOrderUpdated(orderNum, msgTarget);
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

function *beforeSaveCustomer(){
  debug('beforeSaveCustomer');  
  // If username or password is changed, we need to update the Users table
  var username = this.resteasy.object.username;
  var password = this.resteasy.object.password;
  if (this.resteasy.operation == 'update') {
    debug('..starting update of existing Customer'); 
    // This block of code checks to see if username/password, if provided,
    // was/were changed. If so, update User.
    if (!username && !password) {
      debug('..no update to user data');
      return;
    }
    // Otherwise username and/or password was changed
    if (!this.params.id) {
      console.error('beforeSaveCustomer: No customer id provided');
      throw new Error('No customer id provided. Update operation requires customer id')
    }
    var customer = '';
    try {
      customer = (yield Customer.getSingleCustomer(this.params.id))[0];
    } catch (err) {
      console.error('beforeSaveCustomer: Error getting existing Customer');
      throw err;
    }
    debug('..customer');
    debug(customer);
    var user = '';
    try {
      user = (yield User.getSingleUser(customer.user_id))[0];
    } catch (err) {
      console.error('beforeSaveCustomer: Error getting existing user');
      throw err;
    }
    debug('..user');
    debug(user);
    var userHash = {};
    if (username) {
      userHash.username = username;
      delete this.resteasy.object.username;
    }
    if (password) {
      userHash.password = password;
      delete this.resteasy.object.password;
    }
    debug('..updating user');
    try {
      user = (yield User.updateUser(user.id, userHash))[0];
    } catch (err) {
      console.error('beforeSaveCustomer: Error updating user');
      throw err;
    }
    debug('..user after update');
    debug(user);
  }
}

function *beforeSaveUnit() {
  debug('beforeSaveUnit');
  // If username or password is changed, we need to update the Users table
  var username = this.resteasy.object.username;
  var password = this.resteasy.object.password;
  if (this.resteasy.operation == 'create') {
    debug('..starting create of new Unit');
    // get the company context
    debug('..getting company')
    var companyId = '';
    if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
      debug('..company '+ m[1]);
      companyId = m[1];
    } else {
      // no company context is an error
      console.error('beforeSaveUnit: No company context for unit: '+ this.params.context);
      throw new Error ('No company context for unit')
    }
    if (!username || !password) {
      // need both to create new User and Unit
      console.error('beforeSaveUnit: Username/password are required');
      throw new Error ('Username/password are required');
    } 
    // make sure it's a unique username
    var existingUser = '';
    try {
      existingUser = (yield User.userForUsername(username))[0];
    } catch (err) {
      console.error('beforeSaveUnit: error during User creation');
      throw err;
    }
    debug('..user exists for username '+ username +'? Yes: user details; No: undefined');
    debug(existingUser)
    if (existingUser) {
      console.error('beforeSaveUnit: Tried to create unit with duplicate name of '+ username );
      console.error('beforeSaveUnit: Name must be unique within Unit/User tables');
      throw new Error('That name already exists. Try another name');
    }

    var unitmgr = { role: 'UNITMGR', username: username, password: password };
    var user = '';
    try {
      user = (yield User.createOrUpdateUser(unitmgr))[0];
    } catch (err) {
      console.error('beforeSaveUnit: Error creating User-UnitMgr');
      throw err;
    }
    debug('..user created');
    debug(user);
    this.resteasy.object.unit_mgr_id = user.id; 
    this.resteasy.object.company_id = parseInt(companyId);
    debug('..ready to create unit');
    debug(this.resteasy.object);
  } else if (this.resteasy.operation == 'update') {
    debug('..starting update of existing Unit');
    // This block of code checks to see if username/password, if provided,
    // was/were changed. If so, update User.
    if (!username && !password) {
      debug('..no update to user data');
      return;
    }
    var unitId = this.params.id;
    if (!unitId) {
      console.error('beforeSaveUnit: No unit id provided');
      throw new Error('No unit id provided. Update operation requires unit id')
    }
    var unit = '';
    try {
      unit = (yield Unit.getSingleUnit(this.params.id))[0];
    } catch (err) {
      console.error('beforeSaveUnit: Error getting existing unit');
      throw err;
    }
    debug('..unit');
    debug(unit);
    if (username && username != unit.username || password && password != unit.password) {
      // username or password was changed
      var user = '';
      try {
        user = (yield User.getSingleUser(unit.unit_mgr_id))[0];
      } catch (err) {
        console.error('beforeSaveUnit: Error getting existing user');
        throw err;
      }
      debug('..user');
      debug(user);
      var userHash = {};
      if (username) userHash.username = username;
      if (password) userHash.password = password;
      debug('..updating user');
      try {
        user = (yield User.updateUser(user.id, userHash))[0];
      } catch (err) {
        console.error('beforeSaveUnit: Error updating user');
        throw err;
      }
      debug('..user after update');
      debug(user);
    } 
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

function *beforeSaveUser() {
  debug('beforeSaveUser');
  debug(this.params);
  // safety check -- use id of logged in user
  debug(this.params.id);
  //this.params.id = this.passport.user.id;
  debug(this.params.id);
  var password = this.resteasy.object.password;
  debug(password);
  if (password) {
    this.resteasy.object.password = User.encryptPassword(password);
  }
  debug(this.resteasy.object);
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
        } else if (this.params.table == 'favorites' || this.params.table == 'reviews' || this.params.table == 'order_history') {
          debug('..checking POST '+ this.params.table)
          if(!this.isAuthenticated() || !this.passport.user || this.passport.user.role != 'CUSTOMER') {
            this.throw('Create Unauthorized - Customers only',401);
          } // else continue
          debug('..get customer id for user')
          var customer = (yield Customer.getForUser(this.passport.user.id))[0]
          debug(customer)
          if (!customer) {
            this.throw('Unauthorized - no such customer',401);
          } // else continue
          this.resteasy.object.customer_id = customer.id;
          console.log('..authorized')  
        }
        console.log("... create is authorized")
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
      } else if (operation == 'update' && this.params.table == 'users' && this.isAuthenticated() &&
                 this.passport.user && this.passport.user.role != 'UNITMGR') {
        debug('..authorized '+ this.passport.user.role +' to update user info');
        
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
            this.throw('Update/Delete Unauthorized - Customers/Admins only',401);
          } else {
            /* if (this.passport.user.role == 'CUSTOMER') {
              debug('..get customer id for user')
              var customer = (yield Customer.getForUser(this.passport.user.id))[0]
              debug(customer)
              if (!customer) {
                this.throw('Unauthorized - not customer',401);
              } // else continue
              this.resteasy.object.customer_id = customer.id;
            } */
            console.log('..authorized')
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
        debug('saving order_history to repository')
      } else if (this.resteasy.table == 'users') {
        yield beforeSaveUser.call(this);
      }
    },

    afterQuery: function *(res) {
      debug('afterQuery');
      debug(this.resteasy.operation)
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
      } else if (this.resteasy.operation == 'index') {
        debug('..read');
        if (this.resteasy.table == 'order_history') {
          yield afterReadOrderHistory.call(this, res[0]);
        }
      }
    },
  },

  // the apply context option allows you to specify special
  // relationships between things, in our case, /companies/:id/units,
  // for example.
  applyContext: function (query) {
    debug('applyContext')
    var context = this.params.context;
    var m;
    debug('..operation '+ this.resteasy.operation);
    debug('..table '+ this.resteasy.table);
    debug('context');
    if (!context) debug('..no context')
    else debug(context);
    if (this.resteasy.operation == 'index') {
      if (this.resteasy.table == 'units' && context && (m = context.match(/companies\/(\d+)$/))) {
        debug('..company id '+ m[1])
        return query.select('*').where('company_id', m[1]);
      } else if (this.resteasy.table == 'favorites') {
        debug('..read favorites');
        debug(this.resteasy.object);
        var custId = this.resteasy.object.customer_id;
        var coId   = this.resteasy.object.company_id;
        var unitId = this.resteasy.object.unit_id;
        // doing this the hard way
        debug('..modify query');
        if (custId) {
          debug('..customer id '+ custId);
          return query.select('*').where('customer_id', custId);
        } else if (unitId) {
          debug('..unit id '+ unitId);
          return query.select('*').where('unit_id', unitId);
        } else if (coId) {
          debug('..company id '+ coId);
          return query.select('*').where('company_id', coId);
        }
      }
    }
  },
};
