//var debug = require('debug')('moltin.server.controller'),
   var sts = require('./security.server.controller'),
    config = require('../../config/config'),
    request = require('request');

    var uuid = require('uuid');

const DELETE = 'DELETE';
const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';

const CHECKOUT = "/v0.1/checkouts";
const OTP = "/one-time-tokens";

var sumupAccessToken = "";

var oAuthSumUp = function(callback){
  request.post({
    url: config.sumup.sumupAuthUrl,
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'client_id': config.sumup.clientId,
      'client_secret': config.sumup.client_secret
    })
  },
    function (err, res, body) {
      if (!err && res.statusCode === 200) {
          var data = JSON.parse(body);
          console.log(data);
          sumupAccessToken = data.access_token;
          console.log(sumupAccessToken);

          callback(sumupAccessToken);
      }
      else {
        console.log("Sumup access token error ", err)
        callback(err);
      }
  })
};

var getBearerToken = function(callback) {
  oAuthSumUp(callback);
};


exports.createCheckout = function*(next) {
  var checkoutData = setCheckoutData(this.body || {});
  console.log(checkoutData)
  var resData = {};
  try {
    var checkout =  yield requestEntities(CHECKOUT, POST, checkoutData);
    var otp = yield requestEntities(OTP, POST, {});
    resData.checkoutId = checkout.id;
    resData.otp = otp.otpToken
  } catch (err) {
    console.error('error getting sumup token')
    console.error(err)
    throw(err)
  }
  this.body = resData;

}

var setCheckoutData = function(body){
  var checkoutData = {"amount": body.amount,"currency": body.currency,"pay_to_email": body.pay_to_email};
  checkoutData.checkout_reference = uuid.v1();
  return checkoutData;
}


var requestEntities = function(flow, method, data, id) {

  return new Promise(function(resolve, reject) {
    getBearerToken(function(token) {
      if (token instanceof Error) {
        reject(token);
        return;
      }
      console.log('token : '+ token)
      var oid = '';
      if (id) oid = '/'+id
      request(
        {
          method: method,
          url: config.sumup.sumupUrl + flow + oid,
          json: data,
          headers: {
            'Authorization': 'Bearer '+ token
          }
        },
        function (err, res, body) {
          if (!err && (res.statusCode === 200 || res.statusCode === 201) ) {
            console.log(body)
            var bodyJson = JSON.stringify(res);
            bodyJson = JSON.parse(bodyJson).body;
            console.log(bodyJson)
            resolve(bodyJson)
            return;
          }
          else {
            console.error('Response Status: ' + res.statusCode)
            if (err) {
              console.error('err'+ err);
              reject(err)
              return;
            }
            console.error(body)
            console.log(body.error)
            reject(body.error)
            return;
          }
        })
    })
  })
}
