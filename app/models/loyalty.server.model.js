var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var LoyaltySchema = new Schema({
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
    },
    totalLoyalty:Number
});
mongoose.model('Loyalty', LoyaltySchema);
