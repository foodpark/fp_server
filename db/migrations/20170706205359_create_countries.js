exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('countries', function(t) {
      t.increments();
      t.string('name');
      t.boolean('is_enabled');
    }).then(function() {
      return knex.raw('INSERT INTO countries (id,name,is_enabled) VALUES ' +
        '(1,\'Brazil\',\'true\'),' +
        '(2,\'USA\',\'false\');' );
    }).then(function() {
        return knex.raw('create sequence countries_id_seq increment 1 minvalue 3;');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.raw('drop sequence countries_id_seq'),knex.schema.dropTable('countries')]);
};