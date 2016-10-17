exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
        t.specificType('order_sys_order_detail', 'json');
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
         t.dropColumn('order_sys_order_detail');
     })
  ]);
};
