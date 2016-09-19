// Moved contents of file 20160826014257_customers.js to this filename
// because of a reference in reviews to the customers.id field. - jndcfc8

exports.up = function(knex, Promise) {
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
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('customers')]);
};
