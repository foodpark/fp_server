var db_config = require('../../config/knex'),
    pg = require('knex')(db_config);

    /**
    CREATE TABLE companies (
      ID SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      order_sys_id TEXT NOT NULL,
      base_slug TEXT NOT NULL,
      default_cat TEXT NOT NULL,
      description TEXT,
      email TEXT,
      facebook TEXT,
      twitter TEXT,
      photo TEXT,
      featured_dish TEXT,
      hours TEXT,
      schedule TEXT,
      city TEXT,
      state TEXT,
      country TEXT,
      taxband TEXT,
      user_id INTEGER REFERENCES users (id),
      created TIMESTAMP DEFAULT current_timestamp
    ) **/

exports.getAllCompanies = function () {
  db.any('select * from companies')
    .then(function (data) {
      return(data)
    })
    .catch(function (err) {
      return (err);
    });
}
exports.getSingleCompany = function (id) {
  db.one('select * from companies where id = $1', id)
    .then(function (data) {
      return (data)
    })
    .catch(function (err) {
      return (err);
    });
}
exports.createCompany = function (name, email, userId, moltCoId, moltDefCat, moltSlug, callback) {
  console.log('userId: ' +userId)
  pg('companies').insert(
    {
      name: name,
      email: email,
      user_id: parseInt(userId),
      order_sys_id: moltCoId,
      default_cat: moltDefCat,
      base_slug: moltSlug
    }).returning('id').asCallback(callback)
}
