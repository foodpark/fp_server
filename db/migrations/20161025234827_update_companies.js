exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.raw('alter table companies modify tags text')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.raw('alter table companies modify tags json')
  ]);
};
