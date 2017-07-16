var knex  = require('../../config/knex');
var debug = require('debug')('company.model');


exports.companyForCompanyName = function(companyName) {
  return knex('companies').select('*').where('name', 'ILIKE', companyName)
};

exports.companyForUser = function(userId) {
  return knex('companies').select('*').where('user_id', userId)
};

exports.getAllCompanies = function() {
  return knex('companies').select('*')
};

exports.getSingleCompany = function(id) {
  return knex('companies').select('*').where('id', id)

};

exports.getForUser = function(userId) {
  return knex('companies').select('*').where('user_id', userId)
};

exports.updateFeaturedDish = function(companyId, cdnPath) {
  var hash = { featured_dish : cdnPath }
  return knex('companies').update(hash).where('id', companyId).returning('*')
};

exports.updatePhoto = function(companyId, cdnPath) {
  var hash = { photo : cdnPath }
  return knex('companies').update(hash).where('id', companyId).returning('*')
};

exports.verifyOwner = function(companyId, userId) {
  return knex('companies').select('*').where({
    id: companyId,
    user_id: userId
  })
};

exports.createCompany = function(name, email, userId, moltCoId, moltDefCat, moltSlug, 
  deliveryCat, deliveryItem, deliveryChgAmount, dailySpecialCat, countryId) {
  return knex('companies').insert(
    {
      name: name,
      email: email,
      user_id: parseInt(userId),
      order_sys_id: moltCoId,
      default_cat: moltDefCat,
      delivery_chg_cat_id: deliveryCat,
      delivery_chg_item_id: deliveryItem,
      delivery_chg_amount: deliveryChgAmount,
      daily_special_cat_id: dailySpecialCat,
      base_slug: moltSlug,
      country_id: countryId
    }).returning('*');
};

exports.deleteCompany = function(companyId) {
  return knex('companies').where('id', companyId).del();
};
