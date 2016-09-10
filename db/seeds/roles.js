
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('roles').insert({id: 1, type: 'CUSTOMER'}),
        knex('roles').insert({id: 2, type: 'OWNER'}),
        knex('roles').insert({id: 3, type: 'UNITMGR'})
        knex('roles').insert({id: 4, type: 'ADMIN'})
      ]);
    });
};
