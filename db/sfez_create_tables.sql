
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';

SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;



CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    type text NOT NULL UNIQUE
);
CREATE TABLE unit_types (
    id SERIAL PRIMARY KEY,
    type text NOT NULL UNIQUE
);

CREATE TABLE food_parks (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    photo text,
    city text,
    state text,
    postal_code text,
    country text,
    latitude float8,
    longitude float8,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    role text REFERENCES roles(type),
    provider text,
    provider_id text,
    provider_data text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    description text,
    photo text,
    super_admin boolean DEFAULT false,
    city text,
    state text,
    country text,
    user_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    order_sys_id text NOT NULL,
    base_slug text NOT NULL,
    default_cat text NOT NULL,
    description text,
    email text,
    facebook text,
    twitter text,
    photo text,
    featured_dish text,
    hours text,
    schedule text,
    city text,
    state text,
    country text,
    taxband text,
    tags json,
    user_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    order_sys_id text,
    description text,
    facebook text,
    twitter text,
    photo text,
    power_reviewer boolean DEFAULT false,
    city text,
    state text,
    country text,
    user_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    number integer NOT NULL,
    type text REFERENCES unit_types(type),
    description text,
    username text,
    password text,
    qrcode text,
    unit_order_sys_id integer,
    company_id integer REFERENCES companies(id),
    unit_mgr_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE checkins (
  id SERIAL PRIMARY KEY,
  unit_id integer REFERENCES units(id),
  location point NOT NULL,
  food_park_id integer REFERENCES food_parks(id),
  checkin TIMESTAMP without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE review_approvals (
    id SERIAL PRIMARY KEY,
    review_id integer,
    admin_id integer REFERENCES admins(id),
    status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    comment text,
    rating numeric,
    answers json,
    customer_id integer REFERENCES customers(id),
    company_id integer REFERENCES companies(id),
    unit_id integer REFERENCES units(id),
    status text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);



COPY roles (id, type) FROM stdin;
1	CUSTOMER
2	OWNER
3	UNITMGR
4	ADMIN
\.
SELECT pg_catalog.setval('roles_id_seq', 5, true);

COPY unit_types (id, type) FROM stdin;
1	TRUCK
2	CART
3	RESTAURANT
\.
SELECT pg_catalog.setval('unit_types_id_seq', 4, true);


GRANT ALL ON SCHEMA public TO postgres;

REVOKE ALL ON TABLE admins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE admins TO sfez_rw;

REVOKE ALL ON TABLE checkins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE checkins TO sfez_rw;

REVOKE ALL ON TABLE companies FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE companies TO sfez_rw;

REVOKE ALL ON TABLE customers FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE customers TO sfez_rw;

REVOKE ALL ON TABLE food_parks FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_parks TO sfez_rw;

REVOKE ALL ON TABLE review_approvals FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE review_approvals TO sfez_rw;

REVOKE ALL ON TABLE reviews FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE reviews TO sfez_rw;

REVOKE ALL ON TABLE roles FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE roles TO sfez_rw;

REVOKE ALL ON TABLE units FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE units TO sfez_rw;

REVOKE ALL ON TABLE users FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE users TO sfez_rw;