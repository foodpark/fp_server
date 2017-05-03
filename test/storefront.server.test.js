process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST MOLTIN INTEGRATIONS

var tests = "- Storefront Tests - ";
var defaultCat = '';

// UNAUTHENTICATED ROUTES
// Test SFEZ Postgres has Moltin-mapped companies
describe(tests +' GET /api/v1/mol/companies', function() {
  it('should return all companies in SFEZ db', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('array');
    done();
    });
  });
});

// Test SFEZ Postgres has specfic company
describe(tests +' GET /api/v1/mol/companies/1008', function() {
  it('should return company 1008: Grilla Cheez from SFEZ db', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.should.have.property('id');
    res.body.id.should.equal(1008);
    res.body.should.have.property('name');
    res.body.name.should.equal('Grilla Cheez');
    res.body.should.have.property('order_sys_id');
    res.body.order_sys_id.should.equal('1441733842225332401');
    res.body.should.have.property('default_cat');
    res.body.default_cat.should.equal('1441733850261618866');
    
    defaultCat = res.body.default_cat;

    done();
    });
  });
});

// Test retrieval of Moltin categories
describe(tests +' GET /api/v1/mol/companies/1008/categories', function() {
  it('should return menu categories for 1008: Grilla Cheez from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/categories')
    .end(function(err, res) {
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].should.have.property('company');
      res.body[0].company.value.should.equal('Grilla Cheez');
      done();
    });
  });
});



// Test retrieval of one Moltin category
describe(tests +' GET /api/v1/mol/companies/1008/categories/1441745521759748294', function() {
  it('should return Dinner category for 1008: Grilla Cheez from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/categories/1441745521759748294')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('object');
    res.body.should.have.property('title');
    res.body.title.should.equal('Dinner');
    done();
    });
  });
});


// Test retrieval of menu items for Company and Category
describe(tests +' GET /api/v1/mol/companies/1008/categories/1441745521759748294/menuitems', function() {
  it('should return menu items for 1008: Grilla Cheez - Dinner category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/categories/1441745521759748294/menuitems')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('slug');
      res.body[0].slug.should.equal('grilla-cheez-1486088088823-bbq-wings');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('BBQ Loaf');
      done();
    });
  });
});

// Test retrieval of a specific menu item for Company and Category
describe(tests +' GET /api/v1/mol/companies/1008/menuitems/1441751723700912337', function() {
  it('should return BBQ Loaf for 1008: Grilla Cheez - Dinner category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('slug');
      res.body.slug.should.equal('grilla-cheez-1486088088823-bbq-wings');
      res.body.should.have.property('title');
      res.body.title.should.equal('BBQ Loaf');
      done();
    });
  });
});

// Test retrieval of option categories for specific menu item for Company and Category
describe(tests +' GET /api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories', function() {
  it('should return option categories for BBQ Loaf for Grilla Cheez - Dinner category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      done();
    });
  });
});

// Test retrieval of a specific option category for specific menu item for Company and Category
describe(tests +' GET /api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515', function() {
  it('should return "OptionItems" option category for BBQ Loaf for Grilla Cheez - Dinner category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('OptionItems');
      res.body.should.have.property('type');
      res.body.type.value.should.equal('Single');
      done();
    });
  });
});

// Test retrieval of option items for an option category for specific menu item for Company and Category
describe(tests +' GET /api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515/optionitems', function() {
  it('should return option items for the "Option Items" option category for BBQ Loaf for Grilla Cheez - Dinner category from Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515/optionitems')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body[0].should.have.property('title');
      res.body[0].title.should.equal('French Fries');
      res.body[0].should.have.property('mod_price');
      res.body[0].mod_price.should.equal('+5.00');

      res.body[1].should.have.property('title');
      res.body[1].title.should.equal('Cole Slaw');
      res.body[1].should.have.property('mod_price');
      res.body[1].mod_price.should.equal('+2');

      done();
    });
  });
});

// AUTHENTICATED ROUTES

var token  = ''
var mochaId = ''
// Test CRUD of a Category for a specific Company
describe(tests +' CRUD /api/v1/mol/companies/1008/categories', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .field("username", "grilla@grillacheez.com")
    .field("password", "grilla")
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.id.should.equal(11025);
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('Grilla@grillacheez.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should create category "Mocha" for 1008: Grilla Cheez in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1008/categories')
    .set('Authorization', token)
    .field('title','Mocha')
    .field('parent', defaultCat)
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
  it('should read "Mocha" category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/categories/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha');
      done();
    });
  });
  it('should update "Mocha" to "Mocha-Mocha" category in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1008/categories/'+ mochaId)
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
  it('should delete "Mocha-Mocha" category in Moltin', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1008/categories/'+ mochaId)
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

// Test CRUD of a Daily Special Menu Item for a specific Company
describe(tests +' CRUD /api/v1/mol/companies/1008/categories/1463313172281688785/menuitems', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .field("username", "grilla@grillacheez.com")
    .field("password", "grilla")
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.id.should.equal(11025);
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('Grilla@grillacheez.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should create menu item "Mocha Sandwich" for the Daily Specials category in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1008/categories/1463313172281688785/menuitems')
    .set('Authorization', token)
    .field('title','Mocha Sandwich')
    .field('price','4.95')
    .field('status','1')
    .field('category','1463313172281688785')
    .field('description','Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      mochaId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Sandwich');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$4.95');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Daily Specials');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');
      done();
    });
  });
  it('should read "Mocha Sandwich" menu item in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/'+ mochaId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Sandwich');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$4.95');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Daily Specials');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');
      done();
    });
  });
  it('should update "Mocha Sandwich" to "Mocha Avalanche Sandwich" item title & price in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1008/menuitems/'+ mochaId)
    .set('Authorization', token)
    .field('title','Mocha Avalanche Sandwich')
    .field('price','6.95')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Mocha Avalanche Sandwich');

      res.body.should.have.property('price');
      res.body.price.value.should.equal('R$6.95');

      res.body.should.have.property('status');
      res.body.status.value.should.equal('Live');

      res.body.should.have.property('category');
      res.body.category.value.should.equal('Daily Specials');

      res.body.should.have.property('description');
      res.body.description.should.equal('Spicy chocolate mousse and bitter chocolate shavings fill a flash-fried tortilla');

      done();
    });
  });
  it('should delete '+mochaId+': "Mocha Avalanche Sandwich" menu item in Moltin', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1008/menuitems/'+ mochaId)
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
var ocId = ''

// Test CRU of an Option Category for a specific Company/Menu Item
describe(tests +' CRU /api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .field("username", "grilla@grillacheez.com")
    .field("password", "grilla")
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.id.should.equal(11025);
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('Grilla@grillacheez.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should create option category "Pickles" in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories')
    .set('Authorization', token)
    .field('title','Pickles')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      ocId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Pickles');

      res.body.should.have.property('type');
      res.body.type.value.should.equal('Variant');
      done();
    });
  });
  it('should read "Pickles" option category in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId)
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
  it('should update "Pickles" option category to "PicklePickle" title in Moltin', function(done) {
    chai.request(server)
    .put('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId)
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
});


var oiId = '';

// Test CRU of an Option Item for an Option Category for a specific Company/Menu Item
describe(tests +' CRU /api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/<optcatId>/optionitems', function() {
  it('should create option item "Spelt" for option category '+ ocId +' of the BBQ Loaf for Grilla Cheez in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId +'/optionitems')
    .set('Authorization', token)
    .field('title','Spelt')
    .field('mod_price','+0.00')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      oiId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Spelt');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should read "Spelt" option item for the '+ ocId +' option category of the  BBQ Loaf for Grilla Cheez in Moltin', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId +'/optionitems/'+ oiId)
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
    .put('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId +'/optionitems/'+ oiId)
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
});


var multiOiId = '';

// Test CRU of multi-select Option Items for a specific Company/Menu Item
describe(tests +' CRU /api/v1/mol/companies/1008/menuitems/<optCatId>/optionitems', function() {
  it('should create option item "Iced" for the BBQ Loaf menu item in the Dinner category in Moltin', function(done) {
    chai.request(server)
    .post('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optionitems')
    .set('Authorization', token)
    .field('title','Iced')
    .field('mod_price','+0.00')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created id
      multOiId = res.body.id
      res.body.should.have.property('title');
      res.body.title.should.equal('Iced');

      res.body.should.have.property('mod_price');
      res.body.mod_price.should.equal('+0.00');
      done();
    });
  });
  it('should read "Iced" option item for the BBQ Loaf menu item', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515/optionitems/'+ multOiId)
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
    .put('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/1506186173423288515/optionitems/'+ multOiId)
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
});




// Test Delete of option category, option item, and multi-select Option Items for a specific Company/Menu Item
describe(tests +' Delete /api/v1/mol/companies/1008/menuitems/<menutItemId>/optioncategories/<optCatId>/optionitems', function() {
  it('should delete '+oiId+': "Amaranth" option item ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId +'/optionitems/'+ oiId)
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
  it('should delete the "Blended" option item ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId +'/optionitems/'+ multOiId)
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
  it('should delete  the '+ ocId +' option category ', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/1008/menuitems/1441751723700912337/optioncategories/'+ ocId )
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