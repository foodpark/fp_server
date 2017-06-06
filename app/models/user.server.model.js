var crypto = require('crypto');
var knex   = require('../../config/knex');
var debug  = require('debug')('user.model');
var logger = require('winston');


function encrypt(password) {
  var md5 = crypto.createHash('md5');
  md5 = md5.update(password).digest('hex');

  return md5;
}

exports.encryptPassword = function (password) {
  return encrypt(password);
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
  hash.password = encrypt(hash.password);
  return knex('users').insert(hash).returning('*');
};

exports.updateUser = function(id, hash) {
  debug('updateUser');
  if (hash.password) hash.password = encrypt(hash.password);
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
  var md5 = encrypt(password)

  return md5password === md5;
};

exports.updateFB = function(hash) {
  knex('users').update('fbid, fb_token', hash.facebook_id, hash.facebook_token).where('id', hash.id).returning('*');
};

exports.findByFB = function(hash) {
  logger.info(hash);
  knex('users').select('*').where('fbid', hash.facebook_id);
}
