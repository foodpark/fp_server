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
  moltin_client_id text,
  moltin_client_secret text,
  currency_id text DEFAULT('1554615357396746864'),
  currency text DEFAULT('BRL'),
  default_payment text
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
    territory_id integer REFERENCES territories(id),
    country_id integer REFERENCES countries(id),
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
    is_deleted boolean DEFAULT(false),
    custom_id jsonb DEFAULT '{}'
);

CREATE TABLE food_park_types (
    name text
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
    foodpark_mgr integer REFERENCES users(id) ON DELETE SET NULL,
    foodpark_mgr_id integer,
    type text
);

CREATE TABLE drivers_foodpark (
  available boolean DEFAULT false,
  food_park_id integer REFERENCES food_parks(id),
  user_id integer REFERENCES users(id)
);

CREATE TABLE square_user (
  merchant_id text,
  expires_at date,
  access_token text,
  user_id integer REFERENCES users(id)
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
    is_deleted boolean DEFAULT(false),
    veritas_id text
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
    is_deleted boolean DEFAULT(false),
    room_service boolean DEFAULT false,
    cash_on_delivery boolean DEFAULT false,
    prepay boolean DEFAULT false
);

CREATE TABLE square_unit (
    unit_id integer REFERENCES units(id),
    location_id text
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

CREATE TABLE commissions (
    name text NOT NULL,
    value double precision NOT NULL
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
  context text,
  commission_type text,
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

CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    name text,
    items jsonb[] NOT NULL,
    company integer REFERENCES companies(id),
    available boolean DEFAULT true,
    description text
);

CREATE TABLE loyalty_packages (
    company_id integer REFERENCES companies(id),
    tier text NOT NULL,
    package_id integer REFERENCES packages(id),
    id SERIAL PRIMARY KEY
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

CREATE TABLE manual_redeem_packages (
    redeem_code text,
    package_codes text[] NOT NULL
);

CREATE TABLE package_given (
    gifted_user integer REFERENCES users(id),
    package integer NOT NULL,
    quantity integer NOT NULL,
    qr_code text,
    id SERIAL PRIMARY KEY
);

CREATE TABLE prepay_history (
    date timestamp without time zone NOT NULL,
    transaction_id integer,
    type text
);

CREATE TABLE prepay_recharges (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES users(id),
    unit_id integer REFERENCES units(id),
    amount double precision NOT NULL,
    granuo_transaction_id text
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

CREATE TABLE food_park_management
(
    id SERIAL PRIMARY KEY,
    food_park_id integer NOT NULL,
    unit_id integer NOT NULL,
    FOREIGN KEY (food_park_id)
        REFERENCES food_parks (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (unit_id)
        REFERENCES units (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE events (
    id serial PRIMARY KEY,
    name text NOT NULL,
    ticketed boolean DEFAULT FALSE,
    start_date date NOT NULL,
    end_date date NOT NULL,
    schedule json[],
    manager integer REFERENCES USERS NOT NULL,
    social_media json,
    latitude float4,
    longitude float4,
    image text,
    sponsors json[],
    description text,
    count integer,
    venue_name text,
    ticket_price double precision,
    ticket_items jsonb[]
);

CREATE TABLE event_guests (
    guest integer REFERENCES users NOT NULL,
    event integer REFERENCES events NOT NULL,
    UNIQUE (guest,event)
);

CREATE OR REPLACE FUNCTION calc_earth_dist (lat1 NUMERIC, lng1 NUMERIC, lat2 NUMERIC, lng2 NUMERIC)
RETURNS NUMERIC AS $$
DECLARE
	delta_lat NUMERIC;
	delta_lng NUMERIC;
	a NUMERIC;
	c NUMERIC;
	d NUMERIC;
	earth_radius NUMERIC;
BEGIN
	delta_lat = radians(lat1) - radians(lat2);
	delta_lng = radians(lng1) - radians(lng2);
	earth_radius = 6371;

	a = sin(delta_lat/2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(delta_lng/2)^2;
	c = 2 * atan2(sqrt(a), sqrt(1 - a));
	d = earth_radius * c;

	return d;
END;
$$ language plpgsql;

COMMENT ON TABLE food_park_management
    IS 'This table represents the relationship that enable food parks to see orders from units';

COPY roles (id, type) FROM stdin;
1	CUSTOMER
2	OWNER
3	UNITMGR
4	ADMIN
5	DRIVER
6	FOODPARKMGR
\.
SELECT pg_catalog.setval('roles_id_seq', 7, true);

COPY food_park_types (name) FROM stdin;
MALL
EVENT
HOTEL
FOODPARK
FARMER
\.

COPY unit_types (id, type) FROM stdin;
1	TRUCK
2	CART
3	RESTAURANT
4	BEER
5	SPA
6	GIFT
7	BAR
8	CAFE
9	WINE
10	PIZZA
11	RETAIL
12	FITNESS
13	FARMERS
\.
SELECT pg_catalog.setval('unit_types_id_seq', 13, true);

COPY review_states (id, name, allowed_transitions) FROM stdin;
1	New	{2,3,4}
2	Approved	{3}
3	Updated	{2,4}
4	Disapproved	{3}
\.
SELECT pg_catalog.setval('review_states_id_seq', 5, true);


GRANT ALL ON SCHEMA public TO postgres;

GRANT ALL privileges ON ALL SEQUENCES IN SCHEMA public to sfez_rw;

GRANT ALL PRIVILEGES ON FUNCTION calc_earth_dist(numeric,numeric,numeric,numeric) TO sfez_rw;

REVOKE ALL ON TABLE admins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE admins TO sfez_rw;

REVOKE ALL ON TABLE checkins FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE checkins TO sfez_rw;

REVOKE ALL ON TABLE checkin_history FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE checkin_history TO sfez_rw;

REVOKE ALL ON TABLE commissions FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE commissions TO sfez_rw;

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

REVOKE ALL ON TABLE drivers_foodpark FROM PUBLIC;
GRANT ALL ON drivers_foodpark TO sfez_rw;

REVOKE ALL ON TABLE events FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE events TO sfez_rw;

REVOKE ALL ON TABLE event_guests FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE event_guests TO sfez_rw;

REVOKE ALL ON TABLE favorites FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE favorites TO sfez_rw;

REVOKE ALL ON TABLE food_parks FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_parks TO sfez_rw;

REVOKE ALL ON TABLE food_park_management FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_park_management TO sfez_rw;

REVOKE ALL ON TABLE food_park_types FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE food_park_types TO sfez_rw;

REVOKE ALL ON TABLE gen_state FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE gen_state TO sfez_rw;

REVOKE ALL ON TABLE locations FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE locations TO sfez_rw;

REVOKE ALL ON TABLE loyalty FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty TO sfez_rw;

REVOKE ALL ON TABLE loyalty_packages FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty_packages TO sfez_rw;

REVOKE ALL ON TABLE loyalty_rewards FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty_rewards TO sfez_rw;

REVOKE ALL ON TABLE loyalty_used FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE loyalty_used TO sfez_rw;

REVOKE ALL ON TABLE manual_redeem_packages FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE manual_redeem_packages TO sfez_rw;

REVOKE ALL ON TABLE order_history FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE order_history TO sfez_rw;

REVOKE ALL ON TABLE order_state FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE order_state TO sfez_rw;

REVOKE ALL ON TABLE package_given FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE package_given TO sfez_rw;

REVOKE ALL ON TABLE packages FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE packages TO sfez_rw;

REVOKE ALL ON TABLE prepay_history FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE prepay_history TO sfez_rw;

REVOKE ALL ON TABLE prepay_recharges FROM PUBLIC;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE prepay_recharges TO sfez_rw;

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

REVOKE ALL ON TABLE square_unit FROM PUBLIC;
GRANT ALL ON square_unit TO sfez_rw;

REVOKE ALL ON TABLE square_user FROM PUBLIC;
GRANT ALL ON square_user TO sfez_rw;

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

-- ADDED WITH ONLINE COMMIT
--
-- Name: requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.requests (
    id integer NOT NULL,
    customer_id integer,
    request_name text,
    request_photo text,
    category_id integer,
    latitude numeric(8,4),
    longitude numeric(8,4),
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
    modified_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
    is_deleted boolean DEFAULT false,
    request_description text,
    condition character varying(100),
    buy_back_term character varying(225),
    country character varying(100),
    state character varying(100),
    territory character varying(100)
);


ALTER TABLE public.requests OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.requests_id_seq OWNER TO postgres;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.requests_id_seq OWNED BY public.requests.id;

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);

--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 8, true);

--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);

--
-- Name: requests requests_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category character varying(125)
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;

--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);
--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);




--
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offers (
    id integer NOT NULL,
    request_id integer,
    request_name character varying(225),
    company_id integer,
    pawn_poc character varying(225),
    pawn_name character varying(225),
    pawn_address text,
    pawn_phone character varying(15),
    unit_id integer,
    cash_offer numeric(10,4) DEFAULT '0'::numeric,
    buy_back_amount numeric(10,4) DEFAULT '0'::numeric,
    tax_amount numeric(10,4) DEFAULT '0'::numeric,
    offer_term integer,
    offer_accepted boolean DEFAULT false,
    total_redemption numeric(10,4) DEFAULT '0'::numeric,
    maturity_date timestamp without time zone,
    interest_rate numeric(6,4) DEFAULT '0'::numeric,
    rating numeric(6,4) DEFAULT '0'::numeric,
    distance numeric(6,4) DEFAULT '0'::numeric,
    created_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
    modified_at timestamp without time zone DEFAULT timezone('UTC'::text, CURRENT_TIMESTAMP),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- Name: offers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.offers_id_seq OWNER TO postgres;

--
-- Name: offers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offers_id_seq OWNED BY public.offers.id;

--
-- Name: offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers ALTER COLUMN id SET DEFAULT nextval('public.offers_id_seq'::regclass);

--
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offers_id_seq', 5, true);

--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);



--
-- Name: contracts; Type: TABLE; Schema: public; Owner: sfez_rw
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    company_id integer,
    unit_id integer,
    customer_id integer,
    offer_id integer,
    request_name character varying(225),
    request_photo text,
    cash_offer numeric(8,4),
    buy_back_amount numeric(8,4),
    tax_amount numeric(8,4),
    term_months integer,
    qr_code character varying(225),
    offer_approved boolean DEFAULT true,
    status boolean DEFAULT true,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.contracts OWNER TO sfez_rw;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: sfez_rw
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contracts_id_seq OWNER TO sfez_rw;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: sfez_rw
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name text,
    is_enabled boolean DEFAULT false,
    tax_band text,
    moltin_client_id text,
    moltin_client_secret text,
    currency_id text DEFAULT '1554615357396746864'::text,
    currency text DEFAULT 'BRL'::text
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: sfez_rw
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);

--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sfez_rw
--

SELECT pg_catalog.setval('public.contracts_id_seq', 3, true);

--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: sfez_rw
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);
