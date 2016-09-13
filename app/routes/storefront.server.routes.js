var storefront = require('../../app/controllers/storefront.server.controller');
var auth = require('../../app/controllers/authentication.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');

module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.use(passport.authenticate(['jwt','anonymous'], {session:false}));
	router.post(apiversion + '/companies/:companyId/categories', auth.roleAuthorization("Owner"), storefront.createCategory)
	router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
  router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory);
	router.put(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.updateCategory);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.deleteCategory);
	router.param('companyId', storefront.getCompany);
	router.param('categoryId', storefront.getCategory);

  router.post(apiversion + '/menuitems', auth.roleAuthorization("Owner"), storefront.createMenuItem)
	router.get(apiversion + '/menuitems', storefront.listMenuItems);
  router.get(apiversion + '/menuitems/:menuItemId', storefront.readMenuItem);
	router.put(apiversion + '/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.updateMenuItem);
	router.delete(apiversion + '/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.deleteMenuItem);
	router.param('menuItemId', storefront.getMenuItem);

	router.post(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
	router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems);
	router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
	router.put(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	router.delete(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  router.post(apiversion + '/menuitems/:menuItemId/optioncategories', auth.roleAuthorization("Owner"), storefront.createOptionCategory)
	router.get(apiversion + '/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories);
	router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
	router.put(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.updateOptionCategory);
	router.delete(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.deleteOptionCategory);
	router.param('optionCategoryId', storefront.getOptionCategory);

  router.post(apiversion + '/menuitems/:menuItemId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
	router.get(apiversion + '/menuitems/:menuItemId/optionitems', storefront.listOptionItems);
  router.get(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', storefront.readOptionItem)
	router.put(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	router.delete(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  router.param('optionItemId', storefront.getOptionItem);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
