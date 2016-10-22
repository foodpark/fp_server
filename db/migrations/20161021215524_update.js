exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("companies", function (t) {
        t.text('business_address');
        t.text('phone');
      }),
      knex.schema.raw('alter table order_history modify order_sys_order_id text'),
      knex.schema.raw('alter table customers modify device_id text'),
      knex.schema.raw('alter table units modify unit_order_sys_id text'),
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
     knex.schema.raw('alter table order_history modify order_sys_order_id integer'),
     knex.schema.raw('alter table customers modify device_id integer'),
     knex.schema.raw('alter table units modify unit_order_sys_id integer'),
     knex.schema.table("order_history", function (t) {
       t.dropColumn('manual_pickup');
     }),
  ]);
};
