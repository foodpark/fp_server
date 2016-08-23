exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('sites', function(t) {
      t.increments();

      t.string('name');
      t.string('type');

      t.float('latitude');
      t.float('longitude');

      t.integer('company_id').references('companies.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('sites')]);
};
