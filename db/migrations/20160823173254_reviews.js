exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('reviews', function(t) {
      t.increments();

      t.integer('user_id').references('users.id');
      t.integer('site_id').references('sites.id');

      t.text('comment');
      t.decimal('rating', 2, 1);
      t.specificType('answers', 'jsonb[]');

      t.string('status');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('reviews')]);
};
