exports.up = function(knex, Promise) {
    return knex.schema.table('drivers', function(t) {
        t.integer('user_id').references('users.id');
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('drivers', function(t) {
        t.dropColumn('user_id');
    });
};