var knex  = require('../../config/knex');

const SQUARE_UNIT_COLLECTION = "square_unit";

const UNIT_ID_FIELD = "unit_id";

exports.createSquareUnitRelationship = function(userId, locationId) {
    return knex(SQUARE_UNIT_COLLECTION).insert(
        {
            unit_id : userId,
            location_id: locationId
        }).returning("*");
};

exports.getByUnit = function (unitId) {
    return knex(SQUARE_UNIT_COLLECTION).select().where(UNIT_ID_FIELD, unitId).first();
};