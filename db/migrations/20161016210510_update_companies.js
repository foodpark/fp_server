exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("companies", function (t) {
        t.boolean('stub');
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.table("companies", function (t) {
         t.dropColumn('stub');
     })
  ]);
};
