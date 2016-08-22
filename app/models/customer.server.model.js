var db = require ('../../config/knex');

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

exports.getAllCustomers = function () {
  db.any('select * from customers')
    .then(function (data) {
      return(data)
    })
    .catch(function (err) {
      return (err);
    });
}
exports.getSingleCustomer = function (id) {
  db.one('select * from customers where id = $1', id)
    .then(function (data) {
      return (data)
    })
    .catch(function (err) {
      return (err);
    });
}

exports.createCustomer = function (name, email, userId) {
  db.none('insert into customers(name, email, user_id)' +
      'values($1, $2, $3) returning id', name, email, userId)
    .then(function (data) {
      return (data);
    })
    .catch(function (err) {
      return (err);
    });
}
