var db_config = require('../../config/knex'),
    pg = require('knex')(db_config);

/**
var CheckinSchema = new Schema({
    _id: false,
    created: {
        type: Date,
        default: Date.now
    },
    site: {
        type: Schema.ObjectId,
        ref: 'Site'
    },
    customer: {
        type: Schema.ObjectId,
        ref: 'Customer'
    }
});
**/
