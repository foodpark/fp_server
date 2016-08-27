var knex = require('../../config/knex');

/**
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
	type: Schema.ObjectId,
	ref: 'Company'
},
**/

exports.findUniqueSiteName = function(company, siteName, suffix, callback) {
    var _this = this;
    var possibleName = siteName + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};
