var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema ({
    companyName:String,
    companyOrderSysId:String,
    companySlug:String,
    companyDefaultCategory:String,
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
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Company',CompanySchema);
