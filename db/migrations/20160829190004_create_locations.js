exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('locations', function(t) {
      t.increments();
      t.string('name');
      t.string('type');
      t.string('main_loc_text'); //This is the first address line, including immediately suggestive names for customers
      t.string('secondary_loc_text'); //This is the second address line
      t.string('regex_seed'); //This is the matching string for type-in checkins
      t.integer('hitcount'); //Track popularity of the location
      t.integer('city_id'); //This is the territory info
      t.float('latitude');
      t.float('longitude');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('locations')]);
};
