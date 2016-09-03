exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('checkins', function(t) {
      t.increments();

      t.dateTime('check_in');
      t.dateTime('check_out');
      t.float('latitude');
      t.float('longitude');

      t.integer('company_id').references('companies.id');
      t.integer('unit_id').references('units.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('checkins')]);
};
