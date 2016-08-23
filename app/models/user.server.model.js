var crypto = require('crypto'),
    knex = require('../../config/knex');
/**

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT REFERENCES roles (type),
  role_id INTEGER,
  provider TEXT,
  provider_id TEXT,
  provider_data TEXT,
  created TIMESTAMP DEFAULT current_timestamp
)
CREATE TABLE roles (
  ID SERIAL PRIMARY KEY,
  type TEXT NOT NULL UNIQUE
)
INSERT INTO ROLES (type) values ('CUSTOMER');
INSERT INTO ROLES (type) values ('OWNER');
INSERT INTO ROLES (type) values ('SITEMGR');
INSERT INTO ROLES (type) values ('ADMIN');
**/

exports.userForUsername = function(username) {
  return knex('users').select('*').where('username', 'ILIKE', username);
};

exports.getAllUsers = function(callback) {
  knex('users').select().asCallback(callback);
};

exports.getSingleUser = function(id, callback) {
  knex('users').select().where('id', id).asCallback(callback);
};

exports.getUserByUsername = function(username, callback) {
  knex('users').select().where('username', username).asCallback(function(err, results) {
    if (err) return callback(err);
    console.log(results);
    var user = results[0];
    return callback(null, user);
  });
};

exports.isUserForUsername = function(username, callback) {
  knex('users').count('username').where('username', username).asCallback(function(err, results) {
    if (err) return callback(err);
    console.log(results);
    var count = results[0].count;
    if (count > 0) return callback(null, true);
    return callback(null, false);
  });
};

exports.createUser = function(hash) {
  //enrypt password
  var md5 = crypto.createHash('md5');
  hash.password = md5.update(hash.password).digest('hex');
  return knex('users').insert(hash).returning('*');
};

exports.authenticate = function(md5password, password) {
  var md5 = crypto.createHash('md5');
  md5 = md5.update(password).digest('hex');

  return md5password === md5;
};

