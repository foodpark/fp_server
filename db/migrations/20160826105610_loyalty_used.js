exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('loyalty_used', function(t) {
      t.increments();

      t.integer('amount');
      t.integer('order_hist_id').references('order_history.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('loyalty_used')]);
};
