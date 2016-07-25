var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
mongoose.model('Checkin', CheckinSchema);
