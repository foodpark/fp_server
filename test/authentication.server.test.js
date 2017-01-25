process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST COMPANY CREATION FUNCTIONS

// UNAUTHENTICATED ROUTES
// Test create of company
var userId = '';
var companyId = '';
var deliveryChargeCat = '';
var deliveryChargeItem = '';

describe('POST /auth/register', function() {
  it('should register company and return JWT token', function(done) {
    chai.request(server)
    .post('/auth/register')
    .send( {
        "first_name": "Arthur",
        "last_name": "Test",
        "company_name": "Auth Test Co 7",
        "email": "auth.test7@gmail.com",
        "password": "auth.test7",
        "role": "OWNER"
    })
    .end(function (err, res) {
      res.should.have.status(201);
      res.should.be.json;
      res.body.should.be.a('object')
      res.body.should.have.property('token');
      res.body.should.have.property('user');
      res.body.user.should.have.property('id');

      userId = res.body.user.id;

      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('auth.test7@gmail.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.user.should.have.property('company_id');

      companyId = res.body.user.company_id;

      done();
    });
  });
  it('should read Auth Testing company', function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/' + companyId)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('name');
      res.body.name.should.equal('Auth Test Co 7');
      res.body.should.have.property('delivery_chg_cat_id');
      res.body.should.have.property('delivery_chg_item_id');

      deliveryChargeCat = res.body.delivery_chg_cat_id;
      deliveryChargeItem = res.body.delivery_chg_item_id;
      console.log("delivery charge cat "+ deliveryChargeCat)
      console.log("delivery charge item "+ deliveryChargeItem)
      done();
    });
  });
  it('should read "Delivery Charge Category" (+ '+ deliveryChargeCat +') for company '+ companyId, function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/' + companyId +'/categories/'+ deliveryChargeCat)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Delivery Charge Category');
      done();
    });
  });
  it('should read "Delivery Charge Item" (+ '+ deliveryChargeItem +') for company '+ companyId, function(done) {
    chai.request(server)
    .get('/api/v1/mol/companies/' + companyId +'/menuitems/'+ deliveryChargeItem)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('title');
      res.body.title.should.equal('Delivery Charge');
      done();
    });
  });
});

token = '';

// Clean up
describe('Clean up SFEZ/Moltin company, SFEZ user, Moltin category and product for delivery charge', function() {
  it('should login and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .send({
        "username": "auth.test7@gmail.com",
        "password": "auth.test7"
    })
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      token = res.body.token;

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal('auth.test7@gmail.com');
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('OWNER');
      res.body.should.have.property('token');
      done();
    });
  });
  it('should delete "Delivery Charge" item from company', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/' + companyId +'/menuitems/'+ deliveryChargeItem)
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
  it('should delete "Delivery Charge Category" category from company', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/' + companyId +'/categories/'+ deliveryChargeCat)
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
  it('should delete Auth Testing company', function(done) {
    chai.request(server)
    .delete('/api/v1/mol/companies/' + companyId)
    .set('Authorization', token)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status')
      res.body.status.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Company removed successfully');
      done();
    });
  });
  it('should delete SFEZ user', function(done) {
    chai.request(server)
    .delete('/api/v1/rel/users/' + userId)
    .set('Authorization', token)
    .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('success');
        res.body.success.should.equal(true);
        done();
    });
  });
});
  

