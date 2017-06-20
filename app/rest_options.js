var _ = require('lodash');
var Queries = require('../koa-resteasy').Queries;
var Company = require('./models/company.server.model');
var Customer = require('./models/customer.server.model');
var DeliveryAddress = require('./models/deliveryaddress.server.model');
var Favorites = require('./models/favorites.server.model');
var Loyalty = require('./models/loyalty.server.model');
var LoyaltyRewards = require('./models/loyaltyrewards.server.model');
var OrderHistory = require('./models/orderhistory.server.model');
var Reviews = require('./models/reviews.server.model');
var User = require('./models/user.server.model');
var config = require('../config/config');
var msc = require('./controllers/moltin.server.controller');
var payload = require('./utils/payload');
var timestamp = require('./utils/timestamp');
var translator = require('./utils/translate');
var push = require('./controllers/push.server.controller');
var User = require('./models/user.server.model');
var Unit = require('./models/unit.server.model');
var debug = require('debug')('rest_options');
var logger = require('winston');



function *simplifyDetails(orderDetail) {
  logger.info('Simplifying order details', {fn: 'simplifyDetails',
    user_id: this.passport.user.id, role: this.passport.user.role});
  if (!orderDetail) {
    logger.error('No order details provided',
        {fn: 'simplifyDetails', user_id: this.passport.user.id, role: this.passport.user.role,
         error: 'Missig order details'});
    return '';
  }
  var items = orderDetail;
  debug('array length '+ items.length);
  logger.info('Processing '+ items.length + ' items in order', {fn: 'simplifyDetails',
    user_id: this.passport.user.id, role: this.passport.user.role, num_items: items.length});
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
      quantity : item.quantity
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
          var titles = [];
          if (mod.type.value == 'Variant') {
            for (var k in mod.variations) {
              var variation = mod.variations[k]
              debug('... variant '+ variation.title);
              debug('...'+ variation.id);
              titles.push(variation.title);
            }
            itemDetail.selections[mod.title]=titles
          } else if (mod.type.value =='Single') {
            for (var k in mod.variations) {
              var variation = mod.variations[k]
              debug('... option '+ variation.title);
              debug('... id '+ variation.id);
              debug('... parent '+ variation.modifier);
              var options = item.options[variation.modifier];
              if (options && options[variation.id] ) {
                debug('... option '+ variation.title +' was selected');
                titles.push(variation.title);
              }
            }
            itemDetail.options = titles;
          }
        }
      }
    }
    debug('... add item detail to list ');
    debug(itemDetail);
    menuItems[item.id] = itemDetail;
    debug(menuItems);
  }
  logger.info('Order details simplified', {fn: 'simplifyDetails',
    user_id: this.passport.user.id, role: this.passport.user.role});
  debug(menuItems);
  return menuItems;
}

function * calculateDeliveryPickup(unitId, deliveryTime) {
  logger.info('Calculating delivery pickup', {fn: 'calculateDeliveryPickup',
    user_id: this.passport.user.id, role : this.passport.user.role, unit_id: unitId,
    delivery_time: deliveryTime});
  var pickup = '';
  if (deliveryTime) {
    var delivery = new Date(deliveryTime);
    var unit = '';
    try {
      unit = (yield Unit.getSingleUnit(unitId))[0];
      debug('..unit');
      debug(unit);
    } catch (err) {
      logger.error('Error getting unit',
          {fn: 'calculateDeliveryPickup', user_id: this.passport.user.id,
          role: this.passport.user.role, error: err});
      throw err;
    }
    if (unit.delivery_time_offset) {
      pickup = new Date( delivery.getTime() - unit.delivery_time_offset * 60000);
    } else {
      pickup = new Date(delivery.getTime() - config.deliveryOffset * 60000);
    }
    debug('..delivery pickup time is '+ pickup.toISOString());
  }
  var puTime = pickup.toISOString();
  logger.info('Delivery pickup time '+ puTime,
    {fn: 'calculateDeliveryPickup', user_id: this.passport.user.id, role: this.passport.user.role,
    unit_id: unitId, delivery_time: deliveryTime, pickup_time: puTime });
  /*logger.info('Delivery pickup time '+ pickup.toIsoString(),
    {fn: 'calculateDeliveryPickup', user_id: this.passport.user.id, role :
    this.passport.user.role, unit_id: unitId, delivery_time: deliveryTime,
    pickup_time: pickup.toISOString()});*/
  return pickup;
}

function *beforeSaveOrderHistory() {
  debug('beforeSaveOrderHistory');
  debug(this.resteasy.object);
  debug('..operation '+ this.resteasy.operation)
  debug(this.passport.user.role)
  logger.info('Prepare to save order ',
    {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id, role :
    this.passport.user.role, order_sys_order_id: this.resteasy.object.order_sys_order_id});



  if (this.resteasy.operation == 'create') {
    if (this.passport.user.role != 'CUSTOMER') {
      logger.error('User unauthorized',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, error: 'User unauthorized'});
      throw new Error('User unauthorized', 401);
    }
    var osoId = this.resteasy.object.order_sys_order_id;
    if (! this.resteasy.object.order_sys_order_id) { // is required
      logger.error('No order id provided for e-commerce system',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, error: 'Missing e-commerce (order_sys) order id'});
      throw new Error('order_sys_order_id is required', 422);
    }
      debug('...create')
    debug('..getting customer name')
    try {
      debug('..user ')
      debug(this.passport.user)
      var user = this.passport.user
      var customer = (yield Customer.getForUser(user.id))[0]
      debug('..customer')
      debug(customer)
    } catch (err) {
      logger.error('Error getting customer',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, order_sys_order_id: osoId, error: err});
      throw err;
    }
    var customerName = user.first_name + " " + user.last_name.charAt(0)
    debug("..customer name is "+ customerName);
    this.resteasy.object.customer_name = customerName;
    this.resteasy.object.customer_id = customer.id;

    logger.info('Order by customer '+ customerName,
      {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id, role :
      this.passport.user.role, order_sys_order_id: osoId});
    //set company
    debug('..get company id');
    if (!this.resteasy.object.company_id) {
      debug(this.params.context)
      var coId = this.params.context.match(/companies\/(\d+)\//)
      debug(coId)
      this.resteasy.object.company_id = coId[1];
    }
    var coId = this.resteasy.object.company_id;
    debug('..getting company name')
    var company = '';
    try {
      debug('..company id ');
      debug(coId);
      company = (yield Company.getSingleCompany(coId))[0];
      debug('..company');
      debug(company);
    } catch (err) {
      logger.error('Error getting company',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, error: err});
      throw err;
    }
    debug("..company name is "+ company.name);
    this.resteasy.object.company_name = company.name;

    logger.info('Order for company '+ company.name,
      {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
      role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId});

    //set unit
    debug('..get unit id');
    var unitId = '';
    if (!this.resteasy.object.unit_id) {
      debug(this.params.context)
      unitId = this.params.context.match(/units\/(\d+)/);
      debug(unitId);
      unitId = unitId[1];
      debug(unitId);
      this.resteasy.object.unit_id = unitId;
    }
    logger.info('Order for unit '+ unitId,
      {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
      role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, unit_id: unitId});

    // get order details and streamline for display
    var moltin_order_id = osoId
    debug('..order sys order id: '+ moltin_order_id)
    try {
      var order = yield msc.findOrder(moltin_order_id)
      var order_details = yield msc.getOrderDetail(moltin_order_id)
      order_details = yield simplifyDetails.call(this, order_details)
    } catch (err) {
      logger.error('Error retrieving order items from ecommerce system ',
        {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
        role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, unit_id: unitId,
        error: err});
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

    // Handle delivery details
    if (this.resteasy.object.for_delivery) {
      debug('..delivery order')
      if (!this.resteasy.object.delivery_address_id) {
        logger.error('No delivery address provided',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, unit_id: unitId,
          error: 'No delivery address provided'});
        throw new Error('No delivery address provided', 422);
      }
      // Get and streamline address for display
      var addrDetails = '';
      try {
        addrDetails = (yield DeliveryAddress.getSingleAddress(this.resteasy.object.delivery_address_id))[0];
      } catch (err) {
        logger.error('Error getting delivery address',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, unit_id: unitId,
          delivery_address_id: this.resteasy.object.delivery_address_id, error: err});
        throw(err)
      }
      debug(addrDetails);
      var details = {
        nickname : addrDetails.nickname,
        address1 : addrDetails.address1,
        address2 : addrDetails.address2,
        city     : addrDetails.city,
        state    : addrDetails.state,
        phone    : addrDetails.phone
      };
      debug(details);
      this.resteasy.object.delivery_address_details = details;

      // Set time to pickup up by delivery driver
      var deliveryTime = this.resteasy.object.desired_delivery_time;
      if (deliveryTime) {
        var pickup = '';
        try {
          pickup = yield calculateDeliveryPickup.call(this, this.resteasy.object.unit_id,
                                                 this.resteasy.object.desired_delivery_time);
        } catch (err) {
          logger.error('Error calculating delivery pickup time',
            {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
            role: this.passport.user.role, order_sys_order_id: osoId, company_id: coId, unit_id: unitId,
            delivery_address_id: this.resteasy.object.delivery_address_id,
            delivery_time: deliveryTime, error: err});
          throw (err);
        }
        this.resteasy.object.desired_pickup_time = pickup;
      }
    }

    // Ready to save
    debug(this.resteasy.object)
    debug('...preprocessing complete. Ready to save')
  } else if (this.resteasy.operation == 'update') {
    debug('...update')
    debug('...limit payload elements')
    try {
      // this will modify this.resteasy.object
      yield payload.limitOrderHistPayloadForPut(this.resteasy.object)
    } catch (err) {
      logger.error('Error limiting order payload for PUT',
        {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
        role: this.passport.user.role, order_id: this.params.id, error: err});
      throw(err)
    }
    debug('..limited payload is..')
    debug(this.resteasy.object)
    if (this.resteasy.object.status) {
      var newStat = this.resteasy.object.status;
      debug('..status sent is '+ newStat)
      logger.info('PUT includes a status update ',
        {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
        role: this.passport.user.role, order_id: this.params.id, new_status: newStat});
      try {
        var savedStatus = (yield OrderHistory.getStatus(this.params.id))[0]
      } catch (err) {
        logger.error('Error getting prior order status',
          {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
          role: this.passport.user.role, order_sys_order_id: osoId,
          new_status: this.resteasy.object.status,
          delivery_time: deliveryTime, error: 'Error getting prior order status'});
        throw(err)
      }
      debug (savedStatus)
      logger.info('Got previous statuses',
        {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
        role: this.passport.user.role, order_id: this.params.id, new_status: newStat});
      if (!savedStatus.status[newStat]) {
        // add subsequent state
        savedStatus.status[newStat] = ''
      } // else previously set
      debug(savedStatus)
      this.resteasy.object.status = savedStatus.status;
    } else {
      debug('...not a status update')
      logger.info('PUT does not involve a status update '+ unitId,
        {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
        role: this.passport.user.role, order_sys_order_id: osoId});
    }
  }
  logger.info('Pre-flight for order save completed '+ unitId,
    {fn: 'beforeSaveOrderHistory', user_id: this.passport.user.id,
    role: this.passport.user.role, order_sys_order_id: osoId});
  debug('returning from beforeSaveOrderHistory');
}


function *afterCreateOrderHistory(orderHistory) {
  debug('afterCreateOrderHistory')
  debug(orderHistory);
  var meta = {fn: 'afterCreateOrderHistory',user_id: this.passport.user.id,role: this.passport.user.role}
  meta.order_id = orderHistory.id;
  meta.company_id = orderHistory.company_id;
  meta.unit_id = orderHistory.unit_id;
  meta.customer_id = orderHistory.customer_id;
  var osoId = orderHistory.order_sys_order_id;
  meta.order_sys_order_id = osoId;

  logger.info('Post order creation processing started for order '+ orderHistory.id, meta);
  var unit = '';
  try {
    unit = (yield Unit.getSingleUnit(orderHistory.unit_id))[0];
  } catch (err) {
    var ue = meta;
    ue.error = err;
    logger.error('Error retrieving unit', ue);
    throw err;
  }
  debug(unit);
  if (!unit.gcm_id && !unit.fcm_id) {
    var fge = meta;
    fge.error = 'No fcm/gcm for unit';
    logger.error('No fcm/gcm id for unit ', orderHistory.unit_id, fge);
    throw new Error ('No fcm/gcm id for unit '+ unit.name +' ('+ unit.id +'). Cannot notify')
  }

  var customer = '';
  try {
    customer = (yield Customer.getSingleCustomer(orderHistory.customer_id))[0];
  } catch (err) {
    var ce = meta;
    ce.error = err;
    logger.error('Error retrieving customer', ce);
    throw err;
  }
  debug(customer);

  var orderDetail = JSON.stringify(orderHistory.order_detail, null, 2);
  debug(orderDetail);
  var pickuptime = orderHistory.desired_pickup_time.toISOString();
  var msg = 'Pickup Time: '+ pickuptime +'\n'+
            'Customer: '+ this.passport.user.first_name +' '+ this.passport.user.last_name.charAt(0) +'\n'+
            'Order Details: ' + orderDetail +'\n';
  debug('msg');
  debug(msg);
  var msgTarget = {
    to     : 'unit',
    toId   : unit.id,
    gcmId  : unit.gcm_id,
    fcmId  : unit.fcm_id,
    title  : "Order Requested",
    message : msg,
    body : msg,
    status : "order_requested"
  }
  debug('sending notification to unit '+ unit.id);
  debug('hello');
  debug(meta);
  var mm = meta;
  debug(mm);
  mm.message = msg;
  debug(mm);
  logger.info('sending notification to unit '+ unit.id, mm);

  var orderNum = orderHistory.order_sys_order_id;
  orderNum = orderNum.substring(orderNum.length-4);
  yield push.notifyOrderUpdated(orderNum, msgTarget)
  debug('..returned from notifying')

  logger.info('Unit '+ unit.id +' notified of order '+ orderNum, meta);
  debug(timestamp.now());
  var hash = {
    status : {
      order_requested: timestamp.now()
    }
  }
  this.resteasy.queries.push(
    this.resteasy.transaction.table('order_history').where('order_history.id', orderHistory.id).update(hash)
  );
  logger.info('Post order creation processing completed for order '+ orderHistory.id, meta);
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

  var meta = {fn: 'afterUpdateOrderHistory',user_id: this.passport.user.id,role: this.passport.user.role}
  meta.order_id = orderHistory.id;
  meta.company_id = orderHistory.company_id;
  meta.unit_id = orderHistory.unit_id;
  meta.customer_id = orderHistory.customer_id;
  var osoId = orderHistory.order_sys_order_id;
  meta.order_sys_order_id = osoId;
  meta.status = orderHistory.status;
  var lang = this.passport.user.default_language;

  logger.info('Post order update processing started for order '+ orderHistory.id, meta);
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
      logger.info('Notification not yet sent for status '+status+' for order '+ orderHistory.id, meta);
      debug('...status '+ status)
      var customer ='';
      try {
        customer = (yield Customer.getSingleCustomer(orderHistory.customer_id))[0];
      } catch (err) {
        var ce = meta;
        ce.error = err;
        logger.error('Error retrieving customer ', orderHistory.customer_id, ce);
        throw err;
      }
      debug(customer);
      var user ='';
      try {
        user = (yield User.getSingleUser(customer.user_id))[0];
      } catch (err) {
        var ue = meta;
        ue.error = err;
        logger.error('Error retrieving user ', customer.user_id, ue);
        throw err;
      }
      debug(user);
      var company = '';
      try {
        company = (yield Company.getSingleCompany(orderHistory.company_id))[0];
      } catch (err) {
        var coe = meta;
        coe.error = err;
        logger.error('Error retrieving company ', orderHistory.company_id, coe);
        throw err;
      }
      debug(company);
      var msgTarget = { order_id : orderHistory.id }
      if (status == 'order_paid' || status == 'pay_fail') {
        debug('...status update from customer. Notify unit');
        logger.info('Customer order update. Notify unit', meta);
        // get unit
        try {
          var unit = (yield Unit.getSingleUnit(orderHistory.unit_id))[0];
        } catch (err) {
          var eru = meta;
          eru.error = err;
          logger.error('Error retrieving unit ', orderHistory.unit_id, eru);
          throw err;
        }
        debug('..Unit gcm id is '+ unit.gcm_id)
        msgTarget.to = 'unit'
        msgTarget.toId = unit.id
        msgTarget.gcmId = unit.gcm_id
        msgTarget.fcmId = unit.fcm_id
      } else {
        debug('...status update from unit. Notify customer '+ orderHistory.customer_id);
        logger.info('Unit order update. Notify customer', meta);
        // get customer device id
        debug('..Customer gcm id is '+ customer.gcm_id)
        msgTarget.to = 'customer'
        msgTarget.toId = customer.id
        msgTarget.gcmId = customer.gcm_id
        msgTarget.fcmId = customer.fcm_id
      }
      if (!msgTarget.gcmId && !msgTarget.fcmId){
        var fge = meta;
        fge.error = 'No fcm/gcm for '+ msgTarget.to;
        logger.error('No fcm/gcm id for '+ msgTarget.to + ' ' + msgTarget.toId, fge);
        throw new Error ('Cannot notify! No fcm/gcm id for '+ msgTarget.to);
      }
      var orderNum = osoId;
      orderNum = orderNum.substring(orderNum.length-4);
      debug('..order number '+ orderNum);
      var custName = user.first_name +' '+ user.last_name.charAt(0);
      debug(custName);
      debug(status);
      switch(status) {
          // From Customer
          case 'order_paid':
              msgTarget.title = translator.translate(lang, "payProcessed", orderNum);//"Payment Processed - Order #"+ orderNum;
              msgTarget.message = custName +"'s payment was processed at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          case 'pay_fail':
              msgTarget.title = translator.translate(lang, payFailed, orderNum);//"Payment Failed - Order #"+ orderNum;
              msgTarget.message = custName +" payment failed at "+ timestamp.now();
              msgTarget.body = msgTarget.message;
              break;
          // From Unit
          case 'order_declined':
              msgTarget.title = "Order Declined";
              msgTarget.message = translator.translate(lang, "orderDeclined", company.name);//company.name +" did not accept your order at this time. Please try again some other time.";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_accepted':
              msgTarget.title = "Order Accepted";
              msgTarget.message =  'Pickup Time: '+  orderHistory.desired_pickup_time +'\n'  +
                                   'Customer: '+ custName +'\n'+
                                   'Order: '+ orderNum;
              msgTarget.body = translator.translate(lang, "orderAccepted", timestamp.now());//"Order accepted at "+ timestamp.now();
              break;
          case 'order_in_queue':
              msgTarget.title = "Order In Queue";
              msgTarget.message = translator.translate(lang, "orderQueued", orderNum);//Your order #"+ orderNum +" is queued for preparation";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_cooking':
              msgTarget.title = "Order Cooking";
              msgTarget.message = translator.translate(lang, "orderCooking", orderNum);//"Your order #"+ orderNum +" started cooking";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_ready':
              msgTarget.title = "Order Ready";
              msgTarget.message = translator.translate(lang, "orderReady", orderNum); //Your order #"+ orderNum +" is ready!";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_picked_up':
              msgTarget.title = "Order Picked Up";
              msgTarget.message = translator.translate(lang, "orderPickedUp", orderNum);// "Your order #"+ orderNum +" was picked up!";
              msgTarget.body = msgTarget.message;
              break;
          case 'no_show':
              msgTarget.title = "No Show";
              msgTarget.message = translator.translate(lang, "orderNotPickedUp", orderNum);//"Your order #"+ orderNum +" was not picked up! Did you forget?";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_dispatched':
              msgTarget.title = "Order Dispatched";
              msgTarget.message = translator.translate(lang, "orderDispatched", orderNum);//"Your order #"+ orderNum +" is on its way!";
              msgTarget.body = msgTarget.message;
              break;
          case 'order_delivered':
              msgTarget.title = "Order Delivered";
              msgTarget.message = translator.translate(lang, "orderDelivered", orderNum);//"Your order #"+ orderNum +" was delivered. Thanks again!";
              msgTarget.body = msgTarget.message;
              break;
          default:
            var eso = meta;
            eso.error = 'Unknown status for order ';
            logger.error('Unknown status for order ', fge);
            throw new Error ('Unknown status '+ status +' for order #'+ orderHistory.id)
      }
      debug(msgTarget);
      var supplemental = {};
      supplemental.unit_id = ''+ orderHistory.unit_id;
      supplemental.company_id = ''+ orderHistory.company_id;
      supplemental.order_sys_order_id = orderHistory.order_sys_order_id;
      supplemental.order_id = ''+ orderHistory.id;
      msgTarget.data = supplemental;
      msgTarget.status = status

      debug(msgTarget);
      debug('sending notification to '+ msgTarget.to +' ('+ msgTarget.toId +')');


      var mt = meta;
      mt.message_payload = msgTarget.message;

      logger.info('sending notification to unit '+ orderHistory.unit_id, mt);

      yield push.notifyOrderUpdated(orderNum, msgTarget);

      logger.info(msgTarget.to +' notified of order '+ orderHistory.id, meta);

      debug('..returned from notifying');

      // record notification time
      orderHistoryStatus[keys[i]] = timestamp.now();
      debug(orderHistoryStatus)
      updated = true;

      // grant loyalty points
      if (status == 'order_paid') {
        var priorBalance = (yield Loyalty.getPointBalance(orderHistory.customer_id, orderHistory.company_id))[0];
        if (!priorBalance) {
          logger.info('creating new loyalty points record for customer ' + orderHistory.customer_id + ' at company ' + orderHistory.company_id);
          var initBalance = '1';
          var newLoyalty = (yield Loyalty.createNew(orderHistory.customer_id, orderHistory.company_id, initBalance))[0];
          debug(newLoyalty);
        } else {
          debug(priorBalance);
          logger.info('incrementing loyalty points for customer ' + orderHistory.customer_id + ' at company ' + orderHistory.company_id);

          var priorBalValue = parseInt(priorBalance.balance);
          var updatedBalValue = priorBalValue + 1;
          var isEligible_five = false;
          var isEligible_ten = false;
          var isEligible_fifteen = false;
          if (updatedBalValue >= 5) {
            isEligible_five = true;
          }
          if (updatedBalValue >= 10) {
            isEligible_ten = true;
          }
          if (updatedBalValue >= 15) {
            isEligible_fifteen = true;
          }
          var incrementedLoyalty = {
            balance: updatedBalValue,
            eligible_five: isEligible_five,
            eligible_ten: isEligible_ten,
            eligible_fifteen: isEligible_fifteen,
            updated_at: this.resteasy.knex.fn.now()
          };

          this.resteasy.queries.push(
            this.resteasy.transaction.table('loyalty').where('loyalty.id', priorBalance.id).update(incrementedLoyalty)
          );
        }
      }
    }
  }
  if (updated) {
    debug(orderHistoryStatus)
    this.resteasy.queries.push(
      this.resteasy.transaction.table('order_history').where('order_history.id', orderHistory.id).update({ status: orderHistoryStatus})
    );
  }
  logger.info('Post order update processing completed for order '+ orderHistory.id, meta);
}

function *beforeSaveReview() {
  debug('beforeSaveReview: user is ')
  debug(this.passport.user)
  // Get the user's first name and initial of last name for the reviewer_name field.
  // The code also handles cases where only a first name or only a last name is provided.
  // Must have either defined, else a 403 Forbidden is returned, without saving the review.
  var firstName = '';
  var lastName = '';
  var separator = '';
  var initialLast = '';
  if (this.passport.user.first_name) {
    firstName = this.passport.user.first_name.trim();
  }
  if (this.passport.user.last_name) {
    lastName = this.passport.user.last_name.trim();
    if (lastName.length > 0) {
      initialLast = lastName.charAt(0) + '.';
    }
  }
  if (firstName == '' && lastName == '') {
    this.throw('Save review rejected because a first name or last name is not defined in user account',403);
  } else if (firstName.length >= 1 && initialLast.length >=1) {
    separator = ' ';
  }
  this.resteasy.object.reviewer_name = firstName + separator + initialLast;

  var answersField = this.resteasy.object.answers;
  if (answersField) {
    var answers = answersField.answers;

    if (answers && answers.length) {
      debug('answers length: ' + answers.length);
      var total = 0.0;
      for (var i = 0; i < answers.length; i++) {
        total += answers[i].answer;
      }
      this.resteasy.object.rating = total / answers.length;
      debug('Review rating calculated as: ' + total);
    } else {
      console.log('Review rating not calculated - unexpected answers value: ' + answers);
    }
  } else {
    console.log('Review rating not calculated - answersField is null');
  }
}


function *beforeSaveCustomer(){
  debug('beforeSaveCustomer');
  logger.info('Saving customer', {fn: 'beforeSaveCustomer',
    user_id: this.passport.user.id, role : this.passport.user.role});
  if (this.resteasy.operation == 'update') {
    // If APNS id provided, retrieve and set GCM id
    if (this.resteasy.object.apns_id) {
      var gcmId = '';
      try {
        gcmId = yield push.importAPNS.call(this,this.resteasy.object.apns_id);
      } catch (err) {
        logger.error('Error sending APNS token to GCM',
            {fn: 'beforeSaveCustomer', user_id: this.passport.user.id,
            role: this.passport.user.role, error: err});
        throw err;
      }
      // Set Customer's gcm to that mapped to the apns token just pushed to Google
      this.resteasy.object.gcm_id = gcmId;
    }

    // If username or password is changed, we need to update the Users table
    var username = this.resteasy.object.username;
    var password = this.resteasy.object.password;
    if (username || password) {
    // Username and/or password was changed
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
     // If APNS id provided, retrieve and set GCM id
    if (this.resteasy.object.apns_id) {
      var gcmId = '';
      try {
        gcmId = yield push.importAPNS.call(this,this.resteasy.object.apns_id);
      } catch (err) {
        logger.error('Error sending APNS token to GCM',
            {fn: 'beforeSaveUnit', user_id: this.passport.user.id,
            role: this.passport.user.role, unit_id: this.params.id, error: err});
        throw err;
      }
      // Set Unit's gcm to that mapped to the apns token just pushed to Google
      this.resteasy.object.gcm_id = gcmId;
    }
    // This block of code checks to see if username/password, if provided,
    // was/were changed. If so, update User.
    if (username || password) {
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
}

function *beforeSaveCompanies() {
  debug('beforeSaveCompanies');
  debug(this.resteasy.object);
  debug(this.params);
  if (this.resteasy.operation == 'update') {
    debug('...update');
    debug('...limit payload elements');
    try {
      // this will modify this.resteasy.object
      yield payload.limitCompanyPayloadForPut(this.resteasy.object)
    } catch (err) {
      console.error(err)
      throw(err)
    }
    var company = (yield Company.getSingleCompany(this.params.id))[0];
    debug('company '+ company.id);
    if (this.resteasy.object.delivery_chg_amount && company.delivery_chg_amount != this.resteasy.object.delivery_chg_amount) {

      var amount = this.resteasy.object.delivery_chg_amount;
      debug('..delivery charge amount has changed to '+ amount +'. Updating..')
      // Update moltin
      var item = '';
      var data = { price: amount};
      try {
          item = yield msc.updateMenuItem(company.delivery_chg_item_id, data)
      } catch (err) {
        console.error(err);
        throw new Error ('Error updating delivery charge in ordering system');
      }
      debug('..delivery charge updated')
    }
  }
}

function *beforeSaveDriver() {
  debug('beforeSaveDriver');
  debug(this.resteasy.object);
  debug(this.params);
  if (this.resteasy.operation == 'create') {
    debug('...create');
    debug('..getting company')
    var companyId = '';
    if (this.params.context && (m = this.params.context.match(/companies\/(\d+)/))) {
      debug('..company '+ m[1]);
      companyId = m[1];
    } else {
      // no company context is an error
      console.error('beforeSaveDrivers: No company context for driver: '+ this.params.context);
      throw new Error ('No company context for driver')
    }
    var unitId = '';
    if (this.params.context && (n = this.params.context.match(/units\/(\d+)$/))) {
      debug('..unit '+ n[1]);
      unitId = n[1];
    } else {
      // no unit context is an error
      console.error('beforeSaveDrivers: No unit context for driver: '+ this.params.context);
      throw new Error ('No unit context for driver')
    }

    this.resteasy.object.company_id = companyId;
    this.resteasy.object.unit_id = unitId;
  }
}

function *beforeSaveLoyaltyRewards() {
  debug('beforeSaveLoyaltyRewards');
  if (this.resteasy.operation == 'create') {
    if (this.params.context && (m = this.params.context.match(/companies\/(\d+)$/))) {
      var coId = m[1];
      debug('..company id '+ coId);
      var exists = (yield LoyaltyRewards.isCompanyFound(coId))[0];
      debug('..LoyaltyRewards.isCompanyFound: ')
      debug(exists);
      // if vendor already has loyalty rewards defined for their company ID, do not allow a second set to be saved.
      if (exists) {
        this.throw('Company has existing rewards defined. Use PUT/PATCH to modify.',405);
      }
      this.resteasy.object.company_id = coId;
    } else {
      this.throw('No company context found for loyalty rewards',422);
    }
  }
}

function *beforeSaveUser() {
  debug('beforeSaveUser');
  if (this.passport.user.role!='ADMIN' && this.passport.user.id != this.params.id) {
    console.error('beforeSaveUser: Logged-in user id does not match param user id');
    throw new Error('Param id does not match logged-in user credentials');
  }
  var password = this.resteasy.object.password;
  debug(password);
  if (password) {
    this.resteasy.object.password = User.encryptPassword(password);
  }
  debug(this.resteasy.object);
}

function *afterCreateReview(review) {
  var reviewApproval = { review_id: review.id, status: 'New', updated_at: this.resteasy.knex.fn.now(), created_at: this.resteasy.knex.fn.now() };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('review_approvals')
      .insert(reviewApproval)
  );
}

function *afterCreateLoyaltyUsed(loyaltyUsed) {
  if (!loyaltyUsed) {
    throw new Error('Parameter loyaltyUsed must be defined');
  }
  logger.info('afterCreateLoyaltyUsed - subtracting redeemed loyalty points for customer ' + loyaltyUsed.customer_id + ', company ' + loyaltyUsed.company_id);
  var priorBalance = (yield Loyalty.getPointBalance(loyaltyUsed.customer_id, loyaltyUsed.company_id))[0];
  if (!priorBalance) {
    throw new Error('Unable to get loyalty point balance for customer ' + loyaltyUsed.customer_id + ', company ' + loyaltyUsed.company_id);
  }
  var oldBal = parseInt(priorBalance.balance);
  var newBal = oldBal - parseInt(loyaltyUsed.amount_redeemed);
  var isEligible_five = false;
  var isEligible_ten = false;
  var isEligible_fifteen = false;
  if (newBal >= 5) {
    isEligible_five = true;
  }
  if (newBal >= 10) {
    isEligible_ten = true;
  }
  if (newBal >= 15) {
    isEligible_fifteen = true;
  }
  var updateLoyalty = {
    balance: newBal,
    eligible_five: isEligible_five,
    eligible_ten: isEligible_ten,
    eligible_fifteen: isEligible_fifteen,
    updated_at: this.resteasy.knex.fn.now()
  }
  debug(updateLoyalty);
  this.resteasy.queries.push(
    this.resteasy.transaction.table('loyalty').where('id', priorBalance.id)
      .update(updateLoyalty)
  );
  debug('afterCreateLoyaltyUsed success');
}

function *afterUpdateReviewApproval(approval) {
  debug('begin afterUpdateReviewApproval function');
  var hash = { status: approval.status };

  this.resteasy.queries.push(
    this.resteasy.transaction.table('reviews').where('id', approval.review_id).update(hash)
  );

  // Recalculate company rating
  if (approval.status == "Approved") {
    var companyId = (yield Reviews.getCompanyId(approval.review_id))[0];
    if (companyId) {
      var averageRating = (yield Reviews.getAverageRating(companyId.company_id, approval.review_id))[0];
      if (averageRating) {
        debug('average rating is now ' + averageRating.avg_rating + ' for company ID ' + companyId.company_id);
        var updateCompanyRating = { calculated_rating: averageRating.avg_rating };

        this.resteasy.queries.push(
          this.resteasy.transaction.table('companies').where('id', companyId.company_id).update(updateCompanyRating)
        );
      } else {
        console.log('Unable to get avg rating for company '+ companyId.company_id);
      }
    }
  }
}

function *afterReadOrderHistory(orderHistory) {
  debug('afterReadOrderHistory')
  if (orderHistory && orderHistory.order_sys_order_id && !orderHistory.order_detail) {
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

function *validUnitMgr(params, user) {
  debug('validUnitMgr');
  var compId = '';
  var unitId = '';
  if (params.context && (m = params.context.match(/companies\/(\d+)/))) compId = m[1];

  if (params.table=="units") {
    unitId = params.id;
  } else { // some other table with unit in the context
    if (params.context && (n = params.context.match(/units\/(\d+)$/))) unitId = n[1];
  }
  if (!compId) {
    console.error('No company id provided for unit');
    throw new Error('No company id provided for unit',422);
  }
  if (!unitId) {
    console.error('No unit id provided');
    throw new Error('No unit ide provided', 422);
  }
  debug('.. for company '+ compId);
  debug('.. for unit '+ unitId);
  var valid = (yield Unit.verifyUnitManager(compId, unitId, user.id))[0]
  debug('..unit manager is '+ valid);
  if (!valid) {
    return false;
  } // else continue
  return true;
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
        } else if (this.params.table == 'drivers') {
          if(!this.isAuthenticated() || !this.passport.user ||
              (this.passport.user.role != 'OWNER' && this.passport.user.role != 'ADMIN'  && this.passport.user.role != 'UNITMGR')) {
            this.throw('Create Unauthorized - Unit Manager/Owners/Admin only',401);
          }
          var valid = yield validUnitMgr(this.params, this.passport.user);
          if (!valid) {
            this.throw('Update Unauthorized - incorrect Unit Manager',401);
          } // else continue
          console.log("...authorized")
        } else if (this.params.table == 'delivery_addresses' || this.params.table == 'favorites' ||
                   this.params.table == 'reviews' || this.params.table == 'order_history' || this.params.table == 'loyalty_used') {
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
        } else if (this.params.table == 'loyalty') {
          this.throw('Create Unauthorized', 401); // loyalty create is only allowed in-code when order state is 'order_paid'
        }
        console.log("... create is authorized")
      } else if (operation == 'update' && this.params.table == 'units' && this.isAuthenticated() && this.passport.user && this.passport.user.role == 'UNITMGR') {
        debug('unit mgr update');
        var valid = yield validUnitMgr(this.params, this.passport.user);
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
              if (!valid) {
                this.throw('Update/Delete Unauthorized - incorrect Owner',401);
              } // else continue
            }
          }
        }  else if (this.params.table == 'drivers') {
          if(!this.isAuthenticated() || !this.passport.user ||
             (this.passport.user.role != 'OWNER' && this.passport.user.role != 'ADMIN' && this.passport.user.role != 'UNITMGR')) {
            this.throw('Update/Delete Unauthorized - Unit Managers/Owners/Admin only',401);
          } else {
            var valid = yield validUnitMgr(this.params, this.passport.user);
            if (!valid) {
              this.throw('Update Unauthorized - incorrect Unit Manager',401);
            } // else continue
            console.log("...authorized");
          }
        } else if (this.params.table == 'customers' ||  this.params.table == 'delivery_addresses' ||
                   this.params.table == 'favorites' || this.params.table == 'reviews') {
          if(!this.isAuthenticated() || !this.passport.user || (this.passport.user.role != 'CUSTOMER' && this.passport.user.role != 'ADMIN')) {
            this.throw('Update/Delete Unauthorized - Customers/Admins only',401);
          } else {
            console.log('..authorized')
          }
        } else if (this.params.table == 'loyalty' || this.params.table == 'loyalty_used') {
          // loyalty update only allowed in-code when order state is 'order_paid'
          // loyalty_used should never need to be updated, as it is a transaction registry.
          this.throw('Update/Delete Unauthorized', 401);
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
        debug('saving reviews')
        yield beforeSaveReview.call(this);
      } else if (this.resteasy.table == 'drivers') {
        debug('saving drivers')
        yield beforeSaveDriver.call(this);
      } else if (this.resteasy.table == 'units') {
        debug('saving units')
        yield beforeSaveUnit.call(this);
      } else if (this.resteasy.table == 'loyalty_rewards') {
        debug('saving loyalty rewards')
        yield beforeSaveLoyaltyRewards.call(this);
      } else if (this.resteasy.table == 'companies') {
        debug('saving companies')
        yield beforeSaveCompanies.call(this);
      } else if (this.resteasy.table == 'customers') {
        debug('saving customers')
        yield beforeSaveCustomer.call(this);
      }else if (this.resteasy.table == 'order_history') {
        debug('saving order_history')
        yield beforeSaveOrderHistory.call(this);
        debug('saving order_history to repository')
      } else if (this.resteasy.table == 'users') {
        debug('saving users')
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
        } else if (this.resteasy.table == 'loyalty_used') {
          yield afterCreateLoyaltyUsed.call(this, res[0]);
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
          if (this.params.id) { // specific order history
            yield afterReadOrderHistory.call(this, res[0]);
          } // else retrieve all
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
        debug('..company id '+ m[1]);
        return query.select('*').where('company_id', m[1]);
      } else if (this.resteasy.table == 'order_history' && context
                && (m = context.match(/companies\/(\d+)/))
                && (n = context.match(/units\/(\d+)/))) {
        debug('..query order history');
        debug('..company id '+ m[1]);
        debug('..unit id '+ n[1]);
        return query.select('*').where('company_id',m[1]).andWhere('unit_id',n[1]);
      } else if (this.resteasy.table == 'drivers' && context
                && (m = context.match(/companies\/(\d+)/))
                && (n = context.match(/units\/(\d+)/))) {
        debug('..query drivers');
        debug('..company id '+ m[1]);
        debug('..unit id '+ n[1]);
        return query.select('*').where('company_id',m[1]).andWhere('unit_id',n[1]);
      } else if (this.resteasy.table == 'favorites' || this.resteasy.table == 'reviews') {
        debug('..read favorites / reviews');
        var coId = '';
        var custId = '';
        var unitId = '';
        if (context && (m = context.match(/companies\/(\d+)$/))) coId = m[1];
        if (context && (m = context.match(/customers\/(\d+)$/))) custId = m[1];
        if (context && (m = context.match(/units\/(\d+)$/))) unitId = m[1];
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
      } else if (this.resteasy.table == 'food_parks' && context && (m = context.match(/territories\/(\d+)$/))) {
        debug('..territory id '+ m[1]);
        return query.select('*').where('territory_id', m[1]);
      } else if (this.resteasy.table == 'loyalty_rewards' && context && (m = context.match(/companies\/(\d+)$/))) {
        debug('..company id '+ m[1]);
        return query.select('*').where('company_id', m[1]);
      } else if (this.resteasy.table == 'delivery_addresses' && context && (m = context.match(/customers\/(\d+)$/))) {
        debug('..customer id '+ m[1]);
        return query.select('*').where('customer_id', m[1]);
      } else if (this.resteasy.table == 'reviews' && context && (m = context.match(/companies\/(\d+)$/))) {
        debug('..company id '+ m[1]);
        return query.select('*').where('company_id', m[1]);
      } else if (this.resteasy.table == 'loyalty'
                && context
                && (m = context.match(/companies\/(\d+)/))
                && (n = context.match(/customers\/(\d+)/))) {
        debug('..reading loyalty');
        return query.select('*').where('company_id',m[1]).andWhere('customer_id',n[1]);
      }
    }
  },
};
