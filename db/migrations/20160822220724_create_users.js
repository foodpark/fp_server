
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(t) {
      t.increments();
      t.string('name');
      t.string('email');
      t.string('username');
      t.string('password');
      t.string('role');
      t.string('provider');
      t.string('provider_id');
      t.json('provider_data');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('users')]);
};
