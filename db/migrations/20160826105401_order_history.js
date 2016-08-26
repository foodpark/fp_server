exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('order_history', function(t) {
      t.increments();
      t.integer('order_sys_order_id');

      t.dateTime('purchase_date');
      t.decimal('amount');

      t.integer('user_id').references('users.id');
      t.integer('site_id').references('sites.id');
      t.integer('company_id').references('companies.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('order_history')]);
};
