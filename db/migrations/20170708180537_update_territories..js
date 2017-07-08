
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("countries", function (t) {
        t.integer('country_id').references('countries.id');
      }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("countries", function (t) {
      t.dropColumn('country_id');
    })
  ]);
};
