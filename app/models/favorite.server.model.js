var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FavoriteSchema = new Schema({
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
});
mongoose.model('Favorite', FavoriteSchema);
