exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('unit_types', function(t) {
        t.increments();
        t.string('type').notNullable().unique();
      }).then(function() {
        return knex.raw('INSERT INTO unit_types (id,type) VALUES ' +
          '(1,\'TRUCK\'),' +
          '(2,\'CART\'),' +
          '(3,\'RESTAURANT\');' );
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('roles')]);
};
