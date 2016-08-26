exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('favorites', function(t) {

      t.integer('user_id').references('users.id');
      t.integer('site_id').references('sites.id');
      t.integer('company_id').references('companies.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('favorites')]);
};
