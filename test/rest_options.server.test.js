process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

chai.use(chaiHttp);


// TEST ORDER MANAGEMENT

var tests = "- Rest Options/RestEasy Tests - ";



/*
pickup:
{ 
  "order_sys_order_id": "1364458146390605831",
  "desired_pickup_time":  "11/6/2016, 8:11:56 PM"
}

delivery:
{ 
  "order_sys_order_id": "1364458146390605831",
  "desired_pickup_time":  "11/6/2016, 8:11:56 PM",
  "delivery_address_id" : "1",
  "for_delivery": "true"
}
*/
var coId = '1005';
var unitId = '2006';
var customer = 'mp10';
var custId = '9001';
var orderSysOrderId = '1505190689619574804';

var puOrderId = '';
var dOrderId = '';

var custToken = '';
var unitToken = '';

describe(tests +' Create a new order', function() {
  it('should login Customer and retrieve JWT token', function(done) {
    chai.request(server)
    .post('/auth/login')
    .send({
        "username": customer, // no email for Customer mp10
        "password": customer
    })
    .end(function (err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object')
      // Save the JWT token
      res.body.should.have.property('token');
      custToken = res.body.token;

      res.body.should.have.property('user');
      res.body.user.should.have.property('id');
      res.body.user.should.have.property('username');
      res.body.user.username.should.equal(customer);
      res.body.user.should.have.property('role');
      res.body.user.role.should.equal('CUSTOMER');
      done();
    });
  });
  it('should create a new pickup order', function(done) {
    chai.request(server)
    .post('/api/v1/rel/companies/'+ coId +'/units/'+ unitId+'/order_history')
    .set('Authorization', custToken)
    .field('order_sys_order_id', orderSysOrderId)
    .field('desired_pickup_time', '6/6/2017, 8:11:56 PM')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      // Save the newly created category id
      puOrderId = res.body.id

      res.body.should.have.property('order_sys_order_id');
      res.body.order_sys_order_id.should.equal(orderSysOrderId);
      res.body.should.have.property('company_id');
      res.body.company_id.should.equal(coId);
      res.body.should.have.property('company_id');
      res.body.company_id.should.equal(coId);
      res.body.should.have.property('unit_id');
      res.body.unit_id.should.equal(unitId);
      res.body.should.have.property('customer_id');
      res.body.customer_id.should.equal(custId);
      done();
    });
  });
});

describe(tests +' Delete the pickup order', function() {
  it('should delete the pickup order', function(done) {
    chai.request(server)
    .delete('/api/v1/rel/companies/'+ coId +'/units/'+ unitId +'/orderhistory/'+ puOrderId)
    .set('Authorization', custToken)
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.status.should.equal(true);
      done();
    });
  });
});
