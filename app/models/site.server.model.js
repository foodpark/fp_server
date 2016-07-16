var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SiteSchema = new Schema ({
    name:String,
    number:String,
    description:String,
    photo:String,
    qrCode:String,
    login:String,
    password:String, //encrypted hash
    schedule:String,
    location: {
      latitude: String,
      longitude: String
    }
});

mongoose.model('Site',SiteSchema);
