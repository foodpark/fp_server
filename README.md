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

Dependencies: docker & docker-compose (see https://github.com/thehumaneffort/docker-infrastructure for instructions & help)

Start up the DB, and create the development database:
```
docker-compose up -d postgres
docker-compose run pgadmin createdb sfez-development
```

Migrate the DB:
```
docker-compose run app npm run migrate:latest
```

Run the server (in development mode)
```
docker-compose up -d app
docker-compose logs app
```

Now execute: `dinghy ip` (if you're using dinghy), or `echo
$DOCKER_HOST`, and add that IP to your /etc/hosts file or use it in
your browser:

And go to http://app.sfezserver.docker/api/v1/units (for Dinghy,
without dinghy you may need to reconfigure things a bit).

## API Reference

GET/POST/PUT/DELETE:
checkins
companies
customers
favorites
loyalty
orders
units

## Tests

No tests built in. Consider Kakapo.js

## Contributors

SFEZ CODERS ONLY!!

## License
