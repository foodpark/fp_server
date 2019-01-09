var knex = require('../../config/knex');

exports.getPodManagersInMainHub = function(foodparkId) {
  let customQuery = `select users.* from users INNER JOIN churches ON users.id=churches.user_id where churches.main_hub_id=${foodparkId}`
  
  return knex.raw(customQuery);
}
