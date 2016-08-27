var knex = require('../../config/knex');


/**CREATE TABLE checkins (
  ID SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES site (id),
  point GEOMETRY NOT NULL,
  food_park_id INTEGER REFERENCES food_park (id),
  checkin TIMESTAMP,
)
**/
