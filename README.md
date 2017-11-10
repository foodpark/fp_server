# SFEZ Server
#
## Synopsis

The SFEZ server is a MEAN-based implementation that serves the relationship services for StreetFood EZ. Basic services include reviews, favorites, checkins, loyalty, social media.

## Code Example

REST services of the form:

GET favorites/customers/{customerId}
GET favorites/companies/{companyId}

## Motivation

Provides relationship services between customer and food truck company.

## Installation

Dependencies: 
1. Postgres installed
2. NodeJS installed
3. SFEZ_server git repo cloned locally

Start up the DB, and create the development database:
From root of /opt/SFEZ_server:

Install new schema

    :~$ cd db
    :~$ ./create_sfezdb.sh
    
Then install test data

    :~$ psql -U postgres sfezdb < sfez_create_test_data.dmp


Run the server (in development mode)

    :~$ export NODE_ENV=test
    :~$ nodemon server.js

Specific files can be turned on for debug via

    :~$ export DEBUG=auth,rest_options
    
See the debug file name in each file's requires block. For example:

    var debug   = require('debug')('auth');

Go to http://localhost:1337/auth/login to login and obtain a JWT

Go to http://localhost:1337/api/v1/rel/companies (for example) to hit a specific endpoint. 

## API Reference

See the Service Catalog for endpoint and payload documentation.

## Tests

1. Install mocha
2. Execute all tests from root of SFEZ_server: mocha
3. Execute specific test suite example: mocha test/authentication.server.test.js

## Contribution

* Setup editor: http://editorconfig.org/

## Contributors

SFEZ CODERS ONLY!!

## License
