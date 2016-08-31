var knex = require('../../config/knex');


/**CREATE TABLE checkins (
  ID SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES unit (id),
  point GEOMETRY NOT NULL,
  food_park_id INTEGER REFERENCES food_park (id),
  checkin TIMESTAMP,
)
**/
