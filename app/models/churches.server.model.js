var knex  = require('../../config/knex');
var debug = require('debug')('church.model');


exports.createChurch = function(name) {
  return knex('churches').insert(
    {
      name: name
    }).returning('*');
};

exports.churchForChurchName = function(churchName) {
  return knex('churches').select('*').where('name', 'ILIKE', churchName)
};
