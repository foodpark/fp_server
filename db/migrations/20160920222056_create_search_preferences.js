
exports.up = function(knex, Promise) {
    return Promise.all([
      knex.schema.createTable('search_preferences', function(t) {
        t.increments();
        t.integer('user_id');
        t.float('distance');
        t.timestamps();
      }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('search_preferences')]);
};
