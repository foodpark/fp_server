exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('roles', function(t) {
        t.increments();
        t.string('type').notNullable().unique();
      }).then(function() {
        return knex.raw('INSERT INTO roles (id,type) VALUES ' +
          '(1,\'CUSTOMER\'),' +
          '(2,\'OWNER\'),' +
          '(3,\'UNITMGR\'),' +
          '(4,\'ADMIN\');' );
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('roles')]);
};
