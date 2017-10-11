var knex  = require('../../config/knex');

exports.createSquareUnitRelationship = function(userId, locationId) {
    return knex('square_unit').insert(
        {
            unit_id : userId,
            location_id: locationId
        }).returning("*");
};