var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CompanySchema = new Schema ({
    companyName:String,
    description:String,
    photo:String,
    email:String,
    facebook:String,
    featuredDish:String,
    hours:String,
    schedule:String,
    city:String,
    state:String,
    country:String
});

mongoose.model('Company',CompanySchema);
