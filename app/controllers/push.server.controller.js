var config = require('../../config/config');
var admin = require("firebase-admin");
var FCM = require('fcm-node');
var gcm = require('node-gcm');
var moltin = require('./moltin.server.controller');
var OrderHistory = require('../models/orderhistory.server.model');
var timestamp = require('../utils/timestamp');
var debug = require('debug')('push');
var winston = require('winston');

var logger = new winston.Logger({transports : winston.loggers.options.transports});

var deviceInfo = {};

const ORDER = '/orders';
const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_ACCEPTED_STATUS = 'ORDER_ACCEPTED_STATUS';
const ORDER_REQUESTED = 'order_requested';


var serviceAccount = require("../../config/SFEZ-113af0fa7076.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://sfez-17981.firebaseio.com/"
});

var setOrderStatusMessage = function(orderId, title, status, message, body, data) {
	var note = '';

	if (!data) data = {};
	data.message = message;
	data.title = title;
	data.status = status;

	if (status == 'order_requested') {
		note = {
			"notification" : {
				"body" : body,
				"title" : title
			},
			"data" : data
		};
	} else {
		note = {
			"notification" : {
				"body" : body,
				"title" : title
			},
			"data" : data
		}
	};
	return note;
}

var sendFCMNotification = function (message) {
	// Send a message to the device corresponding to the provided
	// registration token.
	var payload = { notification: message.notification, data: message.data};
	debug(payload);
	return new Promise( function(resolve, reject) {
		admin.messaging().sendToDevice(message.to, payload)
		.then(function(response) {
			// See the MessagingDevicesResponse reference documentation for
			// the contents of response.
			debug('..sent message');
			console.log(response);
			var error = response.results[0].error;
			if (error) {
				console.error(error.errorInfo);
				reject(error.errorInfo.message);
			}
			resolve(response);
		})
		.catch(function(error) {
			console.error("Error sending message:");
			console.log(error);
			reject(error);
		});
	});
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
	var msg = setOrderStatusMessage(orderId, msgTarget.title, 
	          msgTarget.status, msgTarget.message, msgTarget.body, msgTarget.data);
	debug(msg);
	debug('..sending notification..');
	var notified = {};
	var fcmRes = '';
	if (msgTarget.fcmId) {
		debug('...to fcm id');
		console.log('Sending FCM notification...');
		msg.to = msgTarget.fcmId;
		try {
			fcmRes = yield sendFCMNotification(msg);
		} catch (err) {
			// failed notification is not a showstopper
			notified.fcm = false;
			console.error(err);
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
			console.error(err);
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
