
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("order_history", function (t) {
        t.dropColumn('customer_order_window');
        t.dropColumn('latitude');
        t.dropColumn('longitude');
        t.renameColumn('purchase_date','initiation_time');
        t.renameColumn('pickup_time','actual_pickup_time');
        t.renameColumn('prep_time_notice','prep_notice_time');
        t.renameColumn('qr_audit','qr_code');
        t.dateTime('desired_pickup_time');
        t.integer('checkin_id').references('checkins.id');
      }),
      knex.schema.table("units", function (t) {
        t.string("fcm_id");
      }),
      knex.schema.table("customers", function (t) {
        t.string("fcm_id");
        t.string("device_id");
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table("order_history", function (t) {
      t.integer('customer_order_window');
      t.float('latitude');
      t.float('longitude');
      t.renameColumn('initiation_time', 'purchase_date');
      t.renameColumn('actual_pickup_time', 'pickup_time');
      t.renameColumn('prep_notice_time', 'prep_time_notice');
      t.renameColumn('qr_code', 'qr_audit');
      t.dropColumn('desired_pickup_time');
      t.dropForeign("checkin_id");
      t.dropColumn('checkin_id');
    }),
    knex.schema.table("units", function (t) {
      t.dropColumn("fcm_id");
    }),
    knex.schema.table("customers", function (t) {
      t.dropColumn("fcm_id");
      t.dropColumn("device_id");
    })
  ]);
};
