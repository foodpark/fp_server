exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('checkins', function(t) {
      t.increments();

      t.dateTime('check_in');
      t.dateTime('check_out');

      t.integer('company_id').references('companies.id');
      t.integer('site_id').references('sites.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('checkins')]);
};
