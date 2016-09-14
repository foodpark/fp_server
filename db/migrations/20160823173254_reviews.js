exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('reviews', function(t) {
      t.increments();

      t.integer('customer_id').references('customers.id');

      t.integer('company_id').references('companies.id');
      t.integer('unit_id').references('units.id');

      t.string('comment');
      t.decimal('rating', 2, 1);
      t.specificType('answers', 'json');

      t.string('status');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('reviews')]);
};
