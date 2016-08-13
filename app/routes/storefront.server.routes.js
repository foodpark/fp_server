var storefront = require('../../app/controllers/storefront.server.controller'),
auth = require('../../app/controllers/authentication.server.controller');

module.exports=function(app) {
	app.route('/api/categories').post(auth.roleAuthorization("Owner"), storefront.createCategory).get(storefront.listCategories);
  app.route('/api/categories/:categoryId').get(storefront.readCategory);
	app.route('/api/categories/:categoryId').put(auth.roleAuthorization("Owner"), storefront.updateCategory);
	app.route('/api/categories/:categoryId').delete(auth.roleAuthorization("Owner"), storefront.deleteCategory);
	app.param('categoryId',storefront.getCategory);

  app.route('/api/menuitems').post(auth.roleAuthorization("Owner"),  storefront.createMenuItem).get(storefront.listMenuItems);
  app.route('/api/menuitems/:menuItemId').get(storefront.readMenuItem);
	app.route('/api/menuitems/:menuItemId').put(auth.roleAuthorization("Owner"),  storefront.updateMenuItem);
	app.route('/api/menuitems/:menuItemId').delete(auth.roleAuthorization("Owner"),  storefront.deleteMenuItem);
	app.param('menuItemId',storefront.getMenuItem);

	app.route('/api/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems').post(auth.roleAuthorization("Owner"),  storefront.createOptionItem).get(storefront.listOptionItems);
	app.route('/api/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId').get(storefront.readOptionItem).put(auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	app.route('/api/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId').delete(auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  app.route('/api/menuitems/:menuItemId/optioncategories').post(auth.roleAuthorization("Owner"),  storefront.createOptionCategory).get(storefront.listOptionCategories);
	app.route('/api/menuitems/:menuItemId/optioncategories/:optionCategoryId').get(storefront.readOptionCategory).put(auth.roleAuthorization("Owner"),  storefront.updateOptionCategory);
	app.route('/api/menuitems/:menuItemId/optioncategories/:optionCategoryId').delete(auth.roleAuthorization("Owner"),  storefront.deleteOptionCategory);
	app.param('optionCategoryId',storefront.getOptionCategory);

  app.route('/api/menuitems/:menuItemId/optionitems').post(auth.roleAuthorization("Owner"),  storefront.createOptionItem).get(storefront.listOptionItems);
  app.route('/api/menuitems/:menuItemId/optionitems/:optionItemId').get(storefront.readOptionItem).put(auth.roleAuthorization("Owner"), storefront.updateOptionItem);
	app.route('/api/menuitems/:menuItemId/optionitems/:optionItemId').delete(auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
  app.param('optionItemId',storefront.getOptionItem);
};
