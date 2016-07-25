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
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    comment: String,
    reviewScore:Number
});
mongoose.model('Review', ReviewSchema);
