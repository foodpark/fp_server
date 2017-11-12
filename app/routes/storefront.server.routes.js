var storefront = require('../../app/controllers/storefront.server.controller');
var foodpark = require('../../app/controllers/foodpark.server.controller');
var auth = require('../../app/controllers/authentication.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');

var ADMIN       = 'ADMIN',
    OWNER       = 'OWNER',
    UNITMGR     = 'UNITMGR',
    CUSTOMER    = 'CUSTOMER',
    FOODPARKMGR = 'FOODPARKMGR';

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.use(passport.authenticate(['jwt','anonymous'], {session:false}));

  router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems)
	router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', storefront.listMenuItems)
	router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
	router.get(apiversion + '/companies', storefront.listCompanies)


  router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
  router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
	router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId', storefront.readMenuItem)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory)
	router.get(apiversion + '/companies/:companyId', storefront.readCompany)

  /* Food Park Management */
  router.get(apiversion + '/foodparks/:foodParkId/checkins', requireJWT, foodpark.getFoodParkCheckins)
  router.get(apiversion + '/foodparks/:foodParkId/units', requireJWT, foodpark.getFoodParkUnits)
  router.get(apiversion + '/foodparks/:foodParkId/units/actives_orders', requireJWT, foodpark.getUnitsActiveOrders)
  router.post(apiversion + '/foodparks/:foodParkId/units', requireJWT, foodpark.addFoodParkUnits)
  router.delete(apiversion + '/foodparks/:foodParkId/units/:unitId', requireJWT, foodpark.removeFoodParkUnits)

  router.post(apiversion + '/companies/:companyId/images',  requireJWT, storefront.uploadCompanyPhoto)
  router.post(apiversion + '/companies/:companyId/featureddish',  requireJWT, storefront.uploadCompanyFeaturedDish)
	router.post(apiversion + '/companies/:companyId/categories', requireJWT, storefront.createCategory)
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', requireJWT, storefront.createMenuItem)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/images',  requireJWT, storefront.uploadMenuItemImage)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems', requireJWT, storefront.createOptionItem)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories', requireJWT, storefront.createOptionCategory)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', requireJWT, storefront.createOptionItem)

  router.put(apiversion + '/companies/:companyId/categories/:categoryId', requireJWT, storefront.updateCategory);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId', requireJWT, storefront.updateMenuItem);
	router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.updateOptionCategory);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);


	router.delete(apiversion + '/companies/:companyId',requireJWT, storefront.deleteCompany);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId',requireJWT, storefront.deleteCategory);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId', requireJWT, storefront.deleteMenuItem);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/images/:imageId', requireJWT, storefront.deleteImage)
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.deleteOptionCategory);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);

  router.param('menuItemId', storefront.getMenuItem);
  router.param('categoryId', storefront.getCategory);
  router.param('companyId', storefront.getCompany);

  /* Food Park Management */
  router.param('foodParkId', foodpark.getFoodPark);
  router.param('unitId', foodpark.getFoodParkUnitId);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
