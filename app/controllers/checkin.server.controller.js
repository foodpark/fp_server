var Checkin = require('../models/checkin.server.model');
var FoodPark = require('../models/foodpark.server.model')
var Unit = require('../models/unit.server.model')
var logger = require('winston');

exports.createCheckin = function * (next) {
    var checkin = this.body;

    var unitData = yield Unit.getSingleUnit(parseInt(checkin.unit_id));
    var foodpark = yield FoodPark.getSingleFoodPar(parseInt(checkin.food_park_id));

    unitData[0].food_park_id = parseInt(checkin.food_park_id);
    unitData[0].from_city = foodpark[0].city;
    unitData[0].from_state = foodpark[0].state;
    unitData[0].from_zip = foodpark[0].postal_code;
    unitData[0].from_country = foodpark[0].country;
    unitData[0].from_street = foodpark[0].address;

    try {
        // Updating Checkin table
        var response = yield Checkin.createCheckin(checkin);

        // Updating Unit table
        var unitResponse = yield Unit.updateUnit(checkin.unit_id, unitData[0]);

        this.status = 201;
        this.body = response[0];
    } catch (err) {
        logger.error('Error saving request.');
        this.status = 500; // Internal Server Error - Operation Failed
        this.body = {error : 'Error saving the request.'};
        throw (err);
    }
    return;
}