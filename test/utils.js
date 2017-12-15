var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var knex = require('../config/knex');

chai.use(chaiHttp);

var testAdmin = {
  username : 'admin',
  password : 'admin'
};

exports.cleanData = function (table, query, callback) {
  knex(table).where(query).del().then(function () {
      callback();
  });
};

exports.adminCredentials = testAdmin;
