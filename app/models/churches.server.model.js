
var knex  = require('../../config/knex');
var debug = require('debug')('church.model');

exports.createChurch = function(name, email, country_id, userId) {
  return knex('churches').insert(
    {
      name: name,
      email: email,
      country_id: country_id,
      user_id: parseInt(userId),
    }).returning('*');
};

exports.churchForChurchName = function(churchName) {
  return knex('churches').select('*').where('name', 'ILIKE', churchName)
};

exports.churchForUserId = function(userId) {
  let customQuery = `select count(*) from churches where user_id= ${userId}`;
  return knex.raw(customQuery);
}
