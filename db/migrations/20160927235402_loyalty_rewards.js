exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('loyalty_rewards', function(t) {
      t.increments();

      t.integer('company_id').references('companies.id');

      t.string('gold_reward_item');
      t.string('silver_reward_item');
      t.string('bronze_reward_item');
      t.timestamps();
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('loyalty_rewards')]);
};
