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
	var relApiversion = '/api/'+ config.apiVersion + '/rel';
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.use(passport.authenticate(['jwt','anonymous'], {session:false}));

  /* Food Park Management */
  router.get(relApiversion + '/food_parks/:foodParkId/checkins', requireJWT, foodpark.getFoodParkCheckins)
  router.get(relApiversion + '/food_parks/:foodParkId/units', requireJWT, foodpark.getFoodParkUnits)
  router.get(relApiversion + '/food_parks/:foodParkId/companies', requireJWT, foodpark.getFoodParkCompanies);
  router.get(relApiversion + '/food_parks/:foodParkId/units/active_orders', requireJWT, foodpark.getUnitsActiveOrders)
  router.get(relApiversion + '/food_parks/:foodParkId/orders/:orderId/drivers/:driverId', requireJWT, foodpark.getDriverByOrder)
  router.post(relApiversion + '/food_parks/:foodParkId/units', requireJWT, foodpark.addFoodParkUnits)
  router.put(relApiversion + '/food_parks/:foodParkId/orders/:orderId', requireJWT, foodpark.setDriverToOrder)
  router.delete(relApiversion + '/food_parks/:foodParkId/units/:fpUnitId', requireJWT, foodpark.removeFoodParkUnits)
  router.get(relApiversion + '/food_parks/:foodParkId/drivers', requireJWT, foodpark.getDrivers)
  router.post(relApiversion + '/food_parks/:foodParkId/drivers', requireJWT, foodpark.addDriver)
  router.delete(relApiversion + '/food_parks/:foodParkId/drivers/:userId', requireJWT, foodpark.deleteDriver)
  router.put(relApiversion + '/food_parks/:foodParkId/drivers/:userId/', requireJWT, foodpark.setAvailable)


  router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', storefront.listMenuItems)
	router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
	router.get(apiversion + '/companies',requireJWT, storefront.listCompanies)


  router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
  router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
	router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId', storefront.readMenuItem)
  router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId', storefront.readMenuItem)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory)
	router.get(apiversion + '/companies/:companyId', storefront.readCompany)

  router.get(relApiversion + '/companies/:companyId/units/:unitId', storefront.getCompanyUnit);


  router.post(apiversion + '/companies/:companyId/images',  requireJWT, storefront.uploadCompanyPhoto)
  router.post(apiversion + '/companies/:companyId/featureddish',  requireJWT, storefront.uploadCompanyFeaturedDish)
	router.post(apiversion + '/companies/:companyId/categories', requireJWT, storefront.createCategory)
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', requireJWT, storefront.createMenuItem)
  router.post(apiversion + '/companies/:companyId/categories/:categoryIdmenuitems/:menuItemId/images',  requireJWT, storefront.uploadMenuItemImage)
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/images',  requireJWT, storefront.uploadMenuItemImage)
  
  /* for create options without optionCategories ID */ 
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optionitems', requireJWT, storefront.createOptionItem)
  /*======= for create variations ===== */
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories', requireJWT, storefront.createOptionCategory)
  /* For create options with optionCategories ID */
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', requireJWT, storefront.createOptionItem)
  /*======= route for create modifer ======= */
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId/modifier', requireJWT, storefront.createModifier)
  
  router.put(apiversion + '/companies/:companyId/categories/:categoryId', requireJWT, storefront.updateCategory);
  router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId', requireJWT, storefront.updateMenuItem);
  router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);
  router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.updateOptionCategory);
  router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);
  /* for update modifer */
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId/modifier/:modifierId', requireJWT, storefront.updateModifier)

	router.delete(apiversion + '/companies/:companyId',requireJWT, storefront.deleteCompany);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId',requireJWT, storefront.deleteCategory);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId', requireJWT, storefront.deleteMenuItem);
  router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/images/:imageId', requireJWT, storefront.deleteImage)
  //router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);
  router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.deleteOptionCategory);
  router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);
  /* for delete modifer */
  router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId/modifier/:modifierId', requireJWT, storefront.deleteModifier)

  router.post(relApiversion + '/loyalty/redeem', requireJWT, storefront.redeemLoyalty);
  router.get(relApiversion + '/companies/:companyId/customers/:customerId/loyalty', requireJWT, storefront.getLoyaltyInfo);
  router.get(relApiversion + '/companies/:companyId/loyalty', requireJWT, storefront.getCompanyLoyaltyInfo);

  router.param('menuItemId', storefront.getMenuItem);
  router.param('categoryId', storefront.getCategory);
  router.param('companyId', storefront.getCompany);
  router.param('optionCategoryId', storefront.getoptionCategory);
  router.param('optionItemId', storefront.getoptionItem) ;
  router.param('modifierId', storefront.getmodifier) ;

  /* Food Park Management */
  router.param('foodParkId', foodpark.getFoodPark);
  router.param('fpUnitId', foodpark.getFoodParkUnitId);
  router.param('orderId', foodpark.getDriverByOrder);
  router.param('orderId', foodpark.setDriverToOrder);
  router.param('driverId', foodpark.getDriverByOrder);
  router.param('userId', foodpark.getUser);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
