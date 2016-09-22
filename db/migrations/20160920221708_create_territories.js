
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('territories', function(t) {
      t.increments();
      t.string('common_name');
      t.string('unique_name');
      t.string('state');
      t.string('country');
      t.string('timezone');
      t.float('latitude');
      t.float('longitude');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('territories')]);
};
