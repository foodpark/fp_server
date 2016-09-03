var knex = require('../../config/knex');


/**CREATE TABLE checkins (
  ID SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES unit (id),
  point GEOMETRY NOT NULL,
  food_park_id INTEGER REFERENCES food_park (id),
  checkin TIMESTAMP,
)
**/

exports.findByTimeBox = function(lat1, lon1, lat2, lon2, searchtime) {
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
  return knex('checkins').whereBetween('latitude', [minlon, maxlon]).andWhereBetween('longitude', [minlon, maxlon]).andWhere('check_in','<',searchtime).andWhere('check_out','>',searchtime)
};
