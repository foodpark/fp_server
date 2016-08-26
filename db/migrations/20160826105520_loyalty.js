exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('loyalty', function(t) {
      t.increments();

      t.integer('amount');

      t.integer('user_id').references('users.id');
      t.integer('company_id').references('companies.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('loyalty')]);
};

