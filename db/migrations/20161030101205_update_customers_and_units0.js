
exports.up = function(knex, Promise) {
  return Promise.all([
        knex.schema.table("customers", function (t) {
        t.text('phone');
      }),
        knex.schema.table("units", function (t) {
        t.text('phone');
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("customers", function (t) {
      t.dropColumn('phone');
    }),
    knex.schema.table("units", function (t) {
      t.dropColumn('phone');
    })
  ]);
};
