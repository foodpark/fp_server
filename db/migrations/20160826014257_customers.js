exports.up = function(knex, Promise){}; /*function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('customers', function(t) {
      t.increments();

      t.string('name');
      t.string('description');
      t.string('photo');

      t.string('facebook');
      t.string('twitter');

      t.string('city');
      t.string('state');
      t.string('country');

      t.boolean('power_reviewer');

      t.integer('user_id').references('users.id');

      t.timestamps();
    }),
  ]);
};*/

exports.down = function(knex, Promise){}; /*function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('customers')]);
};*/
