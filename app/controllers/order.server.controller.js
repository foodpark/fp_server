var config = require('../../config/config')
var moltin = require('./moltin.server.controller');

const ORDER = '/orders';

exports.getOrders = function*(next){
  var search = this.query;
  var query = '';
  for(var q in search){
    query = (query)? query + '&'+ q + '=' + search[q]:'?'+ q + '=' + search[q];
  }
  console.log(query);
  try{
    var flow = ORDER + '/' + 'search' + query
    var orders = yield moltin.getOrder(flow);
  }catch(e){
    throw(e);
  }
  console.log(orders.length)
  this.body = orders;
}
