
exports.up = function(knex, Promise) {
  return Promise.all([

        knex.schema.table("order_history", function (t) {
        t.dateTime('prep_notice_time');
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([

        knex.schema.table("order_history", function (t) {
        t.dropColumn('prep_notice_time');
      })
    ]);
};
