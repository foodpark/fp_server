exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('review_states', function(t) {
      t.integer('id').primary();
      t.string('name');
      t.specificType('allowed_transitions', 'integer[]');
    }).then(function() {
      return knex.raw('INSERT INTO review_states (id,name,allowed_transitions) VALUES ' +
        '(1,\'New\',\'{2,3,4}\'),' +
        '(2,\'Approved\',\'{3}\'),' +
        '(3,\'Updated\',\'{2,4}\'),' +
        '(4,\'Disapproved\',\'{3}\');' );
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('review_states')]);
};
