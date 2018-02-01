/**
 * @author Sávio Muniz
 */


var Prepay = require('../models/prepay.server.model');

exports.recharge = recharge;
exports.registerPrepayTransaction = registerPrepayTransaction;

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
    var transaction = {
      type : type,
      transaction_id : id,
      date : new Date()
    };

    var createdTransaction = (yield Prepay.registerTransaction(transaction));
    console.log('Transaction successfully registered!');
    console.log(createdTransaction);
  } catch (err) {
    console.error('could not register transaction to history');
    throw err;
  }
}
