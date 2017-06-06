var ord = require('../../app/models/orderstatus.server.model');
var winston = require('winston');

var logger = new winston.Logger({transports : winston.loggers.options.transports});

exports.getStatus = function *(next) {
  this.body = ord.getOrderStatus(this.orderStatusId);
  yield next();
};

exports.updateOrdStatus = function *(next) {
  var orderStatusId = this.orderStatusId;
  var stepName = this.body.stepName;
  var stepStatus = this.body.stepStatus;
  var apiCall= this.body.apiCall;
  var paramString = this.body.paramString;
  var errorInfo = this.body.errorInfo;
  var callInfo = this.body.callInfo;
  this.body = (yield ord.updateOrderStatusRecord(orderStatusId, stepName, stepStatus, apiCall,
    paramString, errorInfo, callInfo))[0];
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




