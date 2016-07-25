var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    name: String,
    email: {
      type: String,
      required: true
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['Member', 'Owner', 'SiteMgr', 'Admin'],
      default: 'Member'
    },
    roleId: String,
    provider: String,
    providerId: String,
    providerData: {},
    created: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save',
    function(next) {
        if (this.password) {
            var md5 = crypto.createHash('md5');
            this.password = md5.update(this.password).digest('hex');
        }

        next();
    }
);

UserSchema.methods.authenticate = function(password) {
    var md5 = crypto.createHash('md5');
    md5 = md5.update(password).digest('hex');

    return this.password === md5;
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

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

mongoose.model('User', UserSchema);
