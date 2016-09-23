
exports.up = function (knex, Promise) {
  return Promise.all([
      knex.schema.table("territories", function (t) {
        t.renameColumn("common_name", "city");
        t.renameColumn("unique_name", "territory");
      }),
    knex.schema.table("locations", function (t) {
      t.dropColumn("city_id");
      t.integer("territory_id").references("territories.id");
    }),
    knex.schema.table("search_preferences", function (t) {
      t.integer("territory_id").references("territories.id");
    }),
    knex.schema.table("food_parks", function (t) {
      t.integer("territory_id").references("territories.id");
    }),
    knex.schema.table("units", function (t) {
      t.integer("territory_id").references("territories.id");
    })
  ]);
};

exports.down = function (knex, Promise) {
  return Promise.all([
      knex.schema.table("territories", function (t) {
        t.renameColumn("city", "common_name");
        t.renameColumn("territory", "unique_name");
      }),
      knex.schema.table("locations", function (t) {
        t.dropForeign("territory_id");
        t.dropColumn("territory_id");
        t.integer("city_id");
      }),
      knex.schema.table("search_preferences", function (t) {
        t.dropForeign("territory_id");
        t.dropColumn("territory_id");
      }),
      knex.schema.table("food_parks", function (t) {
        t.dropForeign("territory_id");
        t.dropColumn("territory_id");
      }),
      knex.schema.table("units", function (t) {
        t.dropForeign("territory_id");
        t.dropColumn("territory_id");
      })
  ]);
};
