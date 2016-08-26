exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('admins', function(t) {
      t.increments();

      t.string('name');
      t.string('description');
      t.string('photo');

      t.string('city');
      t.string('state');
      t.string('country');

      t.boolean('super_admin');

      t.integer('user_id').references('users.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('admins')]);
};
