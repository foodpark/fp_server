var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CustomerSchema = new Schema ({
    name:String,
    customerOrderSysId:String,
    description:String,
    facebook:String,
    twitter:String,
    photo:String,
    powerReviewer:Boolean,
    city:String,
    state:String,
    country:String,
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Customer',CustomerSchema);
