var crypto = require('crypto');
var knex = require('../../config/knex');
var debug = require('debug')('user.model');
/**

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
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
INSERT INTO ROLES (type) values ('UNITMGR');
INSERT INTO ROLES (type) values ('ADMIN');
**/

var encryptPassword = function (password) {
  var md5 = crypto.createHash('md5');
  md5 = md5.update(password).digest('hex');

  return md5;
}

exports.userForUsername = function(username) {
  return knex('users').select('*').where('username', 'ILIKE', username)
};

/* Used for LocalStrategy login */
exports.getUserByUsername = function(username, callback) {
  debug('user model: get user by '+ username)
  return knex('users').select('*').where('username', 'ILIKE', username).asCallback(callback)
};

exports.getAllUsers = function() {
  return knex('users').select()
};

exports.getSingleUser = function(id) {
  return knex('users').select().where('id', id)
};

exports.createUser = function(hash) {
  hash.password = encryptPassword(hash.password);
  return knex('users').insert(hash).returning('*');
};

exports.updateUser = function(id, hash) {
  debug('updateUser');
  if (hash.password) hash.password = encryptPassword(hash.password);
  debug(hash);
  return knex('users').update(hash).where('id',id).returning('*');
};

exports.createOrUpdateUser = function(hash) {
  debug('createOrUpdateUser');
  var userId = hash.id;
  debug(hash);
  if (userId) {
    debug('..update user');
    return this.updateUser(userId, hash)
  }
  debug('..create user');
  return this.createUser(hash)
}

exports.deleteUser = function(id) {
  return knex('users').where('id', id).del()
}

exports.authenticate = function(md5password, password) {
  var md5 = encryptPassword(password)

  return md5password === md5;
};
