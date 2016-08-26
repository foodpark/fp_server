exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('food_parks', function(t) {
      t.increments();

      t.string('name');
      t.string('photo');

      t.string('city');
      t.string('state');
      t.string('postal_code');
      t.string('country');

      t.float('latitude');
      t.float('longitude');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('food_parks')]);
};
