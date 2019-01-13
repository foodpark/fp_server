var knex = require('../../config/knex');
var debug = require('debug')('podevents.model');

exports.createEvent = function (event) {
    return knex("podevents").insert(event).returning('*');
};
