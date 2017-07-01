exports.up = function(knex, Promise) {
  return Promise.all([
        knex.raw('INSERT INTO roles (id,type) VALUES ' +
          '(5,\'DRIVER\');' )
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
        knex.raw('delete from roles where id=5;' )
  ]);
};
