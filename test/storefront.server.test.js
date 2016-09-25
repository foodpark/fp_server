process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST MOLTIN INTEGRATIONS

// UNAUTHENTICATED ROUTES
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

// 2. Test SFEZ Postgres has specfic company
describe('GET /api/v1/mol/companies/1001', function() {
  it('should return company 1001: Pacos Tacos from SFEZ db', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.should.have.property('id');
    res.body.id.should.equal(1001);
    res.body.should.have.property('name');
    res.body.name.should.equal('Pacos Tacos');
    res.body.should.have.property('order_sys_id');
    res.body.order_sys_id.should.equal('1293770040725734215');
    done();
    });
  });
});

// 3. Test retrieval of Moltin categories
describe('GET /api/v1/mol/companies/1001/categories', function() {
  it('should return menu categories for 1001: Pacos Tacos from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories')
    .end(function(err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].slug.should.equal('pacostacos');
      done();
    });
  });
});

// 4. Test retrieval of one Moltin category
describe('GET /api/v1/mol/companies/1001/categories/1278239102541496682', function() {
  it('should return Breakfast category for 1001: Pacos Tacos from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories/1278239102541496682')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.should.have.property('title');
    res.body.title.should.equal('Breakfast');
    done();
    });
  });
});


// 5. Test retrieval of menu items for Company and Category
describe('GET /api/v1/mol/companies/1001/categories/1278238821237916009/menuitems', function() {
  it('should return menu items for 1001: Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories/1278238821237916009/menuitems')
    .end(function(err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].slug.should.equal('independent');
      done();
    });
  });
});

// 6. Test retrieval of a specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/categories/1278238821237916009/menuitems/1278238321226547557', function() {
  it('should return The Independent Taco for 1001: Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories/1278238821237916009/menuitems/1278238321226547557')
    .end(function(err, res) {
      res.body.should.be.a('object');
      res.body.should.have.property('slug');
      res.body.slug.should.equal('independent');
      done();
    });
  });
});

// 7. Test retrieval of option categories for specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/categories/1278238821237916009/menuitems/1278238321226547557/optioncategories', function() {
  it('should return option categories for the Independent Taco for 1001: Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories/1278238821237916009/menuitems/1278238321226547557/optioncategories')
    .end(function(err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('OptionItems');
      done();
    });
  });
});


/*
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
