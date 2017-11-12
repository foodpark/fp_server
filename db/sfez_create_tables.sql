SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

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

CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name text,
  is_enabled boolean DEFAULT(false),
  tax_band text,
  currency_id text DEFAULT('1554615357396746864'),
  currency text DEFAULT('BRL')
);

CREATE TABLE territories (
    id SERIAL PRIMARY KEY,
    city text,
    territory text,
    state text,
    country text,
    country_id integer REFERENCES countries(id),
    timezone text,
    latitude float8,
    longitude float8,
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc'),
    is_deleted boolean DEFAULT(false)
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
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username text NOT NULL UNIQUE,
    password text NOT NULL,
    first_name text,
    last_name text,
    role text REFERENCES roles(type),
    territory_id integer,
    country_id integer,
    phone text,
    provider text,
    provider_id text,
    provider_data text,
    fbid text,
    fb_token text,
    fb_login boolean,
    default_language text DEFAULT 'en',
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc'),
    is_deleted boolean DEFAULT(false)
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
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc'),
    is_deleted boolean DEFAULT(false),
    foodpark_mgr_id integer REFERENCES users(id)
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
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);


CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    order_sys_id text,
    base_slug text,
    default_cat text,
    daily_special_cat_id text,
    daily_special_item_id text,
    delivery_chg_cat_id text,
    delivery_chg_item_id text,
    delivery_chg_amount text,
    description text,
    email text,
    phone text,
    facebook text,
    twitter text,
    instagram text,
    photo text,
    featured_dish text,
    hours text,
    schedule text,
    business_address text,
    city text,
    state text,
    country text,
    country_id integer REFERENCES countries(id),
    taxband text,
    tags text,
    stub boolean,
    calculated_rating numeric,
    user_id integer REFERENCES users(id),
    show_vendor_setup boolean DEFAULT true,
    default_unit integer, --// circular reference if REFERENCES is used.  Temporary fix until customer update can be modified properly
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc'),
    is_deleted boolean DEFAULT(false)
);

CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    order_sys_id text,
    description text,
    apns_id text,
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
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE delivery_addresses (
    id SERIAL PRIMARY KEY,
    nickname text,
    address1 text,
    address2 text,
    city text,
    state text,
    phone text,
    customer_id integer REFERENCES customers(id),
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);


CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    number integer,
    type text REFERENCES unit_types(type),
    customer_order_window integer,
    prep_notice integer,
    delivery boolean DEFAULT false,
    delivery_time_offset integer,
    delivery_chg_amount text,
    delivery_radius integer,
    description text,
    username text,
    password text,
    qr_code text,
    phone text,
    apns_id text,
    fcm_id text,
    gcm_id text,
    device_type text,
    unit_order_sys_id text,
    territory_id integer REFERENCES territories(id),
    company_id integer REFERENCES companies(id),
    unit_mgr_id integer REFERENCES users(id),
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc'),
    currency_id text DEFAULT('1554615357396746864'),
    currency text DEFAULT ('BRL'),
    payment text DEFAULT ('SumUp'),
    is_deleted boolean DEFAULT(false)
);

CREATE TABLE drivers (
    id SERIAL PRIMARY KEY,
    name text,
    phone text,
    available boolean DEFAULT false,
    unit_id integer REFERENCES units(id),
    company_id integer REFERENCES companies(id),
    created_at timestamptz DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz DEFAULT (now() at time zone 'utc'),
    user_id integer REFERENCES users(id),
    is_deleted boolean DEFAULT(false)
);

CREATE TABLE checkins (
  id SERIAL PRIMARY KEY,
  check_in timestamptz,
  check_out timestamptz,
  latitude float8,
  longitude float8,
  display_address text,
  food_park_name text,
  note text,
  food_park_id integer REFERENCES food_parks(id),
  unit_id integer REFERENCES units(id),
  company_id integer REFERENCES companies(id),
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE checkin_history (
  id SERIAL PRIMARY KEY,
  unit_name text,
  unit_id integer REFERENCES units(id),
  company_name text,
  company_id integer REFERENCES companies(id),
  user_id integer REFERENCES users(id),
  service_cancellation_time timestamptz,
  check_in timestamptz,
  check_out timestamptz,
  latitude float8,
  longitude float8,
  food_park_name text,
  food_park_id integer REFERENCES food_parks(id),
  note text,
  display_address text,
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);


CREATE TABLE favorites (
  customer_id integer REFERENCES customers(id),
  unit_id integer REFERENCES units(id),
  company_id integer REFERENCES companies(id),
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  PRIMARY KEY (customer_id, unit_id, company_id)
);

CREATE TABLE order_history (
  id SERIAL PRIMARY KEY,
  order_sys_order_id text,
  amount text,
  initiation_time timestamptz,
  payment_time timestamptz,
  actual_pickup_time timestamptz,
  desired_pickup_time timestamptz,
  prep_notice_time timestamptz,
  status jsonb,
  messages text, -- json
  qr_code text,
  manual_pickup boolean DEFAULT false,
  for_delivery boolean DEFAULT false,
  desired_delivery_time timestamptz,
  delivery_address_id integer REFERENCES delivery_addresses(id),
  delivery_address_details jsonb,
  driver_id integer REFERENCES drivers(id),
  contact text,
  order_detail jsonb,
  checkin_id integer REFERENCES checkins(id),
  customer_name text,
  customer_id integer REFERENCES customers(id),
  unit_id integer REFERENCES units(id),
  company_name text,
  company_id integer REFERENCES companies(id),
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE loyalty (
  id SERIAL PRIMARY KEY,
  balance integer,
  customer_id integer REFERENCES customers(id),
  company_id integer REFERENCES companies(id),
  eligible_five boolean DEFAULT false,
  eligible_ten boolean DEFAULT false,
  eligible_fifteen boolean DEFAULT false,
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE loyalty_rewards (
  id SERIAL PRIMARY KEY,
  company_id integer REFERENCES companies(id),
  gold_reward_item text,
  silver_reward_item text,
  bronze_reward_item text,
  created_at timestamptz  DEFAULT (now() at time zone 'utc'),
  updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);


CREATE TABLE loyalty_used (
  id SERIAL PRIMARY KEY,
  amount_redeemed integer,
  customer_id integer REFERENCES customers(id),
  company_id integer REFERENCES companies(id),
  created_at timestamptz  DEFAULT (now() at time zone 'utc')
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
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
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
    power_reviewer boolean DEFAULT false,
    power_title text,
    reviewer_name text,
    review_photo text,
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);


CREATE TABLE search_preferences (
    id SERIAL PRIMARY KEY,
    customer_id integer REFERENCES customers(id),
    territory_id integer REFERENCES territories(id),
    distance float8,
    created_at timestamptz  DEFAULT (now() at time zone 'utc'),
    updated_at timestamptz  DEFAULT (now() at time zone 'utc')
);

CREATE TABLE gen_state (
  id SERIAL PRIMARY KEY,
  order_sys_order_id text,
  step_name text,
  step_status text,
  api_call text,
  param_string text,
  error_info text,
  info text
);

CREATE TABLE order_state (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES order_history(id),
  order_requested_step boolean DEFAULT false,
  order_accepted_step boolean DEFAULT false,
  order_pay_fail boolean DEFAULT false,
  order_paid_step boolean DEFAULT false,
  order_in_queue_step boolean DEFAULT false,
  order_cooking_step boolean DEFAULT false,
  order_ready_step boolean DEFAULT false,
  order_dispatched_step boolean DEFAULT false,
  order_picked_up_step boolean DEFAULT false,
  order_no_show_step boolean DEFAULT false,
  order_delivered_step boolean DEFAULT false,
  apiCall text,
  paramString text,
  errorInfo text,
  callInfo text
);

CREATE TABLE public.food_park_management
(
    id SERIAL PRIMARY KEY,
    id_food_park integer NOT NULL,
    id_unit integer NOT NULL,
    FOREIGN KEY (id_food_park)
        REFERENCES public.food_parks (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (id_unit)
        REFERENCES public.units (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE public.food_park_management
    IS 'This table represent the relationship that food parks are enable to see orders from units';

COPY roles (id, type) FROM stdin;
1	CUSTOMER
2	OWNER
3	UNITMGR
4	ADMIN
5	DRIVER
6	FOODPARKMGR
\.
SELECT pg_catalog.setval('roles_id_seq', 7, true);

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

REVOKE ALL ON TABLE countries FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE countries TO sfez_rw;

REVOKE ALL ON TABLE customers FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE customers TO sfez_rw;

REVOKE ALL ON TABLE delivery_addresses FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE delivery_addresses TO sfez_rw;

REVOKE ALL ON TABLE drivers FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE drivers TO sfez_rw;

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

REVOKE ALL ON TABLE order_state FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE order_state TO sfez_rw;

REVOKE ALL ON TABLE food_park_management FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_park_management TO sfez_rw;

GRANT SELECT ON TABLE information_schema.constraint_column_usage TO sfez_rw;
GRANT SELECT ON TABLE information_schema.key_column_usage TO sfez_rw;
GRANT SELECT ON TABLE information_schema.table_constraints TO sfez_rw;
GRANT SELECT ON TABLE pg_catalog.pg_constraint TO sfez_rw;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public to sfez_rw;
