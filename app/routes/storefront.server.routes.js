var storefront = require('../../app/controllers/storefront.server.controller'),
		auth = require('../../app/controllers/authentication.server.controller')
		var Router = require('koa-router');;

module.exports=function(app) {
	var router = new Router();
	router.post('/api/v1/categories', auth.roleAuthorization("Owner"), storefront.createCategory)
	router.get('/api/v1/categories', storefront.listCategories)
  router.get('/api/v1/categories/:categoryId', storefront.readCategory);
	router.put('/api/v1/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.updateCategory);
	router.delete('/api/v1/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.deleteCategory);
	router.param('categoryId', storefront.getCategory);

  router.post('/api/v1/menuitems', auth.roleAuthorization("Owner"), storefront.createMenuItem)
	router.get('/api/v1/menuitems', storefront.listMenuItems);
  router.get('/api/v1/menuitems/:menuItemId', storefront.readMenuItem);
	router.put('/api/v1/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.updateMenuItem);
	router.delete('/api/v1/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.deleteMenuItem);
	router.param('menuItemId', storefront.getMenuItem);

	router.post('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
	router.get('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems);
	router.get('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
	router.put('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	router.delete('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  router.post('/api/v1/menuitems/:menuItemId/optioncategories', auth.roleAuthorization("Owner"), storefront.createOptionCategory)
	router.get('/api/v1/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories);
	router.get('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
	router.put('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.updateOptionCategory);
	router.delete('/api/v1/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.deleteOptionCategory);
	router.param('optionCategoryId', storefront.getOptionCategory);

  router.post('/api/v1/menuitems/:menuItemId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
	router.get('/api/v1/menuitems/:menuItemId/optionitems', storefront.listOptionItems);
  router.get('/api/v1/menuitems/:menuItemId/optionitems/:optionItemId', storefront.readOptionItem)
	router.put('/api/v1/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	router.delete('/api/v1/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  router.param('optionItemId', storefront.getOptionItem);

  app.use(router.routes());
  app.use(router.allowedMethods());
};
