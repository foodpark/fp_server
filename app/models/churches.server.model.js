
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

exports.updateChurch = function(church_id, body) {
  return knex('churches').update({
    sponsor: body.sponsor,
    title: body.title,
    type: body.type,
    connected_with: body.connected_with,
    addendum_file: body.attachment,
    latitude: body.latitude,
    longitude: body.longitude,
    approved: body.approved
  }).where('id', church_id).returning('*');
}
