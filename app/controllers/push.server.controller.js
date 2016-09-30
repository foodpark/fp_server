var config = require('../../config/config')
var moltin = require('./moltin.server.controller');

var fcm = require('fcm-node');

var deviceInfo = {};

const ORDER = '/orders';
const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_ACCEPTED_STATUS = 'ORDER_ACCEPTED_STATUS';

var getMessage = function(deviceId){
	return {
		to:deviceId
	};
}

/*
	Inform customer about order accept or decline
*/
var informCutomer = function(deviceId, orderId, orderStatus){
	console.log("*********** Info Customer *****************");
	console.log("Customer Device Info ", deviceId, orderId, orderStatus);
	var orderStatusMessage = (orderStatus+'' == 'true')?'Your order accepted by vendor':'Your order decline by vendor';
	var message = getMessage(deviceId);
	message.data = {'order':orderId, type:ORDER_ACCEPTED_STATUS, order_status:orderStatus};
	message.notification = {'title':"SFEZ Food",'message':orderStatusMessage};
	sendPushNotification(message);
}

var sendPushNotification = function(message){
	if(message){
		var sender = new FCM.Sender(config.googleApiKey);
		sender.send(message, function (err, response) {
			if (err) {
				console.log("Something has gone wrong!");
			} else {
				console.log("Successfully sent with response: ", response);
			}
		});
	}
}

exports.orderAcceptDeclice = function*(next){
	console.log("****************** Accept/Declice **********************");
	console.log("Status ", this.body.order_status);
	try{
		var status = this.body.order_status;
		var order = this.body.order;
		var flow = ORDER + '/'+ order;
		var orderObject = yield moltin.getOrderById(flow);
		if(orderObject && orderObject.customer && orderObject.customer.data){
			device_token = getDeviceToken(orderObject.customer.data.email);
			informCutomer(device_token, order, status);
		}
	}catch(err){
		throw(err);
	}
	this.body = orderObject;
}

exports.sendPush = function*(next){
	var sender = new gcm.Sender(config.googleApiKey);
	sender.send(getMessage(), { registrationTokens: tokens(this.query.deviceToken) }, function (err, response) {
  		if(err) console.error(err);
  		else    console.log(response);
	});

	this.body = {};
}


var informVendorOrderCreated = function(deviceId, order){
	var message = getMessage(deviceId);
	message.data = {'order':order, type:ORDER_CREATED};
	message.notification = {'title':"SFEZ Food",'message':'An order created. Do you want to accept?'};
	sendPushNotification(message);
}

exports.eventTrack = function*(next){
	console.log("*********************** response from webhook *******************")
	console.log(this.body," Webhook ****************************8 ");
	var order = this.body.order;
	var vendor = this.body.vendor;
	var deviceId = getDeviceToken(vendor);
	informVendorOrderCreated(deviceId, order);
	this.status = 200;
}


exports.setDeviceToken = function*(next){
	deviceInfo[this.body.user_email] = this.body.device_token;
	console.log("deviceToken ", deviceInfo)
	this.body = {};
}

var getDeviceToken = function(userEmail){
	return deviceInfo[userEmail];
}
