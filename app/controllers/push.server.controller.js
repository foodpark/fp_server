var config = require('../../config/config');
var FCM = require('fcm-node');
var gcm = require('node-gcm');
var moltin = require('./moltin.server.controller');
var OrderHistory = require('../models/orderhistory.server.model');
var timestamp = require('../utils/timestamp');
var debug = require('debug')('push');

var deviceInfo = {};

const ORDER = '/orders';
const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_ACCEPTED_STATUS = 'ORDER_ACCEPTED_STATUS';
const ORDER_REQUESTED = 'order_requested';

var displayString = {
	order_requested	 : 'was requested',
	order_declined   : 'was rejected',
	order_accepted   : 'was accepted',
	order_paid       : 'was paid',
	pay_fail         : 'payment failed',
	order_in_queue   : 'is in queue',
	order_cooking    : 'is cooking',
	order_ready	     : 'is ready',
	order_picked_up  : 'was picked up',
	no_show          : ': customer was no show',
	order_dispatched : 'was dispatched',
	order_delivered	 : 'was delivered'
} 


var setOrderStatusMessage = function(orderId, title, display, status) {
	var note = {
		"notification" : {
			"body" : "Order "+ orderId +" "+ display +" at "+ timestamp.now(),
			"title" : title
		},
		"data" : {
			"status" : status,
			"message" : "Order "+ orderId +" "+ display +" at "+ timestamp.now(),
		}
	};
	return note;
}

var sendFCMNotification = function (message){
	debug('sendFCMNotification');
	return new Promise( function(resolve, reject) { 
		if (message) {
			var fcm = new FCM(config.fcmServerKey);
			debug('..fcm');
			debug(fcm);
			fcm.send(message, function (err, response) {
				if(err) {
					debug('..Error occurred');
					console.error(err);
					reject(err);
				} else {
					console.log('FCM notification sent');
					console.log(response);
					resolve(response);
				}
			})
		} else {
			console.error('..Empty message ');
			console.error(message);
			reject(new Error('Empty message. FCM notification not sent'));
		}
	})
}

var sendGCMNotification = function (message){
	debug('sendGCMNotification');
	return new Promise( function(resolve, reject) {
		if (message) {
			var  gcmMsg = new gcm.Message();
			gcmMsg.addData(message.data);
			gcmMsg.addNotification(message.notification)
			debug(gcmMsg)
			var regtokens = [message.to];
			debug(regtokens)
			var sender = new gcm.Sender(config.gcmServerKey);
			debug(sender);
			debug('..sending');
			console.log('Sending GCM notification...');
			sender.send(gcmMsg, {registrationTokens : regtokens}, function (err, response) {
				debug('..returned from call to Google')
				if(err) {
					console.error(err);
					reject(err);
				} else {
					console.log('GCM notification sent');
					console.log(response);
					resolve(response);
				}
			})
		} else {
			reject(new Error('Empty message or sender. GCM notification not sent'));	
		}
	})
}

exports.notifyOrderUpdated = function *(orderId, msgTarget){
	debug('notifyOrderUpdated');
	var msg = setOrderStatusMessage(orderId, msgTarget.title, displayString[msgTarget.status], msgTarget.status);
	debug(msg);
	debug('..sending notification..');
	var notified = {};
	var fcmRes = '';
	if (msgTarget.fcmId) {
		debug('...to fcm id');
		console.log('Sending FCM notification...');
		msg.to = msgTarget.fcmId;
		try {
			fcmRes = yield sendFCMNotification(msgTarget);
		} catch (err) {
			// failed notification is not a showstopper
			notified.fcm = false;
		}
		debug('...response')
		debug(fcmRes)
		if (fcmRes && fcmRes.success > 0 && fmcRes.failure == 0) {
			notified.fcm = true;
		}
	} else console.log('No fcm id - no fcm notification sent to '+ msgTarget.to +' '+ msgTarget.toId)
	if (msgTarget.gcmId) {
		debug('...to gcm id');
		msg.to = msgTarget.gcmId;
		var gcmRes = '';
		try {
			gcmRes = yield sendGCMNotification(msg);
		} catch (err) {
			//failed notificaiton is not a showstopper
			notified.gcm = false;
		}
		debug('...response');
		debug(gcmRes);
		if (gcmRes && gcmRes.success > 0 && fcmRes.failure == 0) {
			notified.gcm = true;
		}
		debug('...done with notifications attempts')
	} else console.log('No gcm id - no gcm notification sent to '+ msgTarget.to +' '+ msgTarget.toId)
	return notified;
}
