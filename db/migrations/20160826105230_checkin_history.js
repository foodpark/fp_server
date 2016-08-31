
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('checkin_history', function(t) {
      t.increments();

      t.string('unit_name');
      t.integer('unit_id').references('units.id');
      t.string('company_name');
      t.integer('company_id').references('companies.id');
      t.integer('user_id').references('users.id'); //User who created checkin history
      t.dateTime('service_cancellation_time');  //If you need to invalidate this history
      t.dateTime('check_in');
      t.dateTime('check_out');

      t.float('latitude');
      t.float('longitude');

      t.string('food_park_name');
      t.integer('food_park_id').references('food_parks.id');
      t.string('note');
      t.string('display_address'); //The address displayed to customers

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('checkin_history')]);
};
