process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST MOLTIN INTEGRATIONS

// 1. Test SFEZ Postgres has Moltin-mapped companies
describe('GET /api/v1/mol/companies', function() {
  it('should return all companies in SFEZ db', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('array');
    res.body[0].should.have.property('name');
    res.body[0].name.should.equal('Pacos Tacos');
    res.body[0].should.have.property('order_sys_id');
    res.body[0].order_sys_id.should.equal('1293770040725734215');
    done();
    });
  });
});

/*
// UNAUTHENTICATED ROUTES
router.get(apiversion + '/companies', storefront.listCompanies)
router.get(apiversion + '/companies/:companyId', storefront.readCompany)
router.get(apiversion + '/companies/:companyId/categories', storefront.listCategories)
router.get(apiversion + '/companies/:companyId/categories/:categoryId', storefront.readCategory);
router.get(apiversion + '/menuitems', storefront.listMenuItems);
router.get(apiversion + '/menuitems/:menuItemId', storefront.readMenuItem);
router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', storefront.listOptionItems);
router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', storefront.readOptionItem)
router.get(apiversion + '/menuitems/:menuItemId/optioncategories', storefront.listOptionCategories);
router.get(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', storefront.readOptionCategory)
router.get(apiversion + '/menuitems/:menuItemId/optionitems', storefront.listOptionItems);
router.get(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', storefront.readOptionItem)

// AUTHENTICATED ROUTES
// Test Categories
router.post(apiversion + '/companies/:companyId/categories', auth.roleAuthorization("Owner"), storefront.createCategory)
router.put(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.updateCategory);
router.delete(apiversion + '/companies/:companyId/categories/:categoryId', auth.roleAuthorization("Owner"), storefront.deleteCategory);

// Test Menu Items
router.post(apiversion + '/menuitems', auth.roleAuthorization("Owner"), storefront.createMenuItem);
router.put(apiversion + '/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.updateMenuItem);
router.delete(apiversion + '/menuitems/:menuItemId', auth.roleAuthorization("Owner"), storefront.deleteMenuItem);

// Test OptionCategory's Option Items (the single-select options)
router.post(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
router.put(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
router.delete(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);

// Test Option Categories (the single-select option containers)
router.post(apiversion + '/menuitems/:menuItemId/optioncategories', auth.roleAuthorization("Owner"), storefront.createOptionCategory)
router.put(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.updateOptionCategory);
router.delete(apiversion + '/menuitems/:menuItemId/optioncategories/:optionCategoryId', auth.roleAuthorization("Owner"),  storefront.deleteOptionCategory);

// Test Option Items (the multi-select options)
router.post(apiversion + '/menuitems/:menuItemId/optionitems', auth.roleAuthorization("Owner"), storefront.createOptionItem)
router.put(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"), storefront.updateOptionItem);
router.delete(apiversion + '/menuitems/:menuItemId/optionitems/:optionItemId', auth.roleAuthorization("Owner"),  storefront.deleteOptionItem);
*/
