exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.raw('alter table companies alter column tags type text')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
      knex.schema.raw('alter table companies alter column tags type json')
  ]);
};
