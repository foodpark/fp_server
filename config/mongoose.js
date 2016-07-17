var config=require('./config'),
    mongoose = require('mongoose');
module.exports=function(){
	var db=mongoose.connect(config.db);
	require('../app/models/checkin.server.model');
	require('../app/models/company.server.model');
	require('../app/models/customer.server.model');
	require('../app/models/favorite.server.model');
	require('../app/models/loyalty.server.model');
	require('../app/models/review.server.model');
  require('../app/models/site.server.model');
	require('../app/models/user.server.model');
	return db;
};
