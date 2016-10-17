
exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.table("units", function (t) {
        t.integer('prep_notice');
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([

        knex.schema.table("units", function (t) {
        t.dropColumn('prep_notice');
      })
    ]);
};
