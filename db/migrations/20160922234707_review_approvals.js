exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('review_approvals', function(t) {
      t.integer('reviewer_id').references('admins.id');
    }),
  ]);
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('review_approvals', function(t){
      t.dropColumn('reviewer_id');
    })
  ])
};
