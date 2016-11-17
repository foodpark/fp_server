exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("companies", function (t) {
        t.text('business_address');
        t.text('phone');
      }),
      knex.schema.raw('alter table order_history alter column order_sys_order_id type text'),
      knex.schema.raw('alter table customers alter column device_id type text'),
      knex.schema.raw('alter table units alter column unit_order_sys_id type text'),
      knex.schema.table("order_history", function (t) {
        t.boolean('manual_pickup');
      }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("companies", function (t) {
         t.dropColumn('business_address');
         t.dropColumn('phone');
     }),
     knex.schema.raw('alter table order_history alter column order_sys_order_id type integer'),
     knex.schema.raw('alter table customers alter column device_id type integer'),
     knex.schema.raw('alter table units alter column unit_order_sys_id type integer'),
     knex.schema.table("order_history", function (t) {
       t.dropColumn('manual_pickup');
     }),
  ]);
};
