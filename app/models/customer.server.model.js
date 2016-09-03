var knex = require('../../config/knex');

/**
CREATE TABLE customers (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  order_sys_id TEXT,
  description TEXT,
  email TEXT,
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
  return knex('customers').select()
};

exports.getSingleCustomer = function(id) {
  return knex('customers').select().where('id', id)
};

exports.getForUser = function(userId) {
  return knex('customers').select().where('user_id', userId)
};

exports.createCustomer = function(name, userId) {
  return knex('customers').insert(
    {
      name: name,
      user_id: userId
    }).returning('*')
};
