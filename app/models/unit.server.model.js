var knex = require('../../config/knex');
var Checkin = require ('../models/checkin.server.model');

/**
CREATE TABLE units (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  number SERIAL NOT NULL,
  description TEXT,
  username TEXT,
  password TEXT,
  qrCode TEXT,
  unit_order_sys_id INTEGER,
  company_id INTEGER REFERENCES companies (id),
  unit_mgr_id INTEGER REFERENCES users (id)
)
**/

exports.getSingleUnit = function(id) {
  return knex('units').select().where('id', id)
};

exports.findByCheckinTimebox = function(latitude, longitude, distance, searchtime, callback) {
  var earth = 6371;  // earth radius in km
  var lat1 = latitude + 180/Math.PI * (distance/earth);
  var lat2 = latitude - 180/Math.PI * (distance/earth);
  var lon1 = longitude - 180/Math.PI * (distance/earth/Math.cos(latitude * Math.PI/180));
  var lon2 = longitude + 180/Math.PI * (distance/earth/Math.cos(latitude * Math.PI/180));
  console.log(lat1 + ", "+ lon1  + " " + lat2 + ", " + lon2 + " d:" + distance);
  if (lat1 < lat2) {
    var minlat = lat1;
    var maxlat = lat2;
  } else {
    var minlat = lat2;
    var maxlat = lat1;
  }
  if (lon1 < lon2) {
    var minlon = lon1;
    var maxlon = lon2;
  } else {
    var minlon = lon2;
    var maxlon = lon1;
  }
  return knex('checkins').select(['units.id as id','units.name','companies.name as company_name','units.number','units.customer_order_window','units.territory_id','units.type','units.description','units.qr_code','units.unit_order_sys_id','checkins.latitude','checkins.longitude','checkins.company_id','checkins.check_in','checkins.check_out','companies.tags']).whereBetween('latitude', [minlat, maxlat]).andWhereBetween('longitude', [minlon, maxlon]).andWhere('check_in','<',searchtime).andWhere('check_out','>',searchtime).innerJoin('units','units.id','checkins.unit_id').innerJoin('companies','companies.id','checkins.company_id').on('query-response', function(response, obj, builder) {});
  //.then( function(response) {
  //  var idList = response.map(function(obj){
  //   return obj['unit_id'];
  //  });
  //  return idList;
  //}).then( function(idList) {
  //  //fix response object: only return desired columns AND join the lat-lon
  //   return knex('units').select(['id','name','number','type','description','qr_code','unit_order_sys_id','company_id','updated_at']).whereIn('id', idList).on('query-response', function(response, obj, builder) {}).then( function(response) {
  //      return response;
  //  }).catch(console.log.bind(console));
  //}).catch(console.log.bind(console));
};

exports.findByLatLonBox = function(lat1, lon1, lat2, lon2, callback) {
  if (lat1 < lat2) {
    var minlat = lat1;
    var maxlat = lat2;
  } else {
    var minlat = lat2;
    var maxlat = lat1;
  }
  if (lon1 < lon2) {
    var minlon = lon1;
    var maxlon = lon2;
  } else {
    var minlon = lon2;
    var maxlon = lon1;
  }
  return knex('units').select(['id','name','number','customer_order_window','territory_id','type','description','qr_code','unit_order_sys_id']).whereBetween('latitude', [minlon, maxlon]).andWhereBetween('longitude', [minlon, maxlon])
};


exports.findUniqueUnitName = function(company, unitName, suffix, callback) {
    var _this = this;
    var possibleName = unitName + (suffix || '');

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

exports.verifyUnitManager = function(companyId, unitId, unitMgrId) {
  return knex('units').select('*').where({
    id: unitId,
    company_id: companyId,
    unit_mgr_id: unitMgrId
  })
};

exports.getForUser = function(userId) {
  return knex('units').select().where('unit_mgr_id', userId);
};
