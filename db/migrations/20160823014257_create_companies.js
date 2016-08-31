exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('companies', function(t) {
      t.increments();
      t.string('name');
      t.string('order_sys_id');
      t.string('base_slug');
      t.string('default_cat');
      t.string('description');
      t.string('email');
      t.string('facebook');
      t.string('twitter');
      t.string('photo');
      t.string('featured_dish');
      t.string('hours');
      t.string('schedule');
      t.string('city');
      t.string('state');
      t.string('country');
      t.string('taxband');
      t.integer('user_id').references('users.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('companies')]);
};
