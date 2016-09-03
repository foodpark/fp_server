exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('units', function(t) {
      t.increments();

      t.string('name');
      t.string('type');
      t.string('username');
      t.string('password');
      t.integer('number');
      t.string('qr_code');
      t.float('latitude');
      t.float('longitude');

      t.integer('unit_order_sys_id');
      t.integer('company_id').references('companies.id');
      t.integer('unit_mgr_id').references('users.id');

      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('units')]);
};
