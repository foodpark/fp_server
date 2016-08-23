var pg = require('../../config/knex');

/** v
CREATE TABLE customers (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  order_sys_id TEXT,
  description TEXT,
  facebook TEXT,
  twitter TEXT,
  photo TEXT,
  power_reviewer BOOLEAN DEFAULT false,
  city TEXT,
  state TEXT,
  country TEXT,
  user_id INTEGER REFERENCES users (id),
  created TIMESTAMP DEFAULT current_timestamp
)
**/

exports.getAllCustomers = function() {
  pg('customers').select().asCallback(callback);
};

exports.getSingleCustomer = function(id, callback) {
  pg('customers').select().where('id', id).asCallback(callback);
};

exports.createCustomer = function(name, userId, callback) {
  pg('customers').insert(
    {
      name: name,
      user_id: parseInt(userId),
    }).returning('id').asCallback(callback);
};
