var knex = require('../../config/knex');

/**
CREATE TABLE units (
  ID SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  number SERIAL NOT NULL,
  description TEXT,
  username TEXT,
  password TEXT,
  qrCode TEXT,
  unit_order_sys_id INTEGER,
  company_id INTEGER REFERENCES companies (id),
  unit_mgr_id INTEGER REFERENCES users (id)
)
**/

exports.getSingleUnit = function(id) {
  return knex('units').select().where('id', id)
};

exports.findUniqueUnitName = function(company, unitName, suffix, callback) {
    var _this = this;
    var possibleName = unitName + (suffix || '');

    _this.findOne(
        {username: possibleUsername},
        function(err, user) {
            if (!err) {
                if (!user) {
                    callback(possibleUsername);
                }
                else {
                    return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
                }
            }
            else {
                callback(null);
            }
        }
    );
};
