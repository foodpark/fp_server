var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ReviewSchema = new Schema({
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
    },
    comment: String,
    reviewScore:Number
});
mongoose.model('Review', ReviewSchema);
