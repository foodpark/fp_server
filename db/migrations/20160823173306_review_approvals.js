exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('review_approvals', function(t) {
      t.increments();

      t.integer('review_id').references('reviews.id');
      t.integer('reviewer_id').references('users.id');

      t.string('status');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('review_approvals')]);
};
