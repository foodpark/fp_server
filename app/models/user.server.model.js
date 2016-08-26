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
  return knex('users').select('*').where('username', 'ILIKE', username)
};

exports.getAllUsers = function() {
  return knex('users').select()
};

exports.getSingleUser = function(id) {
  return knex('users').select().where('id', id)
};

exports.getUserByUsername = function(username) {
  return knex('users').select().where('username', username)
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
