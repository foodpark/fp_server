exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("checkins", function (t) {
      t.text('display_address');
      t.text('food_park_name');
      t.integer('food_park_id').references('food_parks.id');
    }),

      knex.schema.table("order_history", function (t) {
      t.dropColumn('prep_notice_time');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("checkins", function (t) {
    t.dropColumn('display_address');
    t.dropColumn('food_park_name');
    t.dropForeign("food_park_id");
    t.dropColumn('food_park_id');
  }),
    knex.schema.table("order_history", function (t) {
    t.float('prep_notice_time');
    })
]);
};
