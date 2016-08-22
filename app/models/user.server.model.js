var crypto = require('crypto'),
    db_config = require('../../config/knex'),
    pg = require('knex')(db_config);
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

exports.getAllUsers = function(callback) {
  pg('users').select().asCallback(callback)
}

exports.getSingleUser = function(id, callback) {
  pg('users').select().where('id', id).asCallback(callback)
}

exports.getUserByUsername = function (username, callback) {
  pg('users').select().where('username',username).asCallback(function (err, results) {
    if (err) return callback(err)
    console.log(results)
    var user = results[0]
    return callback (null, user)
  });
}

exports.isUserForUsername = function (username, callback) {
  pg('users').count('username').where('username',username).asCallback(function (err, results) {
    if (err) return callback(err)
    console.log(results)
    var count = results[0].count
    if (count > 0) return callback (null, true)
    return callback (null, false)
  });
}

exports.createUser = function (name, email, username, password, role, provider, providerId, providerData, callback) {
  //enrypt password
  var md5 = crypto.createHash('md5')
  password = md5.update(password).digest('hex')
  pg('users').insert(
    {
      name: name,
      email: email,
      username:username,
      password: password,
      role: role,
      provider: provider,
      provider_id: providerId,
      provider_data: providerData
    }).returning('id').asCallback(callback)
}
exports.authenticate = function(md5password, password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return md5password === md5;
};
