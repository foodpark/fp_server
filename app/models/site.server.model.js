var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SiteSchema = new Schema ({
    siteOrderSysId:String,
    name:String,
    number:String,
    description:String,
    photo:String,
    qrCode:String,
    login:String,
    password:String, //encrypted hash
    schedule:String,
    company: {
      type:Schema.ObjectId,
      ref: 'Company'
    },
    location: {
      latitude: String,
      longitude: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Site',SiteSchema);
