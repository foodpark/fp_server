exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.table("customers", function (t) {
        t.text('device_id');
      }),

        knex.schema.table("units", function (t) {
        t.text('device_id');
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("customers", function (t) {
      t.integer('device_id');
    }),
    knex.schema.table("units", function (t) {
      t.dropColumn('device_id');
    })
  ]);
};
