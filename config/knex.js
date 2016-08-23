var config = require('./config');
var Knex = require('knex');
console.log('PG: ' + config.pg_connection_string);
module.exports = Knex({ client: 'pg', connection: config.pg_connection_string });
