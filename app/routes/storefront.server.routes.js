var storefront = require('../../app/controllers/storefront.server.controller'),
auth = require('../../app/controllers/authentication.server.controller');

module.exports=function(app) {
	app.route('/api/categories').post(auth.roleAuthorization("Owner"), storefront.createCategory).get(storefront.listCategories);
  app.route('/api/categories/:categoryId').get(storefront.readCategory).put(auth.roleAuthorization("Owner"), storefront.updateCategory);
	app.param('categoryId',storefront.getCategory);

  app.route('/api/menuitems').post(auth.roleAuthorization("Owner"),  storefront.createMenuItem).get(storefront.listMenuItems);
  app.route('/api/menuitems/:menuItemId').get(storefront.readMenuItem).put(auth.roleAuthorization("Owner"),  storefront.updateMenuItem);
	app.param('menuItemId',storefront.getMenuItem);

  app.route('/api/optionitems').post(auth.roleAuthorization("Owner"),  storefront.createOptionItem).get(storefront.listOptionItems);
  app.route('/api/optionitems/:optionItemId').get(storefront.readOptionItem).put(auth.roleAuthorization("Owner"), storefront.updateOptionItem);
  app.param('optionItemId',storefront.getOptionItem);

  app.route('/api/optioncategories').post(auth.roleAuthorization("Owner"),  storefront.createOptionCategory).get(storefront.listOptionCategories);
  app.route('/api/optioncategories/:optionCategoryId').get(storefront.readOptionCategory).put(auth.roleAuthorization("Owner"),  storefront.updateOptionCategory);
  app.param('optionCategoryId',storefront.getOptionCategory);

};
