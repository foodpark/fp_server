var knex = require('../../config/knex');

exports.isCompanyFound = function(companyId) {
  return knex('loyalty_rewards').select('id').where('company_id', parseInt(companyId));
}
