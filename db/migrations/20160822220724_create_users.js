
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(t) {
      t.increments();
      t.string('first_name');
      t.string('last_name');
      t.string('username');
      t.string('password');
      t.string('role');
      t.string('provider');
      t.string('provider_id');
      t.json('provider_data');
      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('users')]);
};
