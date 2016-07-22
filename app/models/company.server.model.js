var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema ({
    name:String,
    orderSysId:String,
    baseSlug:String,
    defaultCategoryId:String,
    description:String,
    email:String,
    facebook:String,
    twitter:String,
    photo:String,
    featuredDish:String,
    hours:String,
    schedule:String,
    city:String,
    state:String,
    country:String,
    totalReview:Number,
    trending:Boolean,
    tags: [{
      _id:false,
      text:String
    }],
    user: {
      type: Schema.ObjectId,
      ref: 'User'
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Company',CompanySchema);
