var storefront = require('../../app/controllers/storefront.server.controller');
var auth = require('../../app/controllers/authentication.server.controller');
var config = require('../../config/config');
var passport = require('passport');
var Router = require('koa-router');

var ADMIN     = 'ADMIN',
    OWNER     = 'OWNER',
    UNITMGR   = 'UNITMGR',
    CUSTOMER  = 'CUSTOMER';

module.exports=function(app) {
	var router = new Router();
	var apiversion = '/api/'+ config.apiVersion + '/mol';

	router.use(passport.authenticate(['jwt','anonymous'], {session:false}));

	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId', storefront.readMenuItem);
	router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory);
	router.get(apiversion + '/companies/:companyId', storefront.readCompany)

	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories);
	router.get(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', storefront.listMenuItems)
	router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
	router.get(apiversion + '/companies', storefront.listCompanies)


	router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', auth.roleAuthorization(OWNER, ADMIN), storefront.createOptionItem)
	router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories', auth.roleAuthorization(OWNER, ADMIN), storefront.createOptionCategory)
	router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optionitems', auth.roleAuthorization(OWNER, ADMIN), storefront.createOptionItem)
	router.post(apiversion + '/companies/:companyId/categories/:categoryId/menuitems', auth.roleAuthorization(OWNER, ADMIN), storefront.createMenuItem)
	router.post(apiversion + '/companies/:companyId/categories', auth.roleAuthorization(OWNER, ADMIN), storefront.createCategory)

	router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization(OWNER, ADMIN), storefront.updateOptionItem);
	router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization(OWNER, ADMIN),  storefront.updateOptionCategory);
	router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization(OWNER, ADMIN), storefront.updateOptionItem);
	router.put(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId', auth.roleAuthorization(OWNER, ADMIN), storefront.updateMenuItem);
	router.put(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization(OWNER, ADMIN), storefront.updateCategory);

	router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization(OWNER, ADMIN),  storefront.deleteOptionItem);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization(OWNER, ADMIN),  storefront.deleteOptionCategory);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization(OWNER, ADMIN),  storefront.deleteOptionItem);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId/menuitems/:menuItemId', auth.roleAuthorization(OWNER, ADMIN), storefront.deleteMenuItem);
	router.delete(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization(OWNER, ADMIN), storefront.deleteCategory);

	router.param('optionItemId', storefront.getOptionItem);
	router.param('optionCategoryId', storefront.getOptionCategory);
	router.param('menuItemId', storefront.getMenuItem);
	router.param('categoryId', storefront.getCategory);
	router.param('companyId', storefront.getCompany);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
