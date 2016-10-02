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
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].slug.should.equal('independent');
      done();
    });
  });
});

// 6. Test retrieval of a specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/menuitems/1278238321226547557', function() {
  it('should return The Independent Taco for 1001: Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('slug');
      res.body.slug.should.equal('independent');
      done();
    });
  });
});

// 7. Test retrieval of option categories for specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories', function() {
  it('should return option categories for the Independent Taco for 1001: Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('OptionItems');
      done();
    });
  });
});



// AUTHENTICATED ROUTES

var token  = ''
var mochaId = ''
// 8. Test CRUD of a Category for a specific Company
describe('CRUD /api/v1/mol/companies/1001/categories', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .field("username", "mp4@gmail.com")
    .field("password", "mp4")
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.id.should.equal(11004);
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('mp4@gmail.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should create category "Mocha" for 1001: Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1001/categories')
    .set('Authorization', token)
    .field('title','Mocha')
    .field('parent','1293790256314712958')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created category id
      mochaId = res.body.id

      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha');
      done();
    });
  });
  it('should read "Mocha" category for 1001: Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha');
      done();
    });
  });
  it('should update "Mocha" to "Mocha-Mocha" category for 1001: Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1001/categories/'+ mochaId)
    .set('Authorization', token)
    .field('title','Mocha-Mocha')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha-Mocha');
      done();
    });
  });
  it('should delete "Mocha-Mocha" category for 1001: Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/categories/'+ mochaId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Category removed successfully');
      done();
    });
  });
});

token = ''
mochaId = ''

// 9. Test CRUD of a Menu Item for a specific Company/Category
describe('CRUD /api/v1/mol/companies/1001/categories/1278238821237916009/menuitems', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .field("username", "mp4@gmail.com")
    .field("password", "mp4")
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.id.should.equal(11004);
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('mp4@gmail.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should create menu item "Mocha Taco" for 1001: Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1001/categories/1278238821237916009/menuitems')
    .set('Authorization', token)
    .field('title','Mocha Taco')
    .field('price','4.95')
    .field('status','1')
    .field('category','1278238821237916009')
    .field('description','Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      mochaId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Taco');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$5.99');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Tacos');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');
      done();
    });
  });
  it('should read "Mocha Taco" menu item for 1001: Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Taco');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$5.99');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Tacos');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');
      done();
    });
  });
  it('should update "Mocha Taco" to "Mocha Avalanche Taco" item title & price for 1001: Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1001/menuitems/'+ mochaId)
    .set('Authorization', token)
    .field('title','Mocha Avalanche Taco')
    .field('price','6.95')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Avalanche Taco');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$7.99');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Tacos');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');

      done();
    });
  });
  it('should delete '+mochaId+': "Mocha Avalanche Taco" menu time for 1001: Pacos Tacos - Taco catgory in Moltin', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/menuitems/'+ mochaId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Product removed successfully');
      done();
    });
  });
});

/*
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
