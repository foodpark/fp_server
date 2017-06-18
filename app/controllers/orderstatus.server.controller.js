var ord = require('../../app/models/orderstatus.server.model');
var debug = require('debug')('orderstatus');
var logger = require('winston');


exports.getStatus = function *(next) {
  this.body = ord.getOrderStatus(this.orderStatusId);
  yield next();
};

exports.updateOrdStatus = function *(next) {
  logger.info('updateOrderStatus ' + this.orderStatusId);
  if (!body){
    logger.error('No order details provided', {fn:'updateOrdStatus', user_id: this.passport.user.id, role: this.passport.user.role,
      error: 'Missing order details'});
    return '';
  }
  try{

    logger.info('updateOrderStatus ',{fn:'updateOrdStatus', orderStatusId:this.orderStatusId, stepName:this.body.stepName,
      stepStatus:this.body.stepStatus, apiCall:this.body.apiCall, paramString:this.body.paramString, errorInfo: this.body.errorInfo,
      callInfo: this.body.callInfo});
    var orderStatusId = this.orderStatusId;
    var stepName = this.body.stepName;
    var stepStatus = this.body.stepStatus;
    var apiCall= this.body.apiCall;
    var paramString = this.body.paramString;
    var errorInfo = this.body.errorInfo;
    var callInfo = this.body.callInfo;
    this.body = (yield ord.updateOrderStatusRecord(orderStatusId, stepName, stepStatus, apiCall,
      paramString, errorInfo, callInfo))[0];
  } catch (err) {
    logger.error('Error updating order status',
      {fn: 'updateOrdStatus', user_id: this.passport.user.id, error: err});
    throw err;
  }

  return;
};

exports.createOrdStatus = function *(next) {
  logger.info('createOrderStatus' + this.orderStatusId);
  var orderId = this.body.orderId;
  var stepName = this.body.stepName;
  var stepStatus = this.body.stepStatus;
  var apiCall= this.body.apiCall;
  var paramString = this.body.paramString;
  var errorInfo = this.body.errorInfo;
  var callInfo = this.body.callInfo;
  logger.info('yield');
  this.body = (yield ord.createOrderStatusRecord(orderId, stepName, stepStatus, apiCall,
    paramString, errorInfo, callInfo))[0];
  return;
};

exports.getStatusId = function *(id, next) {
  logger.info('getStatusId');
  logger.info('id ' + id);
  yield function() {
    logger.info(id);
  }
  this.orderId = id;
  return;
};
