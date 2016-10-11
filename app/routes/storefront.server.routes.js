var storefront = require('../../app/controllers/storefront.server.controller');
var auth = require('../../app/controllers/authentication.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');

var ADMIN     = 'ADMIN',
    OWNER     = 'OWNER',
    UNITMGR   = 'UNITMGR',
    CUSTOMER  = 'CUSTOMER';

var requireJWT = passport.authenticate('jwt', { session: false });

module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.use(passport.authenticate(['jwt','anonymous'], {session:false}));

  //router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems)
	router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', storefront.listMenuItems)
	router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
	router.get(apiversion + '/companies', storefront.listCompanies)


//  router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
  router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
	router.get(apiversion + '/companies/:companyId/menuitems/:menuItemId', storefront.readMenuItem)
	router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory)
	router.get(apiversion + '/companies/:companyId', storefront.readCompany)

	router.post(apiversion + '/companies/:companyId/categories', requireJWT, storefront.createCategory)
  router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', requireJWT, storefront.createMenuItem)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories', requireJWT, storefront.createOptionCategory)
  router.post(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', requireJWT, storefront.createOptionItem)

  router.post(apiversion + '/companies/:companyId//menuitems/:menuItemId/optionitems', requireJWT, storefront.createOptionItem)

  router.put(apiversion + '/companies/:companyId/categories/:categoryId', requireJWT, storefront.updateCategory);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId', requireJWT, storefront.updateMenuItem);
	router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.updateOptionCategory);
  router.put(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT, storefront.updateOptionItem);

	router.delete(apiversion + '/companies/:companyId/categories/:categoryId',requireJWT, storefront.deleteCategory);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId', requireJWT, storefront.deleteMenuItem);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId', requireJWT,  storefront.deleteOptionCategory);
  router.delete(apiversion + '/companies/:companyId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', requireJWT,  storefront.deleteOptionItem);

  router.param('menuItemId', storefront.getMenuItem);
  router.param('categoryId', storefront.getCategory);
  router.param('companyId', storefront.getCompany);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
