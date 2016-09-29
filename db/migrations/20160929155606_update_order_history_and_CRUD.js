
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
        t.dateTime('payment_time');
        t.dateTime('pickup_time');
        t.float('latitude');
        t.float('longitude');
        t.float('prep_time_notice');
        t.integer('customer_order_window');
        t.string('status');
        t.text('messages');
        t.text('qr_audit');
      }),
      knex.schema.table("units", function (t) {
        t.integer("customer_order_window");
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
         t.dropColumn('payment_time');
         t.dropColumn('pickup_time');
         t.dropColumn('latitude');
         t.dropColumn('longitude');
         t.dropColumn('prep_time_notice');
         t.dropColumn('customer_order_window');
         t.dropColumn('status');
         t.dropColumn('messages');
         t.dropColumn('qr_audit');
     }),
     knex.schema.table("units", function (t) {
       t.dropColumn("customer_order_window");
     })
  ]);
};
