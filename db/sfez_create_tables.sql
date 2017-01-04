
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

CREATE TABLE territories (
    id SERIAL PRIMARY KEY,
    city text,
    territory text,
    state text,
    country text,
    timezone text,
    latitude float8,
    longitude float8,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE food_parks (
    id SERIAL PRIMARY KEY,
    name text NOT NULL,
    photo text,
    territory_id integer REFERENCES territories(id),
    city text,
    state text,
    postal_code text,
    country text,
    latitude float8,
    longitude float8,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  name text NOT NULL,
  type text,
  main_loc_text text,
  secondary_loc_text text,
  regex_seed text,
  hitcount integer,
  territory_id integer REFERENCES territories(id),
  latitude float8,
  longitude float8,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    first_name text,
    last_name text,
    role text REFERENCES roles(type),
    provider text,
    provider_id text,
    provider_data text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    description text,
    photo text,
    phone text,
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
    order_sys_id text,
    base_slug text,
    default_cat text,
    description text,
    email text,
    phone text,
    facebook text,
    twitter text,
    photo text,
    featured_dish text,
    hours text,
    schedule text,
    business_address text,
    city text,
    state text,
    country text,
    taxband text,
    tags text,
    stub boolean,
    user_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    order_sys_id text,
    description text,
    gcm_id text,
    device_type text,
    fcm_id text,
    phone text,
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
    customer_order_window integer,
    prep_notice integer,
    description text,
    username text,
    password text,
    qr_code text,
    phone text,
    fcm_id text,
    gcm_id text,
    device_type text,
    unit_order_sys_id text,
    territory_id integer REFERENCES territories(id),
    company_id integer REFERENCES companies(id),
    unit_mgr_id integer REFERENCES users(id),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE checkins (
  id SERIAL PRIMARY KEY,
  check_in timestamp,
  check_out timestamp,
  latitude float8,
  longitude float8,
  display_address text,
  food_park_name text,
  note text,
  food_park_id integer REFERENCES food_parks(id),
  unit_id integer REFERENCES units(id),
  company_id integer REFERENCES companies(id),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE checkin_history (
  id SERIAL PRIMARY KEY,
  unit_name text,
  unit_id integer REFERENCES units(id),
  company_name text,
  company_id integer REFERENCES companies(id),
  user_id integer REFERENCES users(id),
  service_cancellation_time timestamp,
  check_in timestamp,
  check_out timestamp,
  latitude float8,
  longitude float8,
  food_park_name text,
  food_park_id integer REFERENCES food_parks(id),
  note text,
  display_address text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE favorites (
  customer_id integer REFERENCES customers(id),
  unit_id integer REFERENCES units(id),
  company_id integer REFERENCES companies(id),
  created_at timestamp without time zone DEFAULT now(),
  PRIMARY KEY (customer_id, unit_id, company_id)
);


CREATE TABLE order_history (
  id SERIAL PRIMARY KEY,
  order_sys_order_id text,
  amount money,
  initiation_time timestamp,
  payment_time timestamp,
  actual_pickup_time timestamp,
  desired_pickup_time timestamp,
  prep_notice_time timestamp,
  status json,
  messages text, -- json
  qr_code text,
  manual_pickup boolean DEFAULT false,
  order_detail json, -- json
  checkin_id integer REFERENCES checkins(id),
  customer_name text,
  customer_id integer REFERENCES customers(id),
  unit_id integer REFERENCES units(id),
  company_id integer REFERENCES companies(id),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE loyalty (
  id SERIAL PRIMARY KEY,
  amount money,
  customer_id integer REFERENCES customers(id),
  company_id integer REFERENCES companies(id),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE loyalty_rewards (
  id SERIAL PRIMARY KEY,
  company_id integer REFERENCES companies(id),
  gold_reward_item text,
  silver_reward_item text,
  bronze_reward_item text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE loyalty_used (
  id SERIAL PRIMARY KEY,
  amount integer,
  order_history_id integer REFERENCES order_history(id),
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now()
);

CREATE TABLE review_states (
  id SERIAL PRIMARY KEY,
  name text NOT NULL UNIQUE,
  allowed_transitions integer[]
);

CREATE TABLE review_approvals (
    id SERIAL PRIMARY KEY,
    review_id integer,
    reviewer_id integer REFERENCES admins(id),
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
    status text REFERENCES review_states(name),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


CREATE TABLE search_preferences (
    id SERIAL PRIMARY KEY,
    customer_id integer REFERENCES customers(id),
    territory_id integer REFERENCES territories(id),
    distance float8,
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

COPY review_states (id, name, allowed_transitions) FROM stdin;
1	New	{2,3,4}
2	Approved	{3}
3	Updated	{2,4}
4	Disapproved	{3}
\.
SELECT pg_catalog.setval('review_states_id_seq', 5, true);


GRANT ALL ON SCHEMA public TO postgres;

REVOKE ALL ON TABLE admins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE admins TO sfez_rw;

REVOKE ALL ON TABLE checkins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE checkins TO sfez_rw;

REVOKE ALL ON TABLE checkin_history FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE checkin_history TO sfez_rw;

REVOKE ALL ON TABLE companies FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE companies TO sfez_rw;

REVOKE ALL ON TABLE customers FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE customers TO sfez_rw;

REVOKE ALL ON TABLE favorites FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE favorites TO sfez_rw;

REVOKE ALL ON TABLE food_parks FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_parks TO sfez_rw;

REVOKE ALL ON TABLE locations FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE locations TO sfez_rw;

REVOKE ALL ON TABLE loyalty FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty TO sfez_rw;

REVOKE ALL ON TABLE loyalty_rewards FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty_rewards TO sfez_rw;

REVOKE ALL ON TABLE loyalty_used FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty_used TO sfez_rw;

REVOKE ALL ON TABLE order_history FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE order_history TO sfez_rw;

REVOKE ALL ON TABLE review_approvals FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE review_approvals TO sfez_rw;

REVOKE ALL ON TABLE review_states FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE review_states TO sfez_rw;

REVOKE ALL ON TABLE reviews FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE reviews TO sfez_rw;

REVOKE ALL ON TABLE roles FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE roles TO sfez_rw;

REVOKE ALL ON TABLE search_preferences FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE search_preferences TO sfez_rw;

REVOKE ALL ON TABLE territories FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE territories TO sfez_rw;

REVOKE ALL ON TABLE unit_types FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE unit_types TO sfez_rw;

REVOKE ALL ON TABLE units FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE units TO sfez_rw;

REVOKE ALL ON TABLE users FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE users TO sfez_rw;


GRANT SELECT ON TABLE information_schema.constraint_column_usage TO sfez_rw;
GRANT SELECT ON TABLE information_schema.key_column_usage TO sfez_rw;
GRANT SELECT ON TABLE information_schema.table_constraints TO sfez_rw;
GRANT SELECT ON TABLE pg_catalog.pg_constraint TO sfez_rw;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to sfez_rw;
