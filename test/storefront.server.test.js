process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST MOLTIN INTEGRATIONS

// UNAUTHENTICATED ROUTES
// Test SFEZ Postgres has Moltin-mapped companies
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

// Test SFEZ Postgres has specfic company
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

// Test retrieval of Moltin categories
describe('GET /api/v1/mol/companies/1001/categories', function() {
  it('should return menu categories for 1001: Pacos Tacos from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/categories')
    .end(function(err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('company');
      res.body[0].company.value.should.equal('Paco\'s Tacos');
      done();
    });
  });
});



// Test retrieval of one Moltin category
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


// Test retrieval of menu items for Company and Category
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

// Test retrieval of a specific menu item for Company and Category
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

// Test retrieval of option categories for specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories', function() {
  it('should return option categories for the Independent Taco for Pacos Tacos - Tacos category from Moltin', function(done) {
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

// Test retrieval of a specific option category for specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1278241913421431153', function() {
  it('should return "Extras" option category for the Independent Taco for Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1278241913421431153')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Extras');
      res.body.should.have.property('type');
      res.body.type.value.should.equal('Variant');
      done();
    });
  });
});

// Test retrieval of option items for an option category for specific menu item for Company and Category
describe('GET /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems', function() {
  it('should return option items for the "Shell" option category for the Independent Taco for Pacos Tacos - Tacos category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('Corn');
      res.body[0].should.have.property('id');
      res.body[0].id.should.equal('1335588251125153848');
      res.body[0].should.have.property('product');
      res.body[0].product.should.equal('0');
      res.body[0].should.have.property('modifier');
      res.body[0].modifier.should.equal('1335588095105433655');
      res.body[0].should.have.property('mod_price');
      res.body[0].mod_price.should.equal('+0.00');

      res.body[1].should.have.property('title');
      res.body[1].title.should.equal('Flour');
      res.body[1].should.have.property('id');
      res.body[1].id.should.equal('1335588379110146107');
      res.body[1].should.have.property('product');
      res.body[1].product.should.equal('0');
      res.body[1].should.have.property('modifier');
      res.body[1].modifier.should.equal('1335588095105433655');
      res.body[1].should.have.property('mod_price');
      res.body[1].mod_price.should.equal('+0.00');

      done();
    });
  });
});

// AUTHENTICATED ROUTES

var token  = ''
var mochaId = ''
// Test CRUD of a Category for a specific Company
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

// Test CRUD of a Menu Item for a specific Company/Category
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

token = ''
mochaId = ''

// Test CRUD of an Option Category for a specific Company/Menu Item
describe('CRUD /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories', function() {
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
  it('should create option category "Pickles" for the Independent Taco for Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories')
    .set('Authorization', token)
    .field('title','Pickles')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      mochaId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Pickles');

      res.body.should.have.property('type');
      res.body.type.value.should.equal('Variant');
      done();
    });
  });
  it('should read "Pickles" option category for the Independent Taco for Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Pickles');

      res.body.should.have.property('type');
      res.body.type.value.should.equal('Variant');
      done();
    });
  });
  it('should update "Pickles" option category to "PicklePickle" title the Independent Tacok for Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/'+ mochaId)
    .set('Authorization', token)
    .field('title','PicklePickle')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('PicklePickle');

      res.body.should.have.property('type');
      res.body.type.value.should.equal('Variant');
      done();
    });
  });
  it('should delete '+mochaId+': "PicklePickle" option category for the Independent Taco menu time for Pacos Tacos - Taco catgory in Moltin', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/'+ mochaId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Modifier removed successfully');
      done();
    });
  });
});


token = ''
mochaId = ''

// Test CRUD of an Option Item for an Option Category for a specific Company/Menu Item
describe('CRUD /api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems', function() {
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
  it('should create option item "Spelt" for the "Shell" category of the Independent Taco for Pacos Tacos in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems')
    .set('Authorization', token)
    .field('title','Spelt')
    .field('mod_price','+0.00')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      mochaId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Spelt');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should read "Spelt" option item for the "Shell" option category of the Independent Taco for Pacos Tacos - Taco category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Spelt');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should update "Spelt" option item title to "Amaranth" ', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems/'+ mochaId)
    .set('Authorization', token)
    .field('title','Amaranth')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Amaranth');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should delete '+mochaId+': "Amaranth" option item ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/menuitems/1278238321226547557/optioncategories/1335588095105433655/optionitems/'+ mochaId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Variation removed successfully');
      done();
    });
  });
});



token = ''
mochaId = ''
var optItemsCat = ''

// Test CRUD of multi-select Option Items for a specific Company/Menu Item
describe('CRUD /api/v1/mol/companies/1001/menuitems/1362631894797124274/optionitems', function() {
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
  it('should create option item "Iced" for the Coffee menu item for Pacos Tacos - Drinks category in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optionitems')
    .set('Authorization', token)
    .field('title','Iced')
    .field('mod_price','+0.00')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      mochaId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Iced');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should read the "OptionItems" option category for the Coffee menu item for Pacos Tacos - Drinks category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optioncategories')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('id');
      optItemsCat = res.body[0].id;

      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('OptionItems');

      res.body[0].should.have.property('type');
      res.body[0].type.should.equal('single');
      done();
    });
  });
  it('should read "Iced" option item for the "OptionItems" option category for the Coffee menu item', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optioncategories/'+ optItemsCat +'/optionitems/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Iced');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should update "Iced" option item title to "Blended" ', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optioncategories/'+ optItemsCat +'/optionitems/'+ mochaId)
    .set('Authorization', token)
    .field('title','Blended')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Blended');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should delete the "Blended" option item ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optioncategories/'+ optItemsCat +'/optionitems/'+ mochaId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Variation removed successfully');
      done();
    });
  });
  it('should delete "OptionItems" option category ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1001/menuitems/1362631894797124274/optioncategories/'+ optItemsCat )
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Modifier removed successfully');
      done();
    });
  });
});
