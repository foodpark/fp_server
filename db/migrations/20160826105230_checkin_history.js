
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('checkin_history', function(t) {
      t.increments();

      t.string('site_name');
      t.integer('site_id').references('sites.id');
      t.string('company_name');
      t.integer('company_id').references('companies.id');

      t.dateTime('check_in');
      t.dateTime('check_out');

      t.float('latitude');
      t.float('longitude');

      t.string('food_park_name');
      t.integer('food_park_id').references('food_parks.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('checkin_history')]);
};
