/**
 * @author Sávio Muniz
 */


var Prepay = require('../models/prepay.server.model');

exports.recharge = recharge;
exports.registerPrepayTransaction = registerPrepayTransaction;
exports.getPrepayTransactionPromise = getPrepayTransactionPromise;

function * recharge() {
  try {
    var recharge = this.body;

    var createdRecharge = (yield Prepay.createRecharge(recharge))[0];

    var response = { success : 'Recharge successfully created' };
    response.data = createdRecharge;

    this.body = response;
    this.status = 201;

    yield registerPrepayTransaction(createdRecharge.id, 'recharge');
  } catch (err) {
    console.error('could not create recharge');
    throw err;
  }
}

function * registerPrepayTransaction(id, type) {
  try {
    var createdTransaction = yield getPrepayTransactionPromise(id,type);
    console.log('Transaction successfully registered!');
    console.log(createdTransaction);
  } catch (err) {
    console.error('could not register transaction to history');
    throw err;
  }
}

function getPrepayTransactionPromise(id, type) {
  var transaction = {
    type : type,
    transaction_id : id,
    date : new Date()
  };

  return Prepay.registerTransaction(transaction);
}
