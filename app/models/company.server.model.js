var knex = require('../../config/knex');

/**
CREATE TABLE companies (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  order_sys_id TEXT NOT NULL,
  base_slug TEXT NOT NULL,
  default_cat TEXT NOT NULL,
  description TEXT,
  email TEXT,
  facebook TEXT,
  twitter TEXT,
  photo TEXT,
  featured_dish TEXT,
  hours TEXT,
  schedule TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  taxband TEXT,
  user_id INTEGER REFERENCES users (id),
  created TIMESTAMP DEFAULT current_timestamp
)
**/

exports.companyForCompanyName = function(companyName) {
  return knex('companies').select('*').where('name', 'ILIKE', companyName)
};

exports.getAllCompanies = function() {
  return knex('companies').select()
};

exports.getSingleCompany = function(id) {
  return knex('companies').select().where('id', id)

};

exports.getForUser = function(userId) {
  return knex('companies').select().where('user_id', userId)
};

exports.createCompany = function(name, email, userId, moltCoId, moltDefCat, moltSlug, callback) {
  return knex('companies').insert(
    {
      name: name,
      email: email,
      user_id: parseInt(userId),
      order_sys_id: moltCoId,
      default_cat: moltDefCat,
      base_slug: moltSlug,
    }).returning('*').asCallback(callback);
};
