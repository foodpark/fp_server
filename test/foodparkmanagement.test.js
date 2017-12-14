process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../server');

var FOOD_PARK_ID = 3002;

chai.use(chaiHttp);

var testCase = 'Food park management - ';

describe(testCase + 'Food park manager auth/register', function () {
    it('should register a manager and retrieve JWT with FOODPARKMGR permissions', function (done) {
        chai.request(server)
          .post('/auth/register')
          .send({
              "first_name": "Test",
              "last_name": "FoodParkMgr",
              "email": "fpm@fpm.com",
              "password": "123",
              "company_name": "FoodParkMgr",
              "country_id": "1",
              "territory_id": "3",
              "food_park_id" : FOOD_PARK_ID,
              "role" : "FOODPARKMGR"
            }
          )
    })
});
