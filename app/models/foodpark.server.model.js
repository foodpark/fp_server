var knex = require('../../config/knex');
var debug = require('debug')('food_parks.model');

exports.getMainHubsInTerritory = function(territoryId) {
  return  knex('food_parks').where('type', 'MAIN').andWhere('territory_id', territoryId);
}

exports.getMainHub = function(id) {
  return knex('food_parks').select().where('type', 'MAIN').where('id', id);
}

exports.getAllFoodParks = function() {
  return knex('food_parks').select();
};

exports.getSingleFoodPar = function(id) {
  return knex('food_parks').select().where('id', id);
};

exports.getFoodParkUnits = function(id) {
  return knex.raw(`select units.*, companies.name as "company_name", companies.order_sys_id, companies.base_slug, companies.default_cat, companies.daily_special_cat_id,  
                  companies.daily_special_item_id, companies.delivery_chg_cat_id, companies.delivery_chg_item_id, companies.delivery_chg_amount, companies.description, 
                  companies.email, companies.phone, companies.facebook, companies.twitter, companies.instagram, companies.featured_dish, companies.hours, companies.schedule, 
                  companies.business_address, companies.city, companies.state, companies.country, companies.country_id, companies.taxband, companies.tags, companies.stub, companies.calculated_rating, companies.show_vendor_setup,
                  companies.user_id as "owner_id", companies.veritas_id, countries.moltin_client_id, countries.moltin_client_id, countries.moltin_client_secret, countries.currency, 
                  countries.currency_id, checkins.check_in, checkins.check_out from food_park_management fm right join units on fm.unit_id = units.id 
                  inner join companies on units.company_id = companies.id inner join countries on companies.country_id = countries.id left outer join checkins on 
                  checkins.unit_id = units.id and checkins.food_park_id=${id} and 
                  checkins.check_in = (select max ("check_in") from checkins where checkins.unit_id = units.id and checkins.food_park_id = ${id}) and 
                  checkins.check_out = (select max ("check_out") from checkins where checkins.unit_id = units.id and checkins.food_park_id=30019)
                  where fm.food_park_id = ${id};`);
};

exports.getFoodParkCompanies = function (id) {
  return knex.raw(`select companies.* from food_park_management fp join units on fp.unit_id = units.id join companies on companies.id = units.company_id where fp.food_park_id = ${id} group by companies.id `);
};

exports.addFoodParkUnits = function(b) {
  return knex('food_park_management').insert(b);
};

exports.removeFoodParkUnits = function(b) {
  return knex('food_park_management').where(b).delete();
};

exports.setManager = function (foodParkId, userId) {
  return knex('food_parks').where('id', foodParkId).update('foodpark_mgr', userId);
};

exports.getFoodParkManagedUnits = function (foodParkId) {
  return knex('food_park_management').select('unit_id').where({food_park_id: foodParkId});
};

exports.getAllDrivers = function (foodParkId) {
  return knex.raw(`select users.*, df.available from drivers_foodpark df right join users on df.user_id = users.id where df.food_park_id = ${foodParkId};`);
};

exports.setAvailable = function (foodParkId, driverId, available) {
  console.log('setting availability');
  return knex('drivers_foodpark').update({available : available}).where({food_park_id : foodParkId, user_id : driverId });
};

exports.getManagedUnits = function (userId) {
  return knex.raw(`select units.* from food_park_management fm right join units on fm.unit_id = units.id left join food_parks on fm.food_park_id = food_parks.id where foodpark_mgr = ${userId};`)
};

exports.addDriver = function (driverFoodpark) {
  console.log('adding driver');
  return knex('drivers_foodpark').insert(driverFoodpark);
};

exports.deleteDriver = function (driverFoodpark) {
  console.log('deleting driver');
  return knex('drivers_foodpark').where(driverFoodpark).del();
};

exports.getManagedFoodPark = function (userId) {
  return knex('food_parks').select().where({foodpark_mgr : userId});
};

