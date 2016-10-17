exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
        t.specificType('moltin_order_detail', 'json');
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
         t.dropColumn('moltin_order_detail');
     })
  ]);
};
