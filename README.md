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

## Requirements

- node: >= 7.0.0
- docker: >= 1.13.0
- docker-compose: >= 1.10

## Installation

**Note: See docker section first**

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

### GET /foodparks/:foodParkId/checkins

List all units that have made checkin in a specific Food Park.

### GET /foodparks/:foodParkId/units

List all units managed by the Food Park specified.

### POST /foodparks/:foodParkId/units

Add a unit to a Food Park.

JSON Body message

```javascript
{
  "unit_id": 1
}
```

### GET /foodparks/:foodParkId/units/active_orders

List all units with their actives orders.

JSON Response Body
```javascript
[
  {
    "id": 2000
    "name": "Classy Cuban Truck",
    "type": "TRUCK",
    "company_id": 110022,
    "orders": [
      {
        "id", 123,
        "amount": "R$35.00",
        .
        .
        .
      }
    ]
  }
]
```

### GET /foodparks/:foodParkId/orders/:orderId/drivers/:driverId

Get all orders that belongs to a driver

JSON Response Body

Array of objects

### PUT /foodparks/:foodParkId/orders/:orderId

Add an order to a driver

JSON Body Message

```javascript
{"driver_id": 2000}
```
### DELETE /foodparks/:foodParkId/units/:unitId

Remove a specified unit from Food Park.

## Tests

1. Install mocha
2. Execute all tests from root of SFEZ_server: mocha
3. Execute specific test suite example: mocha test/authentication.server.test.js

## Contribution

* Setup editor: http://editorconfig.org/

## Docker

If you want to use docker to up and running the service, follow the steps below.

First you need to install docker and docker-compose in your machine, follow the resources
to install:

[Docker](https://docs.docker.com/engine/installation)

[Docker Compose](https://docs.docker.com/engine/installation)

With all the components installed follow the steps below:

```bash
$ cd docker/base-images
$ docker-compose build
```

This will install all the docker base images necessary to run the project, when finish
the download process, check the images:

```bash
$ docker images | grep sfez*
sfez/postgres-client   9.5-stretch-slim
sfez/node              8.9.1-slim
sfez/postgres-server   9.5.6
```
Now is possible to create the services that we need to run the project, the first one
and the main service is the database infrastructure. Follow the steps below:

```bash
$ cd docker/database
$ docker-compose up -d
```

To check if the services are running, type:

```bash
$ docker ps -a | grep sfez*
* * * * * * sfez-pgclient
* * * * * * sfez-pgserver
```

Now is time to load data into database, type:

```bash
$ ./run
```

this will load all fake data into database:

To test the database, type:

```bash
$ docker-compose exec sfez-pgclient pgcli -d sfezdb
```

and querying some data.

After that we need to install our restapi and make some requests.

```bash
$ cd docker/webservice
$ docke-compose up -d && docker-compose logs -f
```

To check if the rest api is running, type:

```bash
$ docker ps -a | grep
* * * * * * sfez-webservice
```

with that you are able to change source code and make requests to the service.

To stop the services change to the path where the docker-compose.yml file resides
and type:

```bash
$ docker-compose down
```

## Contributors

SFEZ CODERS ONLY!!

## License
