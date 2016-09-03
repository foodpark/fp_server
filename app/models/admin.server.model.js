var knex = require('../../config/knex');

/**
CREATE TABLE admins (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  photo TEXT,
  super_admin BOOLEAN DEFAULT false,
  city TEXT,
  state TEXT,
  country TEXT,
  user_id INTEGER REFERENCES users (id),
  created TIMESTAMP DEFAULT current_timestamp
)
**/

/* exports.getAllAdmins = function() {
  knex('admins').select().asCallback(callback);
};*/

exports.getSingleAdmin= function(id) {
  return knex('admins').select().where('id', id);
};

exports.getForUser = function(userId) {
  return knex('admins').select().where('user_id', userId)
};

exports.createAdmin = function(name, userId) {
  return knex('admins').insert(
    {
      name: name,
      user_id: userId
    }).returning('*');
};
