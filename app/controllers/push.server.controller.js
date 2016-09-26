var config = require('../../config/config')
var moltin = require('./moltin.server.controller');

var gcm = require('node-gcm');

var deviceInfo = {};

const ORDER = '/orders';
const ORDER_CREATED = 'ORDER_CREATED';
const ORDER_ACCEPTED_STATUS = 'ORDER_ACCEPTED_STATUS';

var getMessage = function(){
	console.log("Getting Message")
	var message = new gcm.Message();
	message.addData('title',"SFEZ Food");
  	return message;
}

var tokens = function(token){
	var registrationTokens = [token];
	return registrationTokens;
}

/*
	Inform customer about order accept or decline
*/
var informCutomer = function(deviceId, orderId, orderStatus){
	console.log("*********** Info Customer *****************");
	console.log("Customer Device Info ", deviceId, orderId, orderStatus);
	var orderStatusMessage = (orderStatus+'' == 'true')?'Your order accepted by vendor':'Your order decline by vendor';
	var message = getMessage();
	message.addData('order',orderId);
	message.addData('message',orderStatusMessage);
	message.addData('type', ORDER_ACCEPTED_STATUS);
	sendPushNotification(message, deviceId);
}

var sendPushNotification = function(message, deviceToken){
	if(message && deviceToken){
		var sender = new gcm.Sender(config.googleApiKey);
		sender.send(message, { registrationTokens: tokens(deviceToken) }, function (err, response) {
  			if(err) console.error(err);
  			else    console.log(response);
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
	var message = getMessage();
	message.addData('order',order);
	message.addData('message','An order created. Do you want to accept?');
	message.addData('type', ORDER_CREATED);
	sendPushNotification(message, deviceId);
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
