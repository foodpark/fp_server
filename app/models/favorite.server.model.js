var db_config = require('../../config/knex'),
    pg = require('knex')(db_config);

/** var FavoriteSchema = new Schema({
    _id: false,
    created: {
        type: Date,
        default: Date.now
    },
    site: {
        type: Schema.ObjectId,
        ref: 'Site'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
}); **/
