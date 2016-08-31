module.exports = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  directory: __dirname + '/migrations',
  pool: {
    min: 0,
    max: 7
  },
  tableName: 'migrations'
};
