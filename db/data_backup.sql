--
-- PostgreSQL database dump
--

-- Dumped from database version 10.3
-- Dumped by pg_dump version 10.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: calc_earth_dist(numeric, numeric, numeric, numeric); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.calc_earth_dist(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.calc_earth_dist(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    description text,
    photo text,
    phone text,
    super_admin boolean DEFAULT false,
    city text,
    state text,
    country text,
    user_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


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
-- Name: checkin_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkin_history (
    id integer NOT NULL,
    unit_name text,
    unit_id integer,
    company_name text,
    company_id integer,
    user_id integer,
    service_cancellation_time timestamp with time zone,
    check_in timestamp with time zone,
    check_out timestamp with time zone,
    latitude double precision,
    longitude double precision,
    food_park_name text,
    food_park_id integer,
    note text,
    display_address text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.checkin_history OWNER TO postgres;

--
-- Name: checkin_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checkin_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.checkin_history_id_seq OWNER TO postgres;

--
-- Name: checkin_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checkin_history_id_seq OWNED BY public.checkin_history.id;


--
-- Name: checkins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkins (
    id integer NOT NULL,
    check_in timestamp with time zone,
    check_out timestamp with time zone,
    latitude double precision,
    longitude double precision,
    display_address text,
    food_park_name text,
    note text,
    food_park_id integer,
    unit_id integer,
    company_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.checkins OWNER TO postgres;

--
-- Name: checkins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.checkins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.checkins_id_seq OWNER TO postgres;

--
-- Name: checkins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.checkins_id_seq OWNED BY public.checkins.id;


--
-- Name: companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.companies (
    id integer NOT NULL,
    name text NOT NULL,
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
    country_id integer,
    taxband text,
    tags text,
    stub boolean,
    calculated_rating numeric,
    user_id integer,
    show_vendor_setup boolean DEFAULT true,
    default_unit integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    is_deleted boolean DEFAULT false,
    territory_id integer
);


ALTER TABLE public.companies OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.companies_id_seq OWNER TO postgres;

--
-- Name: companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.companies_id_seq OWNED BY public.companies.id;


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
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countries_id_seq OWNER TO postgres;

--
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id integer NOT NULL,
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
    user_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_id_seq OWNER TO postgres;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: delivery_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_addresses (
    id integer NOT NULL,
    nickname text,
    address1 text,
    address2 text,
    city text,
    state text,
    phone text,
    customer_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.delivery_addresses OWNER TO postgres;

--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delivery_addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.delivery_addresses_id_seq OWNER TO postgres;

--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delivery_addresses_id_seq OWNED BY public.delivery_addresses.id;


--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    id integer NOT NULL,
    name text,
    phone text,
    available boolean DEFAULT false,
    unit_id integer,
    company_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    user_id integer,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_foodpark; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers_foodpark (
    available boolean DEFAULT false,
    food_park_id integer,
    user_id integer
);


ALTER TABLE public.drivers_foodpark OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.drivers_id_seq OWNER TO postgres;

--
-- Name: drivers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_id_seq OWNED BY public.drivers.id;


--
-- Name: event_guests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_guests (
    guest integer NOT NULL,
    event integer NOT NULL
);


ALTER TABLE public.event_guests OWNER TO postgres;

--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name text NOT NULL,
    ticketed boolean DEFAULT false,
    start_date date NOT NULL,
    end_date date NOT NULL,
    schedule json[],
    manager integer NOT NULL,
    social_media json,
    latitude real,
    longitude real,
    image text,
    sponsors json[]
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    customer_id integer NOT NULL,
    unit_id integer NOT NULL,
    company_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: food_park_management; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_park_management (
    id integer NOT NULL,
    food_park_id integer NOT NULL,
    unit_id integer NOT NULL
);


ALTER TABLE public.food_park_management OWNER TO postgres;

--
-- Name: TABLE food_park_management; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.food_park_management IS 'This table represents the relationship that food parks are enable to see orders from units';


--
-- Name: food_park_management_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.food_park_management_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_park_management_id_seq OWNER TO postgres;

--
-- Name: food_park_management_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.food_park_management_id_seq OWNED BY public.food_park_management.id;


--
-- Name: food_parks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.food_parks (
    id integer NOT NULL,
    name text NOT NULL,
    photo text,
    territory_id integer,
    city text,
    state text,
    postal_code text,
    country text,
    latitude double precision,
    longitude double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    is_deleted boolean DEFAULT false,
    foodpark_mgr integer
);


ALTER TABLE public.food_parks OWNER TO postgres;

--
-- Name: food_parks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.food_parks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.food_parks_id_seq OWNER TO postgres;

--
-- Name: food_parks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.food_parks_id_seq OWNED BY public.food_parks.id;


--
-- Name: gen_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gen_state (
    id integer NOT NULL,
    order_sys_order_id text,
    step_name text,
    step_status text,
    api_call text,
    param_string text,
    error_info text,
    info text
);


ALTER TABLE public.gen_state OWNER TO postgres;

--
-- Name: gen_state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.gen_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.gen_state_id_seq OWNER TO postgres;

--
-- Name: gen_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.gen_state_id_seq OWNED BY public.gen_state.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    name text NOT NULL,
    type text,
    main_loc_text text,
    secondary_loc_text text,
    regex_seed text,
    hitcount integer,
    territory_id integer,
    latitude double precision,
    longitude double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO postgres;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: loyalty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty (
    id integer NOT NULL,
    balance integer,
    customer_id integer,
    company_id integer,
    eligible_five boolean DEFAULT false,
    eligible_ten boolean DEFAULT false,
    eligible_fifteen boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.loyalty OWNER TO postgres;

--
-- Name: loyalty_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loyalty_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loyalty_id_seq OWNER TO postgres;

--
-- Name: loyalty_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loyalty_id_seq OWNED BY public.loyalty.id;


--
-- Name: loyalty_rewards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_rewards (
    id integer NOT NULL,
    company_id integer,
    gold_reward_item text,
    silver_reward_item text,
    bronze_reward_item text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.loyalty_rewards OWNER TO postgres;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loyalty_rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loyalty_rewards_id_seq OWNER TO postgres;

--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loyalty_rewards_id_seq OWNED BY public.loyalty_rewards.id;


--
-- Name: loyalty_used; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_used (
    id integer NOT NULL,
    amount_redeemed integer,
    customer_id integer,
    company_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.loyalty_used OWNER TO postgres;

--
-- Name: loyalty_used_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loyalty_used_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.loyalty_used_id_seq OWNER TO postgres;

--
-- Name: loyalty_used_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loyalty_used_id_seq OWNED BY public.loyalty_used.id;


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
-- Name: order_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_history (
    id integer NOT NULL,
    order_sys_order_id text,
    amount text,
    initiation_time timestamp with time zone,
    payment_time timestamp with time zone,
    actual_pickup_time timestamp with time zone,
    desired_pickup_time timestamp with time zone,
    prep_notice_time timestamp with time zone,
    status jsonb,
    messages text,
    qr_code text,
    manual_pickup boolean DEFAULT false,
    for_delivery boolean DEFAULT false,
    desired_delivery_time timestamp with time zone,
    delivery_address_id integer,
    delivery_address_details jsonb,
    driver_id integer,
    contact text,
    order_detail jsonb,
    checkin_id integer,
    customer_name text,
    customer_id integer,
    unit_id integer,
    company_name text,
    company_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.order_history OWNER TO postgres;

--
-- Name: order_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_history_id_seq OWNER TO postgres;

--
-- Name: order_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_history_id_seq OWNED BY public.order_history.id;


--
-- Name: order_state; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_state (
    id integer NOT NULL,
    order_id integer,
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
    apicall text,
    paramstring text,
    errorinfo text,
    callinfo text
);


ALTER TABLE public.order_state OWNER TO postgres;

--
-- Name: order_state_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_state_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_state_id_seq OWNER TO postgres;

--
-- Name: order_state_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_state_id_seq OWNED BY public.order_state.id;


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


--
-- Name: review_approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_approvals (
    id integer NOT NULL,
    review_id integer,
    reviewer_id integer,
    status text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.review_approvals OWNER TO postgres;

--
-- Name: review_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_approvals_id_seq OWNER TO postgres;

--
-- Name: review_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_approvals_id_seq OWNED BY public.review_approvals.id;


--
-- Name: review_states; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_states (
    id integer NOT NULL,
    name text NOT NULL,
    allowed_transitions integer[]
);


ALTER TABLE public.review_states OWNER TO postgres;

--
-- Name: review_states_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.review_states_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.review_states_id_seq OWNER TO postgres;

--
-- Name: review_states_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.review_states_id_seq OWNED BY public.review_states.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    comment text,
    rating numeric,
    answers json,
    customer_id integer,
    company_id integer,
    unit_id integer,
    status text,
    power_reviewer boolean DEFAULT false,
    power_title text,
    reviewer_name text,
    review_photo text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    contract_id integer
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: search_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.search_preferences (
    id integer NOT NULL,
    customer_id integer,
    territory_id integer,
    distance double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE public.search_preferences OWNER TO postgres;

--
-- Name: search_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.search_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.search_preferences_id_seq OWNER TO postgres;

--
-- Name: search_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.search_preferences_id_seq OWNED BY public.search_preferences.id;


--
-- Name: square_unit; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.square_unit (
    unit_id integer,
    location_id text
);


ALTER TABLE public.square_unit OWNER TO postgres;

--
-- Name: square_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.square_user (
    merchant_id text,
    expires_at date,
    access_token text,
    user_id integer
);


ALTER TABLE public.square_user OWNER TO postgres;

--
-- Name: territories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.territories (
    id integer NOT NULL,
    city text,
    territory text,
    state text,
    country text,
    country_id integer,
    timezone text,
    latitude double precision,
    longitude double precision,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.territories OWNER TO postgres;

--
-- Name: territories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.territories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.territories_id_seq OWNER TO postgres;

--
-- Name: territories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.territories_id_seq OWNED BY public.territories.id;


--
-- Name: unit_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unit_types (
    id integer NOT NULL,
    type text NOT NULL
);


ALTER TABLE public.unit_types OWNER TO postgres;

--
-- Name: unit_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unit_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.unit_types_id_seq OWNER TO postgres;

--
-- Name: unit_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unit_types_id_seq OWNED BY public.unit_types.id;


--
-- Name: units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.units (
    id integer NOT NULL,
    name text NOT NULL,
    number integer,
    type text,
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
    territory_id integer,
    company_id integer,
    unit_mgr_id integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    currency_id text DEFAULT '1554615357396746864'::text,
    currency text DEFAULT 'BRL'::text,
    payment text DEFAULT 'SumUp'::text,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.units OWNER TO postgres;

--
-- Name: units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.units_id_seq OWNER TO postgres;

--
-- Name: units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.units_id_seq OWNED BY public.units.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    first_name text,
    last_name text,
    role text,
    territory_id integer,
    country_id integer,
    phone text,
    provider text,
    provider_id text,
    provider_data text,
    fbid text,
    fb_token text,
    fb_login boolean,
    default_language text DEFAULT 'en'::text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: checkin_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history ALTER COLUMN id SET DEFAULT nextval('public.checkin_history_id_seq'::regclass);


--
-- Name: checkins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkins ALTER COLUMN id SET DEFAULT nextval('public.checkins_id_seq'::regclass);


--
-- Name: companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies ALTER COLUMN id SET DEFAULT nextval('public.companies_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: sfez_rw
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: delivery_addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_addresses ALTER COLUMN id SET DEFAULT nextval('public.delivery_addresses_id_seq'::regclass);


--
-- Name: drivers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN id SET DEFAULT nextval('public.drivers_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: food_park_management id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_park_management ALTER COLUMN id SET DEFAULT nextval('public.food_park_management_id_seq'::regclass);


--
-- Name: food_parks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_parks ALTER COLUMN id SET DEFAULT nextval('public.food_parks_id_seq'::regclass);


--
-- Name: gen_state id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gen_state ALTER COLUMN id SET DEFAULT nextval('public.gen_state_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: loyalty id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty ALTER COLUMN id SET DEFAULT nextval('public.loyalty_id_seq'::regclass);


--
-- Name: loyalty_rewards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_rewards ALTER COLUMN id SET DEFAULT nextval('public.loyalty_rewards_id_seq'::regclass);


--
-- Name: loyalty_used id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_used ALTER COLUMN id SET DEFAULT nextval('public.loyalty_used_id_seq'::regclass);


--
-- Name: offers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers ALTER COLUMN id SET DEFAULT nextval('public.offers_id_seq'::regclass);


--
-- Name: order_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history ALTER COLUMN id SET DEFAULT nextval('public.order_history_id_seq'::regclass);


--
-- Name: order_state id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_state ALTER COLUMN id SET DEFAULT nextval('public.order_state_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests ALTER COLUMN id SET DEFAULT nextval('public.requests_id_seq'::regclass);


--
-- Name: review_approvals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_approvals ALTER COLUMN id SET DEFAULT nextval('public.review_approvals_id_seq'::regclass);


--
-- Name: review_states id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_states ALTER COLUMN id SET DEFAULT nextval('public.review_states_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: search_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_preferences ALTER COLUMN id SET DEFAULT nextval('public.search_preferences_id_seq'::regclass);


--
-- Name: territories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territories ALTER COLUMN id SET DEFAULT nextval('public.territories_id_seq'::regclass);


--
-- Name: unit_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_types ALTER COLUMN id SET DEFAULT nextval('public.unit_types_id_seq'::regclass);


--
-- Name: units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units ALTER COLUMN id SET DEFAULT nextval('public.units_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admins (id, description, photo, phone, super_admin, city, state, country, user_id, created_at, updated_at) FROM stdin;
1	\N	\N	\N	f	\N	\N	\N	11011	2016-10-20 23:33:15.198515+05:30	2016-10-20 23:33:15.198515+05:30
2	\N	\N	\N	f	\N	\N	\N	11012	2016-10-22 18:42:04.186193+05:30	2016-10-22 18:42:04.186193+05:30
3	\N	\N	\N	f	\N	\N	\N	11013	2016-10-22 18:41:25.893483+05:30	2016-10-22 18:41:25.893483+05:30
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, category) FROM stdin;
\.


--
-- Data for Name: checkin_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checkin_history (id, unit_name, unit_id, company_name, company_id, user_id, service_cancellation_time, check_in, check_out, latitude, longitude, food_park_name, food_park_id, note, display_address, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: checkins; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checkins (id, check_in, check_out, latitude, longitude, display_address, food_park_name, note, food_park_id, unit_id, company_id, created_at, updated_at) FROM stdin;
18	2017-02-08 03:25:47.541+05:30	2017-02-07 18:21:41.99+05:30	-5.88766820000000024	-35.1715465999999992	Praia Shopping	\N	\N	\N	2006	1005	2017-02-07 22:25:48.037+05:30	2017-02-07 18:21:43.188544+05:30
20	2017-02-08 13:55:51.148+05:30	2017-02-08 22:00:55.402+05:30	-5.78410400000000013	-35.1892759999999996	\N	Bar 54 Food Park - Rua Porto Mirim	\N	3007	2001	\N	2017-02-08 08:56:51.333344+05:30	2017-02-08 08:56:51.333344+05:30
21	2017-02-08 14:11:22.967+05:30	2017-02-08 21:40:14.668+05:30	-5.78410400000000013	-35.1892759999999996	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2001	\N	2017-02-08 09:13:16.979797+05:30	2017-02-08 09:13:16.979797+05:30
22	2017-02-08 16:37:11.68+05:30	2017-02-08 18:25:21.608+05:30	-5.86576900000000023	\N	\N	Neide Artesanato/Praia Shopping Food Park - Av. Roberto Freire	\N	3005	2001	\N	2017-02-08 11:37:23.383044+05:30	2017-02-08 11:37:23.383044+05:30
23	2017-02-08 16:56:06.759+05:30	2017-02-08 18:00:09.256+05:30	-5.80574800000000035	\N	\N	Bar Trove Food Park - Rua Presidente José Bento	\N	3008	2001	\N	2017-02-08 11:56:12.150683+05:30	2017-02-08 11:56:12.150683+05:30
19	2017-02-08 05:01:49.792+05:30	2017-02-08 13:31:59.452+05:30	-5.88765149999999959	-35.1716704999999976	Ponta Negra	\N	\N	\N	2006	1005	2017-02-08 00:01:50.094+05:30	2017-02-08 13:32:00.427033+05:30
24	2017-02-08 23:32:11.986+05:30	2017-02-08 13:32:29.192+05:30	30.7313316999999984	76.7278691000000066	\N	\N	\N	\N	2006	1005	2017-02-08 18:32:12.872+05:30	2017-02-08 13:32:30.124958+05:30
26	2017-02-08 18:36:14.163+05:30	2017-02-08 21:30:23.012+05:30	-5.84256300000000017	\N	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2001	\N	2017-02-08 13:36:24.771952+05:30	2017-02-08 13:36:24.771952+05:30
33	2017-03-02 09:28:20+05:30	2017-04-07 16:59:17.198+05:30	-5.87741700000000034	-35.2058779999999985	null	Neide Artesanato/Praia Shopping Food Park	\N	\N	2006	1005	2017-03-22 18:15:26.85+05:30	2017-04-07 16:59:17.229711+05:30
29	2017-02-23 02:02:00+05:30	2017-03-23 02:02:00+05:30	22.7455603999999987	75.8933786000000055	palasia, indore	\N	\N	\N	\N	\N	2017-03-22 17:31:58.199798+05:30	2017-03-22 17:32:11.638634+05:30
30	2017-02-23 02:02:00+05:30	2017-03-23 03:00:00+05:30	30.2560785999999986	-97.7635090999999932	\N	Alamo Drafthouse	\N	3002	\N	\N	2017-03-22 17:32:25.881442+05:30	2017-03-22 17:32:25.881442+05:30
58	2017-04-07 17:20:12.844+05:30	2017-04-07 19:17:07.766+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2089	1088	2017-04-07 17:20:12.586+05:30	2017-04-07 19:17:08.222363+05:30
59	2017-04-07 20:28:37.62+05:30	2017-04-08 08:27:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2089	1088	2017-04-07 20:28:37.99078+05:30	2017-04-07 20:28:37.99078+05:30
50	2017-03-30 09:14:33.811+05:30	2017-03-30 20:10:00+05:30	30.2544286999999983	-97.7371196999999938	\N	Austin Food Park	\N	\N	2089	1088	2017-03-30 09:16:28.896355+05:30	2017-03-30 09:16:28.896355+05:30
61	2017-03-08 21:21:00+05:30	2017-04-09 06:30:00+05:30	-5.86576900000000023	-35.1858780000000024	\N	Neide Artesanato/Praia Shopping Food Park - Av. Roberto Freire	\N	3005	2089	1088	2017-04-08 21:21:25.082559+05:30	2017-04-08 21:21:25.082559+05:30
62	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2017-04-10 18:44:36.822971+05:30	2017-04-10 18:44:36.822971+05:30
63	2017-03-11 03:39:00+05:30	2017-04-11 06:04:00+05:30	30.2560785999999986	-97.7635090999999932	\N	Alamo Drafthouse	\N	3002	\N	\N	2017-04-10 19:08:39.09565+05:30	2017-04-10 19:08:39.09565+05:30
13	2016-09-06 17:30:00+05:30	2017-03-25 15:09:09.277+05:30	-5.88741700000000012	-35.1734379999999973	\N	\N	\N	\N	2070	1005	2017-02-06 15:25:18.766+05:30	2017-03-25 15:09:09.580503+05:30
41	2017-03-02 09:28:20+05:30	2017-03-27 08:05:00+05:30	-5.87741700000000034	-35.1834380000000024	Corner of 1st and Jackson	\N	\N	\N	2075	1008	2017-03-24 16:27:20.195738+05:30	2017-03-27 08:05:33.944179+05:30
64	2017-03-11 03:47:00+05:30	2017-04-11 03:47:00+05:30	30.2635748000000007	-97.7627071000000001	\N	The Picnic	\N	3001	\N	\N	2017-04-10 19:16:19.758491+05:30	2017-04-10 19:16:32.729587+05:30
65	2017-03-11 03:48:00+05:30	2017-04-11 06:02:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	\N	\N	2017-04-10 19:17:03.900462+05:30	2017-04-10 19:17:03.900462+05:30
90	2017-03-24 22:43:00+05:30	2017-04-25 06:30:00+05:30	-5.84996160000000032	-35.1991627000000022	here	\N	\N	\N	\N	\N	2017-04-24 22:43:52.40711+05:30	2017-04-24 22:43:52.40711+05:30
68	2017-03-12 00:36:00+05:30	2017-04-12 08:24:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2075	1008	2017-04-11 16:09:32.053836+05:30	2017-04-11 16:09:32.053836+05:30
36	2017-02-23 20:30:00+05:30	2017-04-13 17:05:01.479+05:30	-5.88020000000000032	-35.1876999999999995	\N	Neide Artesanato/Praia Shopping Food Park - Av. Roberto Freire	\N	3005	2075	1008	2017-03-23 12:00:47.437+05:30	2017-04-13 16:43:45.44292+05:30
70	2017-04-13 17:05:31.173+05:30	2017-04-13 23:55:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2075	1008	2017-04-13 16:44:15.135138+05:30	2017-04-13 16:44:15.135138+05:30
71	2017-03-01 22:00:00+05:30	2018-03-12 08:25:34+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2133	1110	2017-04-13 18:36:18.824972+05:30	2017-04-13 18:36:18.824972+05:30
12	2016-09-06 17:30:00+05:30	2017-04-03 16:17:37.089+05:30	-5.87337400000000009	-35.1766950000000023	\N	\N	\N	\N	2003	1001	2017-02-06 14:53:36.192+05:30	2017-04-03 15:56:42.41617+05:30
46	2017-03-28 22:25:40.829+05:30	2017-04-03 16:21:45.946+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	\N	2089	1088	2017-03-28 22:25:41.178+05:30	2017-04-03 16:00:51.239231+05:30
54	2017-04-03 16:22:06.84+05:30	2017-04-03 20:21:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2089	1088	2017-04-03 16:01:12.143954+05:30	2017-04-03 16:01:12.143954+05:30
55	2017-03-04 01:19:00+05:30	2017-04-04 07:10:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2089	1088	2017-04-03 16:49:15.005878+05:30	2017-04-03 16:49:15.005878+05:30
73	2017-02-23 20:30:00+05:30	2018-03-12 08:20:34+05:30	-5.88020000000000032	-35.1876999999999995	\N	Neide Artesanato/Praia Shopping Food Park - Av. Roberto Freire	\N	3005	2097	1095	2017-04-14 18:37:43.183511+05:30	2017-04-14 18:37:43.183511+05:30
57	2017-04-04 19:32:48.355+05:30	2017-04-04 19:33:25.499+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	\N	2103	1102	2017-04-04 17:32:55.463+05:30	2017-04-04 17:33:32.589245+05:30
91	2017-03-24 22:45:00+05:30	2017-04-24 22:49:00+05:30	-5.84996100000000041	-35.1991603000000026	here	\N	\N	\N	\N	\N	2017-04-24 22:45:49.212905+05:30	2017-04-24 22:50:09.416697+05:30
80	\N	2018-03-12 08:22:34+05:30	\N	\N	\N	\N	\N	\N	\N	\N	2017-04-17 17:46:57.979292+05:30	2017-04-17 17:46:57.979292+05:30
74	2017-03-15 19:23:00+05:30	2017-04-15 19:28:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2089	1088	2017-04-15 19:23:19.717478+05:30	2017-04-15 19:28:12.130579+05:30
75	2017-03-15 20:04:00+05:30	2017-04-15 20:06:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2089	1088	2017-04-15 20:04:35.821761+05:30	2017-04-15 20:06:05.53101+05:30
84	2017-03-21 19:47:00+05:30	2017-04-22 21:13:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2096	1094	2017-04-21 19:47:01.55118+05:30	2017-04-22 12:43:29.932857+05:30
85	2017-03-22 21:15:00+05:30	2017-04-23 09:00:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2096	1094	2017-04-22 12:45:00.213699+05:30	2017-04-23 09:00:34.425112+05:30
86	2017-03-23 09:01:00+05:30	2017-04-24 07:44:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2096	1094	2017-04-23 09:01:02.572963+05:30	2017-04-23 09:01:02.572963+05:30
87	2017-04-24 13:16:13.957+05:30	2017-04-24 21:36:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-04-24 12:54:30.248205+05:30	2017-04-24 13:06:05.30444+05:30
88	2017-03-24 21:37:00+05:30	2017-04-25 00:49:00+05:30	22.7461646000000002	75.8935146000000032	\N	\N	\N	\N	2096	1094	2017-04-24 13:07:08.155947+05:30	2017-04-24 16:19:08.325108+05:30
92	2017-03-24 22:50:00+05:30	2017-04-24 23:07:00+05:30	-5.84993150000000028	-35.1991711000000009	here	\N	\N	\N	\N	\N	2017-04-24 22:51:12.241468+05:30	2017-04-24 23:07:35.196097+05:30
93	2017-03-24 23:07:00+05:30	2017-04-24 23:09:00+05:30	-5.84993029999999958	-35.1991701999999975	there	\N	\N	\N	\N	\N	2017-04-24 23:08:07.348037+05:30	2017-04-24 23:10:01.29428+05:30
94	2017-03-24 23:10:00+05:30	2017-04-25 06:30:00+05:30	-5.84993150000000028	-35.1991711000000009	in front of house	\N	\N	\N	\N	\N	2017-04-24 23:10:49.49971+05:30	2017-04-24 23:10:49.49971+05:30
95	2017-03-24 23:15:00+05:30	2017-04-24 23:15:00+05:30	-5.84993029999999958	-35.1991701999999975	here	\N	\N	\N	2103	1102	2017-04-24 23:15:18.811531+05:30	2017-04-24 23:15:34.894376+05:30
96	2017-03-24 23:15:00+05:30	2017-04-25 02:21:00+05:30	-5.84993129999999972	-35.1991701999999975	here	\N	\N	\N	2103	1102	2017-04-24 23:15:58.802514+05:30	2017-04-25 02:21:51.431628+05:30
97	2017-03-25 02:02:00+05:30	2017-04-25 16:45:00+05:30	-5.84993150000000028	-35.1991711000000009	proximo na igreja catolico	\N	\N	\N	2136	1112	2017-04-25 02:03:11.089569+05:30	2017-04-25 16:45:24.352315+05:30
98	2017-03-25 16:45:00+05:30	2017-04-25 16:52:00+05:30	-5.84989999999999988	-35.1992107000000019	in front of Dennis' house	\N	\N	\N	2136	1112	2017-04-25 16:45:57.901901+05:30	2017-04-25 16:53:02.422456+05:30
89	2017-03-25 00:49:00+05:30	2017-04-26 02:39:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2096	1094	2017-04-24 16:19:39.439212+05:30	2017-04-26 02:39:21.316504+05:30
100	2017-03-26 02:39:00+05:30	2017-04-26 07:28:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2096	1094	2017-04-26 02:39:41.731598+05:30	2017-04-26 07:28:29.563265+05:30
101	2017-03-26 07:29:00+05:30	2017-04-26 08:29:00+05:30	-5.88771799999999956	-35.172463399999998	Home	\N	\N	\N	2096	1094	2017-04-26 07:29:49.529756+05:30	2017-04-26 07:29:49.529756+05:30
102	2017-04-26 13:02:31.884+05:30	2017-04-26 23:59:00+05:30	-5.84256300000000017	-35.2106240000000028	rua da campina 140 natal-rn	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-04-26 12:40:43.251839+05:30	2017-04-26 12:40:43.251839+05:30
69	2017-03-01 22:00:00+05:30	2017-05-01 12:38:47.162+05:30	-5.87437400000000043	-35.1886950000000027	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2132	1109	2017-04-12 17:40:55.875+05:30	2017-05-01 12:16:47.825541+05:30
99	2017-03-25 16:53:00+05:30	2017-04-27 01:29:00+05:30	-5.84989890000000035	-35.1992152999999988	Dennis' house	\N	\N	\N	2136	1112	2017-04-25 16:53:37.860805+05:30	2017-04-27 01:29:41.074747+05:30
106	2017-03-27 01:31:00+05:30	2017-04-27 06:30:00+05:30	-5.85206729999999986	-35.2027020000000022	proximo Fiat pnta negra	\N	\N	\N	2136	1112	2017-04-27 01:31:44.882136+05:30	2017-04-27 01:31:44.882136+05:30
111	2017-03-27 19:37:00+05:30	2017-04-28 08:00:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2094	1092	2017-04-27 19:37:13.184144+05:30	2017-04-27 19:37:13.184144+05:30
110	2017-03-28 15:52:00+05:30	2017-04-27 20:42:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2096	1094	2017-04-27 19:22:21.085512+05:30	2017-04-27 20:42:09.809015+05:30
112	2017-03-27 20:42:00+05:30	2017-04-28 07:30:00+05:30	-5.87437400000000043	-35.1786949999999976	\N	Truck Garden Food Park - Av. Roberto Freire	\N	3004	2096	1094	2017-04-27 20:42:22.654494+05:30	2017-04-27 20:42:22.654494+05:30
113	2017-04-28 11:52:26.784+05:30	2017-04-28 23:52:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-04-28 11:30:34.889965+05:30	2017-04-28 11:30:34.889965+05:30
114	2017-04-28 11:52:55.773+05:30	2017-04-28 23:52:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2094	1092	2017-04-28 11:31:03.835591+05:30	2017-04-28 11:31:03.835591+05:30
115	2017-03-29 01:06:00+05:30	2017-04-29 08:28:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	3006	2094	1092	2017-04-28 16:36:36.526835+05:30	2017-04-28 16:36:36.526835+05:30
116	2017-05-01 12:39:19.883+05:30	2017-05-01 23:39:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2094	1092	2017-05-01 12:17:20.604072+05:30	2017-05-01 12:17:20.604072+05:30
117	2017-05-01 19:29:09.16+05:30	2017-05-01 20:45:15.204+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-05-01 19:07:08.846+05:30	2017-05-01 20:23:14.523601+05:30
119	2017-05-01 21:06:27.098+05:30	2017-05-01 21:06:32.03+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2075	1008	2017-05-01 20:44:26.864+05:30	2017-05-01 20:44:32.130085+05:30
118	2017-05-01 20:45:32.021+05:30	2017-05-01 21:08:29.06+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-05-01 20:23:31.412+05:30	2017-05-01 20:46:29.306648+05:30
120	2017-05-01 21:08:41.543+05:30	2017-05-01 23:08:00+05:30	-5.84256300000000017	-35.2106240000000028	\N	Natal Shopping Food Park - Av. das Brancas Dunas	\N	\N	2096	1094	2017-05-01 20:46:40.806176+05:30	2017-05-01 20:46:40.806176+05:30
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.companies (id, name, order_sys_id, base_slug, default_cat, daily_special_cat_id, daily_special_item_id, delivery_chg_cat_id, delivery_chg_item_id, delivery_chg_amount, description, email, phone, facebook, twitter, instagram, photo, featured_dish, hours, schedule, business_address, city, state, country, country_id, taxband, tags, stub, calculated_rating, user_id, show_vendor_setup, default_unit, created_at, updated_at, is_deleted, territory_id) FROM stdin;
1090	luigi	1476478201743016015	luigi-1490229939223	1476478209586364496	1476478217429712977	\N	1476478225247895634	1476478235406499923	1.6	\N	firminoata@gmail.com	\N	\N	\N	\N	https://commercecdn.com/1278235777548943678/e5a1db23-d896-4773-9dbb-607d37ceb38c.jpeg	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11219	t	\N	2017-03-23 06:15:43.432664+05:30	2017-03-23 06:15:43.432664+05:30	f	\N
1089	Vinay Bhavsar	1476087582344347651	vinay-bhavsar-1490183373758	1476087589952815108	1476087597687111685	\N	1476087605303967750	1476087615227691015	1.6	Just testing	vinaybhavsar@cdnsol.com	9893479705	\N	\N	\N	https://commercecdn.com/1278235777548943678/139509f9-dd3d-4216-b4d1-80205e62d577.jpeg	https://commercecdn.com/1278235777548943678/ed1b07d1-857b-4cbe-9ccd-252ead133d6f.jpeg	11:00 AM-8:00 PM	0,1,2,3,4,5,6	304 CDN Software Solutions, Princess Sky Park, AB Road, Indore	\N	\N	\N	1	\N	#testing	\N	\N	11217	t	\N	2017-03-22 17:19:37.871349+05:30	2017-03-22 17:19:37.871349+05:30	f	\N
1001	Pacos Tacos	1293770040725734215	pacos-1472261511383	1325748109401129298	1463318392957043417	1488707787419550321	1463321163915592413	1463324599998481122	1.6	Fresh street food tacos	tacos@pacos.com	\N	www.facebook.com/pacostacos	@pacostacos	\N	commercecdn.com/1278235777548943678/9e5cd3fe-8f1b-4741-96c6-f54b90e5cf9a.jpeg	commercecdn.com/1278235777548943678/36091932-cb57-46ea-8694-bdaf344a0083.jpeg	11am-8pm		\N	\N	\N	\N	1	\N	tacos, enchiladas	\N	\N	11004	t	\N	2016-08-27 07:01:52.102+05:30	2017-03-05 02:42:32.307442+05:30	f	\N
1093	Nuvo	1478299382196470212	nuvo-1490447040851	1478299389981098437	1478299397690229190	\N	1478299405265142215	1478299415230808520	1.6	\N	nuvo@me.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11225	t	\N	2017-03-25 18:34:04.990298+05:30	2017-03-25 18:34:04.990298+05:30	f	\N
1095	Frank's BBQ	1480658966731030601	frank-s-bbq-1490728325251	1480658974465327178	1480658982182846539	1497996578563031143	1480658990454014028	1480659000478400589	9	Old fashion country bbq ready when you are!	streetfoodez@sumup.com	555-frankbbqnow	www.facebook.com/franksbbq	\N	\N	https://commercecdn.com/1278235777548943678/b73963cc-0025-4b0f-a2e3-3d1ac4ec1994.jpeg	https://commercecdn.com/1278235777548943678/3800a579-f9a8-4964-949e-fb53ed5d16d4.jpeg	12:00 PM-10:00 PM	0,1,2	123 bbq lane	\N	\N	\N	1	\N	bbq, pulled pork, brisket	\N	\N	11229	t	\N	2017-03-29 00:42:09.468753+05:30	2017-03-29 00:42:09.468753+05:30	f	\N
1097	My Food	1482791807895995121	my-food-1490982579738	1482791815806452466	1482791823398142707	\N	1482791831199548148	1482791841316209397	10	Best tacos in Natal!	Jimmy@MyFood.com	555-9999	www.facebook.com/myfood	\N	\N	https://commercecdn.com/1278235777548943678/386aac36-54fd-40e0-b697-375a04eb7c41.jpeg	https://commercecdn.com/1278235777548943678/056182db-e37a-49dc-a17a-915171e80a58.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	123 Jackson ave	\N	\N	\N	1	\N	tacos, enchiladas	\N	\N	11233	t	\N	2017-03-31 23:19:43.924178+05:30	2017-03-31 23:19:43.924178+05:30	f	\N
1008	Grilla Cheez	1441733842225332401	grilla-cheez-1486088088823	1441733850261618866	1463313172281688785	1468229545193636616	1441733858146910387	1441733867391156404	8	Get your taste buds ready for a cheese avalanche	streetfoodez@sumup.com	\N	www.facebook.com/grillacheez	\N	\N	https://commercecdn.com/1278235777548943678/b10b1939-f66f-4b49-837d-9c40a66d1ed0.jpeg	https://commercecdn.com/1278235777548943678/1d035d77-a55d-43fd-8654-e8f03de61220.jpeg	-		\N	\N	\N	\N	1	\N	grilled cheese, panini	\N	\N	11025	t	\N	2017-02-03 12:44:52.001+05:30	2017-03-05 02:28:19.357435+05:30	f	\N
1101	Billy's Burgers	1484399765453013923	billy-s-burgers-1491174263213	1484399773019538340	1484399780711891877	\N	1484399788169364390	1484399798227305383	10	Best bbq in Portland!	Billy@me.com	\N	www.facebook.com/billybob	\N	\N	https://commercecdn.com/1278235777548943678/dd19bbaf-5eeb-4c10-a752-f04c72268236.jpeg	https://commercecdn.com/1278235777548943678/f6183bfc-1409-4ee5-8bc1-ca7a68e93e56.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	123 1st ave	\N	\N	\N	2	\N	Cheeseburgers, pizza	\N	\N	11240	t	\N	2017-04-03 04:34:27.326878+05:30	2017-04-03 04:34:27.326878+05:30	f	\N
1110	Paco's Tacos	1491952453145329901	paco-s-tacos-1492074613789	1491952461559103726	1491952469477949679	\N	1491952477572956400	1491952487672840433	10	The best assortment of Mexican food you will find!	streetfoodez@sumup.com	555-Taco	www.facebook.com/pacostacos	\N	\N	https://commercecdn.com/1278235777548943678/6aae55a7-4f5d-4b7d-aeb1-ce231b8519ff.jpeg	https://commercecdn.com/1278235777548943678/a77107fd-3ebd-4aea-921d-7bd26ad9ede9.jpeg	10:00 AM-9:00 PM	0,1,2,3,4	123 taco lane	\N	\N	\N	1	\N	Tacos, Enchiladas, Carne Asada	\N	\N	11293	t	\N	2017-04-13 14:40:18.052114+05:30	2017-04-13 14:40:18.052114+05:30	f	\N
1006	Moes Pizza	1441305766198772495	moes-pizza-1486037058170	1441305773295534864	1463320397347816156	\N	1441305780476183313	1441305790123082514	1.6	Pan pizza, buffalo wings, garlic chicken specials	Mo@totino.com	\N	www.facebook.com/Moespizza	\N	\N	https://commercecdn.com/1278235777548943678/2f70d68d-01c6-4522-bac7-6113f4627035.jpeg	https://commercecdn.com/1278235777548943678/703961d4-b2a2-4885-91bd-0b55a6785f38.jpeg	10 am - 8 pm		\N	\N	\N	\N	1	\N	pizza, lasagna, pasta	\N	\N	11020	t	5	2017-02-02 22:34:21.21+05:30	2017-03-05 02:33:45.558819+05:30	f	\N
1091	Konfusion	1477040512786497724	konfusion-1490296971930	1477040520797618365	1477040528833904830	\N	1477040536735973567	1477040546768748736	1.6	Best Asian Fusion in Natal!	Jimmy@konfusion.com	555-8888	www.facebook.com/Konfusion	\N	\N	https://commercecdn.com/1278235777548943678/7b10d7fd-b3cd-4394-b482-63bd771d9dc7.jpeg	https://commercecdn.com/1278235777548943678/ce2b956f-a1a2-45df-92c6-5d210ccbe2a4.jpeg	\N	\N	123 Confused Ln	\N	\N	\N	1	\N	Asian Fusion, Pad Thai	\N	\N	11220	t	\N	2017-03-24 00:52:56.205119+05:30	2017-03-24 00:52:56.205119+05:30	f	1
1099	dfsdf	1483565024885605217	dfsdf-1491074754374	1483565032603124578	1483565040429695843	\N	1483565048004608868	1483565057936720741	10	\N	dfdsf@gmail.com	\N	\N	\N	\N	\N	\N	11:00 AM-8:00 PM	0	\N	\N	\N	\N	1	\N	\N	\N	\N	11236	t	\N	2017-04-02 00:55:58.634203+05:30	2017-04-02 00:55:58.634203+05:30	f	1
1096	Bob's bbq	1480661310474551374	bob-s-bbq-1490728604646	1480661318368231503	1480661326656176208	\N	1480661334667296849	1480661344700072018	10	Best bbq in town!	Bob@bbq.com	55 84 7534 3434	www.facebook.com/bobsbbq	\N	\N	https://commercecdn.com/1278235777548943678/20a2a239-84ab-42d2-89a0-8c61bfb69f3b.jpeg	https://commercecdn.com/1278235777548943678/b638ae6a-781f-478b-8594-139fab967d98.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	123 prudente	\N	\N	\N	1	\N	bbq, sandwiches	\N	\N	11231	t	\N	2017-03-29 00:46:48.916424+05:30	2017-03-29 00:46:48.916424+05:30	f	2
1098	Dummy	1483533384364852056	dummy-1491070982562	1483533392401138521	1483533400303207258	\N	1483533407953617755	1483533418179330908	10	dumb dumb dumb	Dummy@me.com	\N	www.facebook.com/dumb	\N	\N	\N	\N	11:00 AM-9:00 PM	0,1,2,3,4	123 dumb	\N	\N	\N	1	\N	pizza	\N	\N	11234	t	\N	2017-04-01 23:53:06.780152+05:30	2017-04-01 23:53:06.780152+05:30	f	2
1104	Den's Food Truck	1485652576048251274	den-s-food-truck-1491323609849	1485652584092926347	1485652600442323340	\N	1485652608294060429	1485652618662379918	10	Best food in Natal!!!	Gen1Living@gmail.com	\N	\N	\N	\N	https://commercecdn.com/1278235777548943678/54a4873e-234a-4eca-abd8-04b5d1e0b0ee.jpeg	https://commercecdn.com/1278235777548943678/796e3a11-65a9-49e6-9d5e-119a7f0dc6fa.jpeg	11:00 AM-4:00 PM	0,1,2,3,4,5	\N	\N	\N	\N	1	\N	Food	\N	\N	11246	t	\N	2017-04-04 22:03:35.127092+05:30	2017-04-04 22:03:35.127092+05:30	f	\N
1092	Thaitanic Xpress	1477660013685113221	thaitanic-xpress-1490370822183	1477660021780119942	1477660029933846919	1479305500104327793	1477660037374542216	1477660047742861705	9	best asian fusion in town!	streetfoodez@sumup.com	555-8888	www.facebook.com/thaitanicxpress	\N	\N	https://commercecdn.com/1278235777548943678/7c617dfe-8299-42d2-91d4-dd17368b07f5.jpeg	https://commercecdn.com/1278235777548943678/c310f106-bdf0-4391-a607-1282e82029ca.jpeg	11:00 AM-8:00 PM	0,1,2,3,4	123 Ho Chi Min Ln	\N	\N	\N	1	\N	asian fusion, thai	\N	\N	11223	t	\N	2017-03-24 21:23:46.434461+05:30	2017-03-24 21:23:46.434461+05:30	f	\N
1102	Mama's got SOUL	1485515543640277206	mama-s-got-soul-1491307274362	1485515551416516823	1485515559209533656	\N	1485515567061270745	1485515576825610458	10	\N	dnick66@gmail.com	\N	\N	\N	\N	commercecdn.com/1278235777548943678/836e86a4-85f6-4a16-9c49-0342cefca42b.jpeg	commercecdn.com/1278235777548943678/3c7ee2c9-73bc-400a-90a6-97549aea3478.jpeg	\N	\N	\N	\N	\N	\N	1	\N	Fried chicken, soul food, greens	\N	\N	11242	t	\N	2017-04-04 17:31:18.527117+05:30	2017-04-04 17:31:18.527117+05:30	f	\N
1103	Gen 1 Living	1485522640989847773	gen-1-living-1491308120431	1485522649026134238	1485522656953368799	\N	1485522664805105888	1485522675123093729	9	organic veggies for your delight	Dennis@streetfoodEZ.com	\N	\N	\N	\N	\N	https://commercecdn.com/1278235777548943678/9b576ec5-c6f1-4a65-ae9d-389f856dc3f6.jpeg	11:00 AM-3:00 PM	1,2,3,4	\N	\N	\N	\N	1	\N	whole organic veggies	\N	\N	11244	t	\N	2017-04-04 17:45:24.693776+05:30	2017-04-04 17:45:24.693776+05:30	f	\N
1106	tmr007	1489911623240909662	tmr007-1491831327808	1489911631352693599	1489911639623861088	\N	1489911648012469089	1489911658498229090	10	\N	testmngr@tester.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11282	t	\N	2017-04-10 19:05:32.21389+05:30	2017-04-10 19:05:32.21389+05:30	f	\N
1107	sam123	1489912624018621283	sam123-1491831447107	1489912631996187492	1489912647036961637	\N	1489912655509455718	1489912665768723303	10	\N	sam@grant.vom	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11283	t	\N	2017-04-10 19:07:32.284468+05:30	2017-04-10 19:07:32.284468+05:30	f	\N
1108	sfez01	1489916589800162152	sfez01-1491831919886	1489916597660287849	1489916606468326250	\N	1489916614420726635	1489916624403170156	10	\N	test5@sfez.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11285	t	\N	2017-04-10 19:15:24.387771+05:30	2017-04-10 19:15:24.387771+05:30	f	\N
1109	Crazy Jack's	1491314112741769362	crazy-jack-s-1491998517618	1491314123277861011	1491314132731822228	1491334549076967599	1491314140935880853	1491314155003576470	9	Food is always tastier when it has a little "crazy" added to it!	Crazy@crazysubs.com	1-800-Crazy	www.facebook.com/crazyjacksubs	\N	\N	https://commercecdn.com/1278235777548943678/c2e0e237-2648-47e1-aee1-5993d3a32139.jpeg	https://commercecdn.com/1278235777548943678/fe5da931-22e0-4b84-80a2-b38637592de1.jpeg	11:30 AM-10:00 PM	0,1,2,3,4	123 Crazy Lane	\N	\N	\N	1	\N	Subs, Sandwiches, Soup	\N	\N	11286	t	\N	2017-04-12 17:32:02.959033+05:30	2017-04-12 17:32:02.959033+05:30	f	\N
1105	Might Joe's	1488546329985548845	might-joe-s-1491668572190	1488546337803731502	1488546346544661039	\N	1488546354840994352	1488546368271155761	10	Marinated carne asada and smoked pork tacos!	streetfoodez@sumup.com	888-5555	www.facebook.com/mightyjoes	\N	\N	https://commercecdn.com/1278235777548943678/be83a820-b60f-441a-9178-e7a1eb212cd0.jpeg	https://commercecdn.com/1278235777548943678/d9c70c24-7d63-4391-a374-e4c66589444f.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	123 Mighty lane	\N	\N	\N	1	\N	Tacos, Enchiladas, Burritos	\N	\N	11270	t	\N	2017-04-08 21:52:56.958871+05:30	2017-04-08 21:52:56.958871+05:30	f	\N
1115	Churros Factory	1511812077138739683	churros-factory-1494442065438	1511812085779005924	1511812094285054437	\N	1511812102849823206	1511812113478189543	10	Nutella, jam, Belgium chocolate, sprinkles and a wide assortment of other toppings	Churros@me.com	\N	www.facebook.com/churrosmadness	\N	\N	https://commercecdn.com/1278235777548943678/69623b6f-86f2-4e60-b099-ab8f04df4dc1.jpeg	https://commercecdn.com/1278235777548943678/353ef2f4-7438-4497-9036-f0180932c2c8.jpeg	11:00 AM-8:00 PM	\N	Churro Lane	\N	\N	\N	1	\N	Churros, Pastries, Donuts	\N	\N	11315	t	\N	2017-05-11 00:17:49.97301+05:30	2017-05-11 00:17:49.97301+05:30	f	\N
1116	Fan Zone	1511850604689883662	fan-zone-1494446658266	1511850612977828367	1511850621542597136	\N	1511850629931205137	1511850640660234770	10	Everything a fan could ever want:  T-Shirts, Hats, Jerseys, Raffles, Food, Beer, All Access Pass	Boss@fanzone.com	\N	www.facebook.com/fanzonemania	\N	\N	https://commercecdn.com/1278235777548943678/f04e03e7-9856-47d4-aba3-ba281867ac5e.png	https://commercecdn.com/1278235777548943678/cbcda760-2e36-434b-b932-2a685731fdde.jpeg	12:00 PM-10:00 PM	\N	Fan ave	\N	\N	\N	1	\N	Jerseys, Fan Merchandise, Programs	\N	\N	11317	t	\N	2017-05-11 01:34:22.770244+05:30	2017-05-11 01:34:22.770244+05:30	f	\N
1117	Fritanga Fred	1511877969553916445	fritanga-fred-1494449920416	1511877978034799134	1511877986314355231	\N	1511877994753294880	1511878005624930849	10	Served with arepas, manioc or plantain, this is a plate full of grilled meat such as chicken or beef with aji sauce!	fred@fritanga.com	\N	www.facebook.com/fritangafred	\N	\N	https://commercecdn.com/1278235777548943678/06913d2d-cdc9-4f6d-aacc-b72c1e3395d1.png	https://commercecdn.com/1278235777548943678/cec8b925-3ce3-4eea-9b4b-1962f651bc86.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	Fritanga Lane	\N	\N	\N	1	\N	Fritanga, Lechona, Arepa	\N	\N	11319	t	\N	2017-05-11 02:28:44.929239+05:30	2017-05-11 02:28:44.929239+05:30	f	\N
1118	Ticket Master	1511881637934137890	ticket-master-1494450357736	1511881646331134499	1511881654342255140	\N	1511881662848303653	1511881673736716838	11	Buy tickets for any sporting event, concert, festival you want!	Ron@ticketmaster.com	\N	www.facebook.com/ticketmaster	\N	\N	https://commercecdn.com/1278235777548943678/15e77c49-f695-414a-92b7-73b6f3552e5d.jpeg	https://commercecdn.com/1278235777548943678/4091a037-93c8-4452-8193-9bb1725ffbf6.png	11:00 AM-9:00 PM	\N	123 Ticket	\N	\N	\N	1	\N	tickets, venues, events	\N	\N	11321	t	\N	2017-05-11 02:36:02.215922+05:30	2017-05-11 02:36:02.215922+05:30	f	\N
1112	Soul Man	1500229375184863794	soul-man-1493061299752	1500229386131997235	1500229394688377396	\N	1500229411717251637	1500229422957986358	10	Todos comida do America sul com SOUL!  BBQ é a nossa especialidade!!!	streetfoodez@sumup.com	(84) 99919-0001	\N	\N	\N	https://commercecdn.com/1278235777548943678/33e47d69-b706-4ef3-a632-6e3505fab928.jpeg	https://commercecdn.com/1278235777548943678/c3c01cd7-4cd9-4bf6-ba13-85a464973527.jpeg	6:00 PM-10:30 PM	2,3,4,5	\N	\N	\N	\N	1	\N	Soul food.  Todos comida do America sul!	\N	\N	11301	t	\N	2017-04-25 00:45:05.708298+05:30	2017-04-25 00:45:05.708298+05:30	f	2
1120	Sabor Brasil	1512449852485665365	sabor-brasil-1494518094168	1512449860547117654	1512449869137052247	\N	1512449877206893144	1512449888422462041	10	\N	luiz@saborbrasil.com.br	(84) 9999-9999	\N	\N	\N	https://commercecdn.com/1278235777548943678/27c6f45d-2a54-47fb-a233-10972d2a949a.png	https://commercecdn.com/1278235777548943678/6b083cf3-2b54-4961-8bf8-f091ba0ea855.png	11:00 AM-8:00 PM	\N	Rua	\N	\N	\N	1	\N	\N	\N	\N	11325	t	\N	2017-05-11 21:24:58.651251+05:30	2017-05-11 21:24:58.651251+05:30	f	\N
1119	sfeztom5	1511965396758954556	sfeztom5-1494460342534	1511965405013344829	1511965413569724990	\N	1511965422352597567	1511965437301097024	10	A test vendor	t@b.cd	\N	test.fakedomain	\N	\N	https://commercecdn.com/1278235777548943678/b4ce059b-f29d-4a5c-ab83-6343f8f2c041.png	https://commercecdn.com/1278235777548943678/7d284648-1971-44c2-824e-c49249ecc20d.png	11:00 AM-8:00 PM	1,2,3	\N	\N	\N	\N	1	\N	test	\N	\N	11323	f	\N	2017-05-11 05:22:27.66898+05:30	2017-05-11 05:22:27.66898+05:30	f	\N
1094	Classy Cuban	1479426030098711188	classy-cuban-1490581347750	1479426037740733077	1479426045449863830	1497995126587261030	1479426053435818647	1479426063325987480	7	Manny's secret cuban recipe!	streetfoodez@sumup.com	555-7878	www.facebook.com/classycuban	\N	\N	https://commercecdn.com/1278235777548943678/fe7ae581-d6a9-4d14-86a3-aef5e12e989e.jpeg	https://commercecdn.com/1278235777548943678/ddb53e6f-62aa-4a47-bfef-b912f1fd93a6.jpeg	11:00 AM-9:00 PM	0,1,2,3,4	123 Cuban dr	\N	\N	\N	1	\N	Cuban, Paninis	\N	\N	11227	t	\N	2017-03-27 07:52:31.905003+05:30	2017-03-27 07:52:31.905003+05:30	f	\N
1005	Crazy Jacks	1440710633996681868	crazy-jacks-1485966112929	1440710643157041805	1463319152025404122	\N	1440710650237026958	1440710659665822351	1.6	Homemade subs "Crazy Jack" style	Streetfoodez@hotmail.com	\N	www.facebook.com/crazyjacks	\N	\N	https://commercecdn.com/1278235777548943678/8c75231e-33eb-4823-93e0-42093f79d98f.jpeg	https://commercecdn.com/1278235777548943678/ddcc397f-c3eb-4de2-babc-9a544ac5da9b.jpeg	10 am - 5 pm		\N	\N	\N	\N	2	\N	subs, burgers, bbq	\N	\N	11017	t	5	2017-02-02 02:51:56.123+05:30	2017-03-05 02:31:14.476317+05:30	f	\N
1088	Chunky Monkey	1445663478260957711	chunky-monkey-1486556537929	1445663485726818832	1463319636031308507	1465189269227176025	1445663493511447057	1445663503426781714	13	Best hot fudge sundaes in town	streetfoodez@sumup.com	212	www.facebook.com/chunkymonkey1	\N	\N	https://commercecdn.com/1278235777548943678/462a01bc-583c-4892-9144-a117ca406783.png	https://commercecdn.com/1278235777548943678/0ad8cddc-28c8-4ca5-b70c-77296672ccd6.jpeg	11:00 AM-8:00 PM	0,1,2,3,4	123 Chunky	\N	\N	\N	1	\N	bananas, ice cream	\N	\N	11192	t	\N	2017-02-08 17:52:21.119+05:30	2017-03-05 02:32:08.923872+05:30	f	1
1100	test2	1483587720071611253	test2-1491077459842	1483587733870871414	1483587742007821175	\N	1483587750002164600	1483587760915743609	10	\N	jon.kazarian@gmail.com	\N	\N	\N	\N	https://commercecdn.com/1278235777548943678/dee5d9d7-8251-42e3-b114-2e750b9b0837.jpeg	\N	11:00 AM-8:59 AM	2,3	\N	\N	\N	\N	1	\N	#pizza	\N	\N	11238	t	\N	2017-04-02 01:41:04.905197+05:30	2017-04-02 01:41:04.905197+05:30	f	1
1113	lupk	1505143118813463378	lupk-1493647063572	1505143126908470099	1505143135691342676	\N	1505143144163836757	1505143154683151190	10	\N	louepark@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11310	t	\N	2017-05-01 19:27:48.040243+05:30	2017-05-01 19:27:48.040243+05:30	f	1
1114	Jose's Empanadas	1511779114413982166	jose-s-empanadas-1494438135941	1511779122559320535	1511779131568685528	\N	1511779140175397337	1511779150745043418	10	Stuffed bread, carne, cheddar cheese, huitlacoche and more!	Jose@empanada.com	\N	www.facebook.com/empanadaexpress	\N	\N	https://commercecdn.com/1278235777548943678/05d67253-d79e-4036-8235-41f7e13fb189.jpeg	https://commercecdn.com/1278235777548943678/dceaf21f-1a4f-4916-a077-ee57bdee104e.jpeg	11:00 AM-9:00 PM	0,1,2	\N	\N	\N	\N	1	\N	Empanadas, Tacos, Burritos	\N	\N	11313	t	\N	2017-05-10 23:12:20.474558+05:30	2017-05-10 23:12:20.474558+05:30	f	2
1121	Sabor Brasileiro	1512617656748868248	sabor-brasileiro-1494538098008	1512617665598849689	1512617674004234906	\N	1512617682082464411	1512617692593390236	10	Aqui nós temos a mais típica feijoada brasileira e os mais variados pratos tradicionais de todas as regiões do Brasil.	luiz@saborbrasileiro.com.br	(84) 99999-9999	facebook.com/saborbrasileiro	\N	\N	https://commercecdn.com/1278235777548943678/80c61edd-09b7-40d6-a340-399dc6534eb1.jpeg	https://commercecdn.com/1278235777548943678/b2203621-5caa-482e-b308-b64a932066a6.jpeg	10:00 AM-10:00 PM	1,2,3,4,5,6	Rua Brasil, 123	\N	\N	\N	1	\N	Feijoada, caipirinha, açaí	\N	\N	11327	t	\N	2017-05-12 02:58:22.483634+05:30	2017-05-12 02:58:22.483634+05:30	f	2
1111	rajanramani	1492011507074990336	rajanramani-1492081653535	1492011514700235009	1492011522610692354	\N	1492011530504372483	1492011540579090692	10	\N	rajan.rajan977@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	\N	\N	\N	\N	11295	t	\N	2017-04-13 16:37:37.725477+05:30	2017-04-13 16:37:37.725477+05:30	f	2
\.


--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: sfez_rw
--

COPY public.contracts (id, company_id, unit_id, customer_id, offer_id, request_name, request_photo, cash_offer, buy_back_amount, tax_amount, term_months, qr_code, offer_approved, status, is_deleted) FROM stdin;
1	1	1	9001	1	Test Postman 2 BY Rahul	http://en.freejpg.com.ar/asset/900/ba/baaa/F100011052.jpg	103.1200	210.3400	20.2100	3	Qr Code Test	t	t	f
2	1	1	9001	3	Test Postman	http://en.freejpg.com.ar/asset/900/ba/baaa/F100011052.jpg	123.5600	0.0000	0.0000	6	Qr Code Test	t	t	f
3	1001	1	9001	5	Contract For Iphone 8	http://en.freejpg.com.ar/asset/400/ba/baaa/F100011052.jpg	1020.0000	1200.0000	125.0000	4	958565028790101	t	t	f
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, name, is_enabled, tax_band, moltin_client_id, moltin_client_secret, currency_id, currency) FROM stdin;
1	Brazil	t	1427064502431515521	\N	\N	1435543251393183865	BRL
2	USA	f	1427064502431515521	\N	\N	1435543251393183865	USD
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.customers (id, order_sys_id, description, apns_id, gcm_id, device_type, fcm_id, phone, facebook, twitter, photo, power_reviewer, city, state, country, user_id, created_at, updated_at) FROM stdin;
9001	\N	Taco expert. I love tacos.	\N	APA91bECFEhmamkhENoB_sn2N20T0KX8HqF5XxzBG1PseAuJJ9VdoRkkl0sZXtsLosSHCi2oSo01t63XOzRHxTEOLqYtwOF0mF2m0GaCCyE-Op1uVkMuvC-rgoqh1A0rA80OIMgVxkeE	\N	\N	\N	www.facebook.com/stacytfakeaccount	\N	\N	f	\N	\N	\N	11001	2016-08-22 05:01:43.151356+05:30	2017-02-01 05:02:49.180085+05:30
9003	\N	Food bloggers. Follow us on mifood.blog.com	\N	APA91bEYSDTsHDYPmL0cGRi6xJfj0hAqyvVJTzsJbp8ZTydmcBhkebSyq32CW_6gcNRNelck-wv0ffA2lUcSLo9yw6iUvCaXSfaGasP_MjbeFnzLJDJRLJ8VKtOiX9lUyqVr6lyg8OC-	\N	\N	\N	www.facebook.com/mifoodfakeaccount	\N	\N	t	\N	\N	\N	11003	2016-08-22 05:01:43.151356+05:30	2017-02-02 14:57:57.482063+05:30
9002	\N	Serial food eater	\N	APA91bEYSDTsHDYPmL0cGRi6xJfj0hAqyvVJTzsJbp8ZTydmcBhkebSyq32CW_6gcNRNelck-wv0ffA2lUcSLo9yw6iUvCaXSfaGasP_MjbeFnzLJDJRLJ8VKtOiX9lUyqVr6lyg8OC-	\N	\N	\N	www.facebook.com/jonjonesfakeaccount	\N	\N	f	\N	\N	\N	11002	2016-08-22 05:01:43.151356+05:30	2017-02-03 15:04:40.840539+05:30
9006	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11165	2017-02-06 11:14:09.344202+05:30	2017-02-06 11:14:09.344202+05:30
9005	\N	described	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11068	2017-02-04 00:37:56.716851+05:30	2017-02-07 15:57:20.11839+05:30
9007	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11190	2017-02-08 07:07:49.214166+05:30	2017-02-08 07:07:49.214166+05:30
9011	\N	\N	\N	xxx	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11216	2017-03-07 01:08:15.621436+05:30	2017-04-16 20:23:09.015135+05:30
9012	\N	\N	\N	xxx	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11251	2017-04-05 19:44:22.995933+05:30	2017-04-16 20:25:09.926567+05:30
9013	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11263	2017-04-08 15:59:29.080876+05:30	2017-04-08 15:59:29.080876+05:30
9015	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11281	2017-04-10 17:10:43.103515+05:30	2017-04-10 17:10:43.103515+05:30
9023	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11307	2017-05-01 18:47:50.16449+05:30	2017-05-01 18:47:50.16449+05:30
9024	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11308	2017-05-01 18:51:57.114415+05:30	2017-05-01 18:51:57.114415+05:30
9016	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11284	2017-04-10 19:13:53.454978+05:30	2017-04-10 19:13:53.454978+05:30
9025	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11309	2017-05-01 19:05:44.958728+05:30	2017-05-01 19:05:44.958728+05:30
9008	\N	\N	\N	APA91bH7WifZxUseIbwBdwzzel4UctsTIGW8pov1nlfGa3HCfBDAsybdeek5WKLHRtEIS3mFohw4uHZMvMOOn6-nSy6ZX4PUXh5AQ67v2O4x3jZxUv9gZw4	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11194	2017-03-05 08:59:11.880554+05:30	2017-05-01 19:56:11.772262+05:30
9022	\N	\N	\N	APA91bHt8QbO-9doM6KZB51Xr_LbkklYMv9ovyC3N5nG1hJ3_pbENeTx9qZExpOMySOzrcuczPTzw4wcctprKrfmWHOV-3jThRlbAjpT0n6o3gY9uk-TZpg	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11306	2017-04-30 19:54:27.61583+05:30	2017-05-01 20:23:58.497495+05:30
9014	\N	\N	\N	APA91bHNSKh9u9ZDAs3J23dgsQTg78l8ZVGU7ubgg9AAQoBY_KTIGEKzpIBhb8uUJCFqjIxo8p5D99rqMwLV8pRs4mjxRq6VmyLHgiQ9oH-vUHcbhAL5BT98O-BYNgIzCeJq4fIwZp5i	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11273	2017-04-09 05:05:01.736191+05:30	2017-04-09 05:12:25.503419+05:30
9021	\N	\N	\N	APA91bHt8QbO-9doM6KZB51Xr_LbkklYMv9ovyC3N5nG1hJ3_pbENeTx9qZExpOMySOzrcuczPTzw4wcctprKrfmWHOV-3jThRlbAjpT0n6o3gY9uk-TZpg	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11305	2017-04-27 21:28:32.298735+05:30	2017-04-27 21:35:26.709849+05:30
9018	\N	\N	\N	APA91bFx-HIan2wg3LjYExbQ3ps_c6JoH0LF6k_bYXiNj8AwUTnM2oEYBpMTrAyd1k6iRK_OTb895JPyz76zW0drN-YBRKCEpU0vCp63x9WGIL2P8xCcCJ4	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11298	2017-04-16 20:24:44.290195+05:30	2017-04-26 04:15:10.076274+05:30
9019	\N	\N	\N	APA91bFxJUtaqrIXVpO5WmQVTgR_4KTZYgy2_h-MrNNmYsYIfrM8bPApQN0X_-kLM070iXvVWHCNeK6D_J9YeTc7DwStwFr_i2l2AtEEgc_kIw_goV11Uuw	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11299	2017-04-17 00:47:03.960969+05:30	2017-05-01 20:38:26.096504+05:30
9026	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11311	2017-05-01 20:42:37.605741+05:30	2017-05-01 20:42:37.605741+05:30
9017	\N	\N	\N	APA91bEpCKe86Ekh1Okw2tOIc6us4w-iM2qKYrzXNMineh3QTisLX-u8lqBG6rsfADBZBHybeb3jdOkjLOpjh07-zIDqa0SBnfLvjRBzDE8YkqZK8rWxzp8	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11288	2017-04-12 18:55:25.767636+05:30	2017-04-12 18:58:57.277413+05:30
9009	\N	\N	\N	APA91bFxJUtaqrIXVpO5WmQVTgR_4KTZYgy2_h-MrNNmYsYIfrM8bPApQN0X_-kLM070iXvVWHCNeK6D_J9YeTc7DwStwFr_i2l2AtEEgc_kIw_goV11Uuw	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11195	2017-03-05 08:59:28.329475+05:30	2017-05-01 20:51:05.349319+05:30
9027	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11312	2017-05-01 21:02:06.531403+05:30	2017-05-01 21:02:06.531403+05:30
9020	\N	\N	\N	APA91bG3q71WUOuK06XcUDiWTYK1bBJU7GSMv4VC8bxugs5Y-sRVOryb_KG-92mbwci8szGJOQTIUwMWm6Njn_BYK-aN1CDBl1CalcLdh-nWUt6N8YBbQBo	\N	\N	\N	\N	\N	\N	f	\N	\N	\N	11300	2017-04-24 22:30:57.101988+05:30	2017-04-27 01:32:20.966104+05:30
\.


--
-- Data for Name: delivery_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_addresses (id, nickname, address1, address2, city, state, phone, customer_id, created_at, updated_at) FROM stdin;
1	Verano Condominium	Rua da Campina 140	Apt 2203	Natal	RN	Mary / 555-9988	9008	2017-03-23 09:19:22.506958+05:30	2017-03-23 09:19:22.506958+05:30
3	Tango	123 Drummond St	Apt 2000	Natal	RN	Cliff / 444-3636	9008	2017-03-24 16:35:21.741028+05:30	2017-03-24 16:35:21.741028+05:30
4	Fvb	Fhh	Fhb	\N	\N	4558	9008	2017-03-24 18:11:00.186294+05:30	2017-03-24 18:11:00.186294+05:30
5	Test Location	304 Princess Park	AB Road,  Indore	\N	\N	9893479705	9008	2017-03-24 18:37:06.615521+05:30	2017-03-24 18:37:06.615521+05:30
7	Oak Pine Estate	123 Prudente	Apt 2000	Natal	RN	Bob / 444-3636	9009	2017-03-31 02:49:11.040794+05:30	2017-03-31 02:49:11.040794+05:30
8	Nordestao	Av. Engenheiro Roberto Freire, 2895	null	Natal	RN	Jim / 444-3636	9009	2017-03-31 02:50:25.962401+05:30	2017-03-31 02:50:25.962401+05:30
9	Natal Shopping	Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900	null	Natal	RN	999-5555	9008	2017-04-02 00:23:50.554505+05:30	2017-04-02 00:23:50.554505+05:30
10	Car Dealership	Avenida Mal Rondon, 3490 Candelária	Apt 760	Natal	RN	Stacy / 555-9988	9008	2017-04-04 20:07:15.967597+05:30	2017-04-04 20:07:15.967597+05:30
11	Subway	Av. Prudente de Morais, 5950 - Candelária, Natal - RN	\N	Natal	RN	Bob / 555-9988	9009	2017-04-05 23:46:53.224377+05:30	2017-04-05 23:46:53.224377+05:30
12	Ashley	17 Gyaneshwar	Ind	\N	\N	546538497	9008	2017-04-07 17:01:39.366317+05:30	2017-04-07 17:01:39.366317+05:30
13	Sam	345 Baker Streets	Gsj	\N	\N	564846345	9008	2017-04-07 17:15:04.385616+05:30	2017-04-07 17:15:04.385616+05:30
2	Camarões	Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000	Apt 67	Natal	RN	Bob / 555-9988	9008	2017-03-24 08:27:01.059108+05:30	2017-04-09 04:53:46.122426+05:30
14	Home	Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000	\N	Natal	RN	Marcy / 555-9988	9018	2017-04-16 20:34:11.34083+05:30	2017-04-16 20:34:11.34083+05:30
15	Test Locations	304, Princess Business Park	Indore	\N	\N	465329458	9019	2017-04-20 11:24:04.182109+05:30	2017-04-20 11:24:04.182109+05:30
16	New Field Test	This Is Address 1	This Is Address 2	This Is City	\N	123487978	9008	2017-04-20 13:24:44.990482+05:30	2017-04-20 13:24:44.990482+05:30
6	Ponta Negra Fiat	Av. Engenheiro Roberto Freire, 701	Apt 2009	Natal-RN, 59078-600	\N	Bob / 444-3636	9009	2017-03-29 00:36:58.528723+05:30	2017-04-21 01:44:53.525733+05:30
17	Teste	Testando	100	Natal	\N	84999999999	9022	2017-05-01 20:27:09.642253+05:30	2017-05-01 20:27:09.642253+05:30
\.


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (id, name, phone, available, unit_id, company_id, created_at, updated_at, user_id, is_deleted) FROM stdin;
5	Steve	558491239871	t	2096	1094	2017-03-29 00:01:22.861602+05:30	2017-04-17 00:41:28.890387+05:30	\N	f
1	Bobby	5584 5934 9812	t	2089	1088	2017-03-22 17:59:14.606154+05:30	2017-04-19 14:29:26.738372+05:30	\N	f
4	Yogi	1234567890	t	2089	1088	2017-03-28 14:50:29.217635+05:30	2017-04-19 14:29:27.635895+05:30	\N	f
3	Tom	5584 8153 8041	t	2089	1088	2017-03-25 18:33:55.984311+05:30	2017-04-19 14:29:28.203884+05:30	\N	f
7	yogi 2	2322323	f	2089	1088	2017-03-29 18:31:51.068468+05:30	2017-04-19 14:29:28.656081+05:30	\N	f
23	Shelly	444-7777	t	2094	1092	2017-04-07 17:50:40.585595+05:30	2017-04-07 17:50:43.909736+05:30	\N	f
26	Cliff	558491239871	t	2097	1095	2017-04-25 00:25:16.178006+05:30	2017-04-25 00:25:16.178006+05:30	\N	f
27	Larry	558490458822	t	2097	1095	2017-04-25 00:25:37.865066+05:30	2017-04-25 00:25:37.865066+05:30	\N	f
33	Herbert	333-7777	t	2136	1112	2017-04-25 17:16:04.178782+05:30	2017-04-25 17:16:14.488655+05:30	\N	f
34	Betsy	555-8888	t	2136	1112	2017-04-25 17:17:21.19242+05:30	2017-04-25 17:27:19.584371+05:30	\N	f
36	Dennis	555-9999	f	2138	1112	2017-04-25 17:45:18.749654+05:30	2017-04-25 17:45:18.749654+05:30	\N	f
37	steve	1356-4658	f	2138	1112	2017-04-25 18:37:33.772298+05:30	2017-04-25 18:37:33.772298+05:30	\N	f
38	Pepe	1325-4658	f	2136	1112	2017-04-25 18:42:36.848771+05:30	2017-04-25 18:42:36.848771+05:30	\N	f
24	Clff	555-9999	t	2133	1110	2017-04-15 16:46:08.561746+05:30	2017-04-15 16:51:21.429029+05:30	\N	f
25	Larry	666-9999	t	2133	1110	2017-04-15 16:46:24.142581+05:30	2017-04-15 16:51:22.304931+05:30	\N	f
35	Cliff	777-9999	t	2136	1112	2017-04-25 17:25:24.352582+05:30	2017-04-25 23:37:04.62942+05:30	\N	f
21	Cindy	558420449053	f	2096	1094	2017-03-30 16:42:58.537968+05:30	2017-04-26 04:42:01.604019+05:30	\N	f
6	Jimmy	558491238833	t	2096	1094	2017-03-29 00:01:53.27384+05:30	2017-04-26 05:28:23.96664+05:30	\N	f
9	John	558490236588	f	2096	1094	2017-03-30 05:59:59.452628+05:30	2017-04-26 05:28:25.432057+05:30	\N	f
22	Jim	666-8888	t	2094	1092	2017-04-07 17:50:28.289077+05:30	2017-04-27 22:35:37.725807+05:30	\N	f
\.


--
-- Data for Name: drivers_foodpark; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers_foodpark (available, food_park_id, user_id) FROM stdin;
\.


--
-- Data for Name: event_guests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_guests (guest, event) FROM stdin;
\.


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (id, name, ticketed, start_date, end_date, schedule, manager, social_media, latitude, longitude, image, sponsors) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (customer_id, unit_id, company_id, created_at) FROM stdin;
\.


--
-- Data for Name: food_park_management; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.food_park_management (id, food_park_id, unit_id) FROM stdin;
\.


--
-- Data for Name: food_parks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.food_parks (id, name, photo, territory_id, city, state, postal_code, country, latitude, longitude, created_at, updated_at, is_deleted, foodpark_mgr) FROM stdin;
3001	The Picnic	\N	4	Austin	TX	78704	US	30.2635748000000007	-97.7627071000000001	2016-08-22 05:01:43.131352+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3002	Alamo Drafthouse	\N	4	Austin	TX	78704	US	30.2560785999999986	-97.7635090999999647	2016-08-22 04:31:03.622149+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3003	Austin Food Park	\N	4	Austin	TX	78702	US	30.2544286999999983	-97.7371196999999938	2016-08-22 04:31:50.563872+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3004	Truck Garden Food Park - Av. Roberto Freire	\N	3	Ponta Negra	RN	\N	BR	-5.87437400000000043	-35.1786949999999976	2016-08-22 04:33:07.177813+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3005	Neide Artesanato/Praia Shopping Food Park - Av. Roberto Freire	\N	3	Ponta Negra	RN	\N	BR	-5.86576900000000023	-35.1858780000000024	2016-08-22 04:35:04.914807+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3006	Natal Shopping Food Park - Av. das Brancas Dunas	\N	1	Natal	RN	\N	BR	-5.84256300000000017	-35.2106240000000028	2016-08-22 04:42:10.112015+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3007	Bar 54 Food Park - Rua Porto Mirim	\N	1	Natal	RN	\N	BR	-5.87467399999999973	-35.1835140000000024	2016-08-30 02:24:42.540882+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3008	Bar Trove Food Park - Rua Presidente José Bento	\N	1	Natal	RN	\N	BR	-5.80574800000000035	-35.2147050000000021	2016-08-31 02:42:08.717913+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3009	Food By Food West	\N	4	Austin	TX	78723	US	30.2979999999999983	-97.7069999999999936	2016-08-22 05:01:43.131352+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3010	Growler Food Park	\N	5	Pflugerville	TX	78660	US	30.4490000000000016	-97.6069999999999993	2016-08-22 04:31:03.622149+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3011	Food Park at La Frontera	\N	6	Round Rock	TX	78681	US	30.4810000000000016	-97.6770000000000067	2016-08-22 04:31:50.563872+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3012	Las Palmas Food Bazaar	\N	8	Miami	FL	33136	US	25.7920000000000016	-80.195999999999998	2016-08-22 04:33:07.177813+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3013	Tropical Food Court	\N	7	Fort Lauderdale	FL	33304	US	26.1359999999999992	-80.1370000000000005	2016-08-22 04:35:04.914807+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3014	Snappy Food Park	\N	9	Coral Gables	FL	33146	US	25.7289999999999992	-80.2609999999999957	2016-08-22 04:42:10.112015+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3015	LoDo TrPk	\N	10	Denver	CO	80202	US	39.7509999999999977	-105	2016-08-30 02:24:42.540882+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3016	Del Mar	\N	11	Aurora	CO	80042	US	39.7280000000000015	-104.843999999999994	2016-08-31 02:42:08.717913+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
3017	Foothills Food Court	\N	12	Lakewood	CO	80226	US	39.7109999999999985	-105.084000000000003	2016-08-31 02:42:08.717913+05:30	2017-03-22 08:00:49.056127+05:30	f	\N
30019	Ponta Negra Beach Boardwalk	\N	3	\N	\N	\N	\N	-5.87119999999999997	-35.1799999999999997	2017-04-08 21:31:23.846383+05:30	2017-04-08 21:33:08.092697+05:30	f	\N
30020	Big 5 Sports Bar Food Park	\N	3	\N	\N	\N	\N	-5.66999999999999993	-36.2100000000000009	2017-04-09 07:57:13.714836+05:30	2017-04-09 07:57:13.714836+05:30	f	\N
\.


--
-- Data for Name: gen_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.gen_state (id, order_sys_order_id, step_name, step_status, api_call, param_string, error_info, info) FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (id, name, type, main_loc_text, secondary_loc_text, regex_seed, hitcount, territory_id, latitude, longitude, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty (id, balance, customer_id, company_id, eligible_five, eligible_ten, eligible_fifteen, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: loyalty_rewards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_rewards (id, company_id, gold_reward_item, silver_reward_item, bronze_reward_item, created_at, updated_at) FROM stdin;
1	1088	Gold	Silver	Shiny Bronze	2017-03-06 02:05:50.082+05:30	2017-03-06 02:06:07.966759+05:30
2	1008	BBQ Ribs	Creole Broil	JoJos	2017-03-06 02:08:41.192+05:30	2017-03-06 02:09:03.394083+05:30
4	1092	Shishkabob	Corn Flakes	Oatmeal	2017-03-24 23:31:07.104+05:30	2017-03-24 23:31:34.775616+05:30
3	1091				2017-03-24 02:19:04.267+05:30	2017-04-14 15:57:43.490879+05:30
\.


--
-- Data for Name: loyalty_used; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_used (id, amount_redeemed, customer_id, company_id, created_at) FROM stdin;
\.


--
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (id, request_id, request_name, company_id, pawn_poc, pawn_name, pawn_address, pawn_phone, unit_id, cash_offer, buy_back_amount, tax_amount, offer_term, offer_accepted, total_redemption, maturity_date, interest_rate, rating, distance, created_at, modified_at, is_deleted) FROM stdin;
1	1	Test Request	1005	Test Pawn Poc	Test Pawn Name	Test Pawn Address	Test Pawn Phone	1	103.1200	210.3400	20.1200	3	t	200.2100	2018-04-17 14:18:51.270486	7.4300	5.0000	21.2300	2018-04-17 14:18:51.270486	2018-04-17 14:18:51.270486	f
3	4	Test Name	1005	Test 	\N	\N	\N	1	123.5600	0.0000	0.0000	6	f	0.0000	\N	0.0000	0.0000	0.0000	2018-04-19 09:36:20.517975	2018-04-19 09:36:20.517975	f
2	1	Test Request 1	1005	Test Pawn Poc 1	Test Pawn Name	Test Pawn Address	Test Pawn Phone	1	103.1200	210.3400	20.1200	6	f	200.2100	2018-04-17 14:20:05.236397	7.4300	5.0000	21.2300	2018-04-17 14:20:05.236397	2018-04-17 14:20:05.236397	f
5	4	Rahul Offer	1005	Test 	\N	\N	\N	1	123.5600	123.5600	0.0000	6	f	143.3450	\N	0.0000	0.0000	0.0000	2018-04-19 09:43:49.739	2018-04-19 09:43:49.739	f
\.


--
-- Data for Name: order_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_history (id, order_sys_order_id, amount, initiation_time, payment_time, actual_pickup_time, desired_pickup_time, prep_notice_time, status, messages, qr_code, manual_pickup, for_delivery, desired_delivery_time, delivery_address_id, delivery_address_details, driver_id, contact, order_detail, checkin_id, customer_name, customer_id, unit_id, company_name, company_id, created_at, updated_at) FROM stdin;
716	1441827869947855089	R$11.60	\N	\N	\N	2017-02-07 01:41:56+05:30	\N	{"order_requested": "2017-03-14T01:28:30.250Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"Submariner Gargonzola": {"title": "Submariner Gargonzola", "options": [], "quantity": 1, "selections": {"Cheese": "Gargonzola"}}}	\N	Marco and Inez P	9003	2006	\N	1005	2017-02-04 19:43:35.376951+05:30	2017-02-04 19:43:35.376951+05:30
717	1442308288698909145	R$25.58	\N	\N	\N	2017-02-07 01:41:56+05:30	\N	{"order_requested": "2017-03-14T01:32:47.250Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"Thai Noodles": {"title": "Thai Noodles", "options": ["extra beef", "extra curry pork", "Extra bbq"], "quantity": 2, "selections": {}}}	\N	Marco and Inez P	9003	2006	\N	1005	2017-02-04 19:45:48.542129+05:30	2017-02-04 19:45:48.542129+05:30
718	1441814057349808367	R$25.60	\N	\N	\N	2017-02-07 01:41:56+05:30	\N	{"order_requested": "2017-03-14T01:45:12.580Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"Turkey Sub": {"title": "Turkey Sub", "options": ["Potato Salad", "Potato Chips"], "quantity": 3, "selections": {}}}	\N	Marco and Inez P	9003	2006	\N	1005	2017-02-04 19:46:18.178361+05:30	2017-02-04 19:46:18.178361+05:30
719	1441813386487660781	R$9.60	\N	\N	\N	2016-02-29 01:41:56+05:30	\N	{"order_requested": "2017-03-14T01:58:30.250Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"Turkey Sub": {"title": "Turkey Sub", "options": ["Potato Salad", "Potato Chips"], "quantity": 1, "selections": {}}}	\N	mg2 s	9005	2008	\N	1008	2017-02-04 20:01:46.803123+05:30	2017-02-04 20:01:46.803123+05:30
720	1441813321006186731	R$9.60	\N	\N	\N	2016-02-29 01:41:56+05:30	2016-02-29 01:26:56+05:30	{"order_requested": "2017-03-14T01:58:30.250Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"Turkey Sub": {"title": "Turkey Sub", "options": ["Potato Salad", "Potato Chips"], "quantity": 1, "selections": {}}}	\N	mg2 s	9005	2006	\N	1005	2017-02-06 21:32:47.579754+05:30	2017-02-06 21:32:47.579754+05:30
722	1476088289428504584	R$17.60	\N	\N	\N	2017-03-11 18:02:00+05:30	\N	{"order_paid": "2017-03-22T11:54:16.683Z", "order_ready": "2017-03-22T18:00:13.124Z", "order_cooking": "2017-03-22T17:55:56.046Z", "order_accepted": "2017-03-22T11:55:09.896Z", "order_picked_up": "2017-03-28T18:38:03.502Z", "order_requested": "2017-03-22T11:52:07.924Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476088291894755337": {"title": "Grasshopper Pie", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-22 17:22:05.750215+05:30	2017-03-29 00:08:03.388722+05:30
724	1476089217619591178	R$34.60	\N	\N	\N	2017-03-11 17:59:00+05:30	\N	{"no_show": "2017-04-03T10:22:25.149Z", "order_paid": "2017-03-22T17:55:13.426Z", "order_ready": "2017-03-22T18:07:07.828Z", "order_cooking": "2017-03-22T18:00:21.991Z", "order_accepted": "2017-03-22T17:55:06.050Z", "order_picked_up": "2017-04-03T10:22:28.631Z", "order_requested": "2017-03-22T11:56:23.506Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476089220085841931": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-22 17:26:19.839669+05:30	2017-04-03 15:52:28.538698+05:30
725	1476362853836390469	R$9.60	\N	\N	\N	2017-03-23 03:00:00+05:30	\N	{"order_accepted": "2017-04-05T08:30:00.877Z", "order_requested": "2017-03-22T21:07:46.996Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476362856210366534": {"title": "Philly Cheesesteak", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-23 02:37:44.782026+05:30	2017-04-05 14:00:07.597959+05:30
723	1476089217619591178	R$34.60	\N	\N	\N	2017-03-11 18:15:00+05:30	\N	{"order_paid": "2017-03-22T11:54:25.917Z", "order_ready": "2017-03-22T17:54:13.524Z", "order_cooking": "2017-03-22T11:58:09.373Z", "order_accepted": "2017-03-22T11:55:05.716Z", "order_picked_up": "2017-03-22T17:59:36.935Z", "order_requested": "2017-03-22T11:53:10.338Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476089220085841931": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-22 17:23:08.160838+05:30	2017-03-22 23:29:36.833456+05:30
860	1491916381426287293	R$9.60	\N	\N	\N	2017-04-14 01:00:00+05:30	\N	{"order_accepted": "2017-04-13T08:43:27.880Z", "order_requested": "2017-04-13T07:58:59.617Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491916383766708927": {"title": "Green Curry Regular", "options": [], "quantity": 1, "selections": {"Sauce": "Regular"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-13 13:28:57.287281+05:30	2017-04-13 14:13:27.772431+05:30
728	1476565900663455850	R$34.60	\N	\N	\N	2017-03-12 00:00:51+05:30	\N	{"order_paid": "2017-03-24T03:04:24.049Z", "order_ready": "2017-03-24T10:14:34.149Z", "order_accepted": "2017-03-24T03:01:09.367Z", "order_picked_up": "2017-03-24T10:14:33.286Z", "order_requested": "2017-03-23T03:49:36.747Z"}	\N	\N	f	t	\N	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203"}	\N	\N	{"1476565903012266091": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-23 09:19:35.754644+05:30	2017-03-24 15:44:34.066027+05:30
721	1475992618981655114	R$9.60	\N	\N	\N	2017-03-22 23:10:00+05:30	\N	{"order_paid": "2017-03-22T08:43:32.727Z", "order_ready": "2017-03-22T08:57:21.950Z", "order_cooking": "2017-03-22T08:57:14.264Z", "order_accepted": "2017-03-22T08:43:26.736Z", "order_picked_up": "2017-03-22T08:57:30.840Z", "order_requested": "2017-03-22T08:41:05.370Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1475992621238190667": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-22 14:11:03.284365+05:30	2017-03-22 14:27:30.755053+05:30
727	1476519805077946463	R$17.60	\N	\N	\N	2017-03-11 18:01:00+05:30	\N	{"no_show": "2017-03-24T10:16:32.335Z", "order_paid": "2017-03-23T03:21:03.545Z", "order_cooking": "2017-03-23T03:59:47.676Z", "order_accepted": "2017-03-23T02:09:48.538Z", "order_requested": "2017-03-23T02:08:48.685Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476519811436511328": {"title": "Grasshopper Pie", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-23 07:38:45.756954+05:30	2017-03-24 15:46:32.252532+05:30
940	1495617581606765308	R$11.60	\N	\N	\N	2017-04-19 13:05:00+05:30	\N	{"order_declined": "2017-04-19T12:02:30.712Z", "order_requested": "2017-04-18T10:32:16.364Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495617584282731261": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 16:02:14.161304+05:30	2017-04-19 17:32:30.624649+05:30
726	1476519119359574109	R$12.60	\N	\N	\N	2017-03-11 17:59:00+05:30	\N	{"order_accepted": "2017-03-24T10:16:06.364Z", "order_requested": "2017-03-23T02:07:43.890Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476519121792270430": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-23 07:37:40.127963+05:30	2017-03-24 15:46:06.292362+05:30
892	1492802192191520981	R$12.60	\N	\N	\N	2017-04-15 03:50:00+05:30	\N	{"order_paid": "2017-04-14T13:18:59.995Z", "order_ready": "2017-04-14T13:44:24.907Z", "order_accepted": "2017-04-14T13:18:52.305Z", "order_picked_up": "2017-04-14T13:44:56.540Z", "order_requested": "2017-04-14T13:18:37.559Z"}	\N	1492175939	f	f	\N	\N	\N	\N	\N	{"1492802194649383126": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 18:48:35.432905+05:30	2017-04-14 19:14:56.444587+05:30
737	1477432545397179163	R$16.60	\N	\N	\N	2017-03-25 01:00:00+05:30	\N	{"order_accepted": "2017-04-06T12:26:15.436Z", "order_requested": "2017-03-24T08:25:26.721Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1477432547838264092": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1477432549482431261": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-24 13:55:12.378422+05:30	2017-04-06 17:56:15.33408+05:30
741	1479650724341088502	R$17.60	\N	\N	\N	2017-03-28 00:10:00+05:30	\N	{"order_accepted": "2017-04-06T12:26:01.598Z", "order_requested": "2017-03-27T09:48:59.517Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1479650726639567095": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-27 15:18:56.751934+05:30	2017-04-06 17:56:01.477393+05:30
731	1476573335813881966	R$12.60	\N	\N	\N	2017-03-11 22:55:51+05:30	\N	{"order_paid": "2017-03-23T03:56:39.593Z", "order_accepted": "2017-03-23T03:57:27.533Z", "order_delivered": "2017-03-24T02:50:59.992Z", "order_requested": "2017-03-23T03:55:36.476Z"}	\N	\N	f	t	\N	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203"}	\N	\N	{"1476573338204635247": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Bob S	9009	2089	Chunky Monkey	1088	2017-03-23 09:25:32.888143+05:30	2017-03-24 08:20:59.875364+05:30
742	1479654645990162680	R$17.60	\N	\N	\N	2017-03-28 00:20:00+05:30	\N	{"order_accepted": "2017-04-06T12:26:41.466Z", "order_requested": "2017-03-27T09:56:51.173Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1479654648255086841": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-27 15:26:49.196046+05:30	2017-04-06 17:56:41.376721+05:30
730	1476571135918211180	R$12.60	\N	\N	\N	2017-03-11 22:55:51+05:30	\N	{"no_show": "2017-03-24T02:52:05.442Z", "order_paid": "2017-03-23T03:51:58.025Z", "order_cooking": "2017-03-23T04:00:10.351Z", "order_accepted": "2017-03-23T03:52:33.960Z", "order_requested": "2017-03-23T03:51:04.753Z"}	\N	\N	f	t	\N	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203"}	\N	\N	{"1476571138267021421": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-23 09:21:03.368255+05:30	2017-03-24 08:22:05.339223+05:30
937	1495566326951838439	R$13.60	\N	\N	\N	2017-04-19 11:20:00+05:30	\N	{"no_show": "2017-04-18T09:37:26.328Z", "order_paid": "2017-04-18T09:36:35.984Z", "order_accepted": "2017-04-18T09:36:30.153Z", "order_requested": "2017-04-18T08:50:28.423Z"}	\N	1492551420	f	f	\N	\N	\N	\N	\N	{"1495566329392923368": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 14:20:26.367364+05:30	2017-04-18 15:07:26.233299+05:30
733	1477263768953028943	R$23.60	\N	\N	\N	2017-03-11 22:40:51+05:30	\N	{"order_accepted": "2017-03-24T02:59:55.140Z", "order_requested": "2017-03-24T02:48:45.026Z"}	\N	\N	f	t	2017-03-11 22:55:51+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203"}	\N	\N	{"1477263771394113872": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 2, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-24 08:18:42.456895+05:30	2017-03-24 08:29:55.039665+05:30
740	1479649206036594932	R$17.60	\N	\N	\N	2017-03-28 00:05:00+05:30	\N	{"order_accepted": "2017-04-06T12:26:27.133Z", "order_requested": "2017-03-27T09:46:10.189Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1479649209224265973": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-27 15:16:08.123449+05:30	2017-04-06 17:56:27.04045+05:30
739	1477576228796891223	R$16.60	\N	\N	\N	2017-03-25 03:25:00+05:30	\N	{"order_accepted": "2017-04-06T12:25:43.056Z", "order_requested": "2017-03-24T13:07:31.689Z"}	\N	\N	f	t	2017-03-25 03:40:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore"}	\N	\N	{"1477576231103758424": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1477576233578397785": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-24 18:37:28.396917+05:30	2017-04-06 17:55:42.95495+05:30
743	1479670877543989502	R$98.60	\N	\N	\N	2017-03-28 00:50:00+05:30	\N	{"order_accepted": "2017-04-06T12:26:51.078Z", "order_requested": "2017-03-27T10:29:04.089Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1479670879951519999": {"title": "Pork Sliders", "options": [], "quantity": 1, "selections": {}}, "1479670881654407424": {"title": "Philly Cheesesteak", "options": [], "quantity": 2, "selections": {}}, "1479670883340517633": {"title": "Grilled Cheez Melt Gargonzola", "options": [], "quantity": 6, "selections": {"Cheese Selection": "Gargonzola"}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-27 15:59:00.887885+05:30	2017-04-06 17:56:51.000622+05:30
736	1477267531369546065	R$12.60	\N	\N	\N	2017-03-11 21:35:51+05:30	\N	{"order_accepted": "2017-03-24T15:01:45.961Z", "order_requested": "2017-03-24T02:59:04.524Z"}	\N	\N	f	t	2017-03-11 21:50:51+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67"}	\N	\N	{"1477267533735133522": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-24 08:29:03.368886+05:30	2017-03-24 20:31:45.435111+05:30
732	1476693753040208247	R$18.60	\N	\N	\N	2017-03-23 22:15:00+05:30	\N	{"order_accepted": "2017-04-05T08:31:51.131Z", "order_requested": "2017-03-23T07:54:07.440Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1476693755321909624": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1476693756991242617": {"title": "BBQ Wings Fire Chipotle", "options": [], "quantity": 1, "selections": {"Sauce": "Fire Chipotle"}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-23 13:24:04.546+05:30	2017-04-05 14:02:12.764912+05:30
935	1495562485439136480	R$35.60	\N	\N	\N	2017-04-19 11:15:00+05:30	\N	{"order_paid": "2017-04-18T09:34:39.872Z", "order_ready": "2017-04-20T07:09:51.618Z", "order_cooking": "2017-04-20T07:09:42.498Z", "order_accepted": "2017-04-18T09:34:31.741Z", "order_picked_up": "2017-04-20T07:11:47.643Z", "order_requested": "2017-04-18T08:47:14.823Z"}	\N	1492551304	f	f	\N	\N	\N	\N	\N	{"1495562487871832801": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1495562489650217698": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1495562491453768419": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 14:17:11.687951+05:30	2017-04-20 12:41:47.420627+05:30
951	1496391335777665247	R$13.60	\N	\N	\N	2017-04-20 14:40:00+05:30	\N	{"order_declined": "2017-04-19T12:15:06.026Z", "order_requested": "2017-04-19T12:10:11.353Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496391338889838816": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 17:40:09.120027+05:30	2017-04-19 17:45:05.919524+05:30
735	1477267531369546065	R$12.60	\N	\N	\N	2017-03-11 21:35:51+05:30	\N	{"order_declined": "2017-03-24T03:00:48.621Z", "order_requested": "2017-03-24T02:57:37.051Z"}	\N	\N	f	t	2017-03-11 21:50:51+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67"}	1	\N	{"1477267533735133522": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-24 08:27:35.912986+05:30	2017-03-27 17:14:54.574409+05:30
738	1477521256512225342	R$16.60	\N	\N	\N	2017-03-25 04:05:00+05:30	\N	{"order_accepted": "2017-03-27T12:06:39.810Z", "order_requested": "2017-03-24T11:18:16.092Z"}	\N	\N	f	t	2017-03-25 04:20:00+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67"}	\N	\N	{"1477521259548901439": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}, "1477521262208090176": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-03-24 16:48:13.612098+05:30	2017-03-27 17:36:39.720297+05:30
734	1477267531369546065	R$12.60	\N	\N	\N	2017-03-11 21:35:51+05:30	\N	{"order_paid": "2017-03-24T03:06:15.480Z", "order_cooking": "2017-03-24T14:50:13.513Z", "order_accepted": "2017-03-24T03:05:01.613Z", "order_delivered": "2017-03-28T18:38:59.412Z", "order_requested": "2017-03-24T02:54:40.420Z"}	\N	\N	f	t	2017-03-11 21:50:51+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203"}	4	\N	{"1477267533735133522": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-24 08:24:37.275528+05:30	2017-03-29 00:08:59.328328+05:30
744	1479913913813304049	R$12.60	\N	\N	\N	2017-03-11 22:44:51+05:30	\N	{"order_paid": "2017-03-27T18:34:06.030Z", "order_ready": "2017-03-27T18:36:46.763Z", "order_cooking": "2017-03-27T18:36:19.030Z", "order_accepted": "2017-03-27T18:33:30.305Z", "order_delivered": "2017-03-27T18:37:36.761Z", "order_requested": "2017-03-27T18:33:14.649Z", "order_dispatched": "2017-03-27T18:37:09.422Z"}	\N	\N	f	t	2017-03-11 22:59:51+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67"}	3	\N	{"1479913916271166194": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-28 00:03:12.134818+05:30	2017-03-28 00:07:36.66017+05:30
745	1480166395915273003	R$23.60	\N	\N	\N	2017-03-11 20:33:51+05:30	\N	{"order_paid": "2017-03-28T15:46:53.712Z", "order_ready": "2017-04-03T10:21:23.528Z", "order_cooking": "2017-04-03T10:21:28.515Z", "order_accepted": "2017-03-28T15:46:47.802Z", "order_delivered": "2017-04-03T10:21:37.704Z", "order_requested": "2017-03-28T02:54:43.181Z"}	\N	\N	f	t	2017-03-11 20:48:51+05:30	3	{"city": "Natal", "phone": "Cliff / 444-3636", "state": "RN", "address1": "123 Drummond St", "address2": "Apt 2000"}	4	\N	{"1480166398322803500": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 2, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-28 08:24:40.551588+05:30	2017-04-03 15:51:43.239765+05:30
746	1480168004934173485	R$12.60	\N	\N	\N	2017-03-11 18:01:00+05:30	\N	{"order_accepted": "2017-04-03T10:50:55.409Z", "order_requested": "2017-03-28T02:57:28.421Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1480168007291372334": {"title": "Hot Fudge Sundae Mint Chocolate Chip", "options": [], "quantity": 1, "selections": {"Ice Cream": "Mint Chocolate Chip"}}}	\N	Bob S	9009	2089	Chunky Monkey	1088	2017-03-28 08:27:26.176212+05:30	2017-04-03 16:21:06.728749+05:30
750	1480653838825291845	R$11.60	\N	\N	\N	2017-03-11 18:01:00+05:30	\N	{"order_paid": "2017-03-28T20:12:46.838Z", "order_ready": "2017-04-01T16:19:09.299Z", "order_cooking": "2017-04-01T16:17:54.614Z", "order_accepted": "2017-03-28T20:12:41.686Z", "order_picked_up": "2017-04-02T23:16:44.015Z", "order_requested": "2017-03-28T19:03:17.345Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1480653841207656518": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-29 00:33:15.25989+05:30	2017-04-03 04:46:43.91422+05:30
748	1441827869947855089	R$11.60	\N	\N	\N	2017-02-07 01:26:56+05:30	\N	{"order_requested": "2017-03-28T03:11:09.147Z"}	\N	\N	f	t	2017-02-07 01:41:56+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1441827872137281778": {"title": "Submariner Gargonzola", "options": [], "quantity": 1, "selections": {"Cheese": "Gargonzola"}}}	\N	Stacy T	9001	2006	Crazy Jacks	1005	2017-03-28 08:41:02.918162+05:30	2017-03-28 08:41:02.918162+05:30
861	1491943838942495441	R$10.60	\N	\N	\N	2017-04-14 01:55:00+05:30	\N	{"order_accepted": "2017-04-13T08:54:03.031Z", "order_requested": "2017-04-13T08:53:31.525Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491943841685570258": {"title": "Mongolian Beef with Cashews White", "options": [], "quantity": 1, "selections": {"Rice": "White"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-13 14:23:28.52637+05:30	2017-04-13 14:24:02.89833+05:30
747	1480169296377152303	R$23.60	\N	\N	\N	2017-03-11 20:30:51+05:30	\N	{"order_paid": "2017-03-28T03:01:49.897Z", "order_cooking": "2017-03-29T04:18:04.369Z", "order_accepted": "2017-03-28T03:01:03.266Z", "order_delivered": "2017-03-29T04:31:38.908Z", "order_requested": "2017-03-28T03:00:16.191Z"}	\N	\N	f	t	2017-03-11 20:45:51+05:30	3	{"city": "Natal", "phone": "Cliff / 444-3636", "state": "RN", "address1": "123 Drummond St", "address2": "Apt 2000"}	1	\N	{"1480169298793071408": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-28 08:30:13.898333+05:30	2017-03-29 10:01:38.811898+05:30
752	1480679164645212258	R$21.60	\N	\N	\N	2017-03-11 18:15:00+05:30	\N	{"order_paid": "2017-03-28T19:53:59.075Z", "order_accepted": "2017-03-28T19:53:30.986Z", "order_picked_up": "2017-03-28T19:55:44.706Z", "order_requested": "2017-03-28T19:53:13.365Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1480679167044354147": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-29 01:23:11.238247+05:30	2017-03-29 01:25:44.60692+05:30
753	1480681489002659940	R$11.60	\N	\N	\N	2017-03-12 05:25:00+05:30	\N	{"order_paid": "2017-03-28T19:58:02.043Z", "order_ready": "2017-03-31T18:11:53.865Z", "order_cooking": "2017-04-01T16:19:24.237Z", "order_accepted": "2017-03-28T19:58:40.371Z", "order_picked_up": "2017-04-03T15:25:28.427Z", "order_requested": "2017-03-28T19:57:48.358Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1480681491510853733": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-03-29 01:27:45.152941+05:30	2017-04-03 20:55:28.296648+05:30
856	1491884596411761277	R$10.60	\N	\N	\N	2017-04-13 23:45:00+05:30	\N	{"order_accepted": "2017-04-13T06:57:02.633Z", "order_requested": "2017-04-13T06:55:52.175Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491884598760571518": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491884600513790591": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 12:25:49.391253+05:30	2017-04-13 12:27:02.529974+05:30
939	1495617266740364026	R$25.60	\N	\N	\N	2017-04-19 13:05:00+05:30	\N	{"order_declined": "2017-04-19T12:02:18.131Z", "order_requested": "2017-04-18T10:31:39.887Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495617269147894523": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 16:01:36.865797+05:30	2017-04-19 17:32:18.027467+05:30
759	1482720792633410260	R$31.60	\N	\N	\N	2017-03-11 20:21:34+05:30	\N	{"order_accepted": "2017-03-31T17:57:47.531Z", "order_requested": "2017-03-31T15:29:18.390Z"}	\N	12345	f	f	\N	\N	\N	\N	\N	{"1482720795057717973": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 3, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-31 20:59:16.108648+05:30	2017-04-05 19:38:48.268765+05:30
754	1480786485727723646	R$11.60	\N	\N	\N	2017-03-11 20:49:34+05:30	\N	{"no_show": "2017-03-30T12:09:28.913Z", "order_paid": "2017-03-28T23:27:32.213Z", "order_accepted": "2017-03-28T23:28:11.686Z", "order_requested": "2017-03-28T23:27:06.441Z"}	\N	\N	f	t	2017-03-11 21:04:34+05:30	6	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "123 Prudente", "address2": "Apt 2000", "nickname": "Oak Pine Estate"}	9	\N	{"1480786488210751615": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-29 04:57:04.030165+05:30	2017-03-30 17:39:28.802614+05:30
927	1495471648055231145	R$13.60	\N	\N	\N	2017-04-18 20:15:00+05:30	\N	{"order_accepted": "2017-04-18T05:43:11.507Z", "order_requested": "2017-04-18T05:42:43.013Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495471650429207210": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 11:12:40.078675+05:30	2017-04-18 11:13:11.422003+05:30
751	1480654842413187143	R$21.60	\N	\N	\N	2017-03-11 20:27:51+05:30	\N	{"order_paid": "2017-03-28T19:48:25.840Z", "order_ready": "2017-03-28T20:12:21.728Z", "order_cooking": "2017-03-28T19:56:09.441Z", "order_accepted": "2017-03-28T19:36:48.119Z", "order_picked_up": "2017-03-28T22:17:40.839Z", "order_requested": "2017-03-28T19:07:27.184Z"}	\N	\N	f	t	2017-03-11 20:42:51+05:30	6	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "123 Prudente", "address2": "Apt 2000", "nickname": "Oak Pine Estate"}	6	\N	{"1480654844812329032": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-29 00:37:24.822054+05:30	2017-03-29 05:41:47.501981+05:30
749	1480181880211899185	R$34.60	\N	\N	\N	2017-03-11 20:27:51+05:30	\N	{"no_show": "2017-04-03T10:21:47.990Z", "order_paid": "2017-03-28T03:25:48.710Z", "order_ready": "2017-04-01T13:41:39.762Z", "order_cooking": "2017-04-01T13:14:12.151Z", "order_accepted": "2017-03-28T03:26:26.999Z", "order_requested": "2017-03-28T03:25:08.455Z", "order_dispatched": "2017-04-03T10:21:33.041Z"}	\N	\N	f	t	2017-03-11 20:42:51+05:30	3	{"city": "Natal", "phone": "Cliff / 444-3636", "state": "RN", "address1": "123 Drummond St", "address2": "Apt 2000", "nickname": "Tango"}	7	\N	{"1480181882644595506": {"title": "Grasshopper Pie", "options": ["Nuts & Whip Cream"], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-03-28 08:55:06.224695+05:30	2017-04-03 15:52:04.151426+05:30
757	1482689861260411599	R$21.60	\N	\N	\N	2017-03-11 21:05:34+05:30	\N	{"order_accepted": "2017-03-31T14:33:05.021Z", "order_requested": "2017-03-31T14:31:06.366Z"}	\N	\N	f	t	2017-03-11 21:20:34+05:30	6	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2895", "address2": "Apt 2000", "nickname": "Oak Pine Estate"}	\N	\N	{"1482689863718273744": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-31 20:01:04.042608+05:30	2017-03-31 20:03:04.886887+05:30
857	1491901734086247062	R$10.60	\N	\N	\N	2017-04-14 00:20:00+05:30	\N	{"order_accepted": "2017-04-13T07:37:56.415Z", "order_requested": "2017-04-13T07:29:50.390Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491901736443445911": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491901738196664984": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 12:59:47.797994+05:30	2017-04-13 13:07:56.335203+05:30
756	1482176588668732001	R$11.60	\N	\N	\N	2017-03-11 20:49:34+05:30	\N	{"order_paid": "2017-03-30T21:29:14.245Z", "order_ready": "2017-04-03T15:42:18.161Z", "order_cooking": "2017-04-03T12:24:01.458Z", "order_accepted": "2017-03-30T21:29:48.187Z", "order_delivered": "2017-04-04T07:29:09.751Z", "order_requested": "2017-03-30T21:28:45.554Z", "order_dispatched": "2017-04-04T07:29:04.290Z"}	\N	\N	f	t	2017-03-11 21:04:34+05:30	8	{"city": "Natal", "phone": "Jim / 444-3636", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2895", "address2": "null", "nickname": "Nordestao"}	6	\N	{"1482176591051096674": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-31 02:58:43.303051+05:30	2017-04-04 12:59:09.655713+05:30
758	1482694724790780625	R$21.60	\N	\N	\N	2017-03-11 21:25:34+05:30	\N	{"order_accepted": "2017-03-31T14:39:01.768Z", "order_requested": "2017-03-31T14:38:24.552Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1482694727315751634": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-31 20:08:22.09875+05:30	2017-03-31 20:09:01.612345+05:30
755	1481841526047769087	R$21.60	\N	\N	\N	2017-03-11 20:49:34+05:30	\N	{"order_paid": "2017-03-30T14:40:18.128Z", "order_ready": "2017-04-03T13:56:24.658Z", "order_cooking": "2017-04-01T16:19:43.499Z", "order_accepted": "2017-03-30T14:17:13.738Z", "order_delivered": "2017-04-03T14:27:12.383Z", "order_requested": "2017-03-30T10:22:47.213Z", "order_dispatched": "2017-04-03T14:26:22.066Z"}	\N	\N	f	t	2017-03-11 21:04:34+05:30	6	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "123 Prudente", "address2": "Apt 2000", "nickname": "Oak Pine Estate"}	6	\N	{"1481841528430133760": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-03-30 15:52:44.910357+05:30	2017-04-03 19:57:12.284374+05:30
762	1484775885864173591	R$9.60	\N	\N	\N	2017-04-04 02:50:00+05:30	\N	{"order_accepted": "2017-04-03T11:33:42.460Z", "order_requested": "2017-04-03T11:31:45.565Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1484775888196206616": {"title": "2 for 1 Hot Fudge Sundae", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-03 17:01:43.496241+05:30	2017-04-03 17:03:59.999746+05:30
761	1484773141111635988	R$17.60	\N	\N	\N	2017-04-04 01:55:00+05:30	\N	{"order_accepted": "2017-04-03T11:28:44.395Z", "order_requested": "2017-04-03T11:27:30.021Z"}	\N	\N	f	t	2017-04-04 02:10:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1484773143418503189": {"title": "fgdgdfg", "options": [], "quantity": 2, "selections": {}}, "1484773145087836182": {"title": "asdsad", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-03 16:57:27.496+05:30	2017-04-03 16:58:44.307972+05:30
858	1491905274481476249	R$10.60	\N	\N	\N	2017-04-14 00:30:00+05:30	\N	{"order_accepted": "2017-04-13T07:37:43.291Z", "order_requested": "2017-04-13T07:36:55.902Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491905276905783962": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491905278877106843": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 13:06:52.87422+05:30	2017-04-13 13:07:43.192797+05:30
975	1497231851381588835	R$25.60	\N	\N	\N	2017-04-20 22:30:00+05:30	\N	{"order_accepted": "2017-04-20T16:01:06.496Z", "order_requested": "2017-04-20T16:00:11.019Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1497231853914948452": {"title": "Pork Plate", "options": ["item"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 21:30:08.675129+05:30	2017-04-20 21:31:06.386325+05:30
763	1484784748696961053	R$9.60	\N	\N	\N	2017-04-04 02:40:00+05:30	\N	{"order_accepted": "2017-04-03T11:50:38.335Z", "order_requested": "2017-04-03T11:49:32.641Z"}	\N	\N	f	t	2017-04-04 02:55:00+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1484784750995439646": {"title": "2 for 1 Hot Fudge Sundae", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-03 17:19:30.470918+05:30	2017-04-03 17:20:38.239986+05:30
764	1484787116985548833	R$17.60	\N	\N	\N	2017-04-04 02:40:00+05:30	\N	{"order_accepted": "2017-04-03T11:54:37.928Z", "order_requested": "2017-04-03T11:54:08.003Z"}	\N	\N	f	t	2017-04-04 02:55:00+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1484787119275638818": {"title": "2 for 1 Hot Fudge Sundae", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-03 17:24:05.827002+05:30	2017-04-03 17:24:37.832641+05:30
776	1486129550428471581	R$16.60	\N	\N	\N	2017-04-05 22:55:00+05:30	\N	{"order_declined": "2017-04-10T06:46:39.288Z", "order_requested": "2017-04-05T08:21:29.084Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486129552802447646": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1486129554589221151": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-05 13:51:26.460325+05:30	2017-04-10 12:16:39.210605+05:30
760	1483549651897418589	R$11.60	\N	\N	\N	2017-03-11 20:04:34+05:30	\N	{"order_paid": "2017-04-01T18:59:34.430Z", "order_ready": "2017-04-03T12:23:11.830Z", "order_cooking": "2017-04-01T19:42:16.964Z", "order_accepted": "2017-04-01T18:57:05.411Z", "order_delivered": "2017-04-03T13:56:54.006Z", "order_requested": "2017-04-01T18:56:33.834Z", "order_dispatched": "2017-04-03T12:24:22.220Z"}	\N	\N	f	t	2017-03-11 20:19:34+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	21	\N	{"1483549654372057950": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-02 00:26:31.595542+05:30	2017-04-03 19:26:53.914433+05:30
765	1484787063021633567	R$17.60	\N	\N	\N	2017-04-04 02:40:00+05:30	\N	{"order_accepted": "2017-04-03T11:57:23.119Z", "order_requested": "2017-04-03T11:54:46.488Z"}	\N	\N	f	t	2017-04-04 02:55:00+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1484787065320112160": {"title": "2 for 1 Hot Fudge Sundae", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-03 17:24:44.315612+05:30	2017-04-03 17:27:23.034935+05:30
767	1484795411716637677	R$31.60	\N	\N	\N	2017-03-11 20:07:34+05:30	\N	{"no_show": "2017-04-03T13:57:32.060Z", "order_paid": "2017-04-03T12:11:40.774Z", "order_accepted": "2017-04-03T12:12:08.153Z", "order_requested": "2017-04-03T12:10:56.000Z"}	\N	\N	f	t	2017-03-11 20:22:34+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1484795414099002350": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 3, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-03 17:40:53.844916+05:30	2017-04-03 19:27:31.942694+05:30
772	1485610857571287368	R$11.60	\N	\N	\N	2017-03-11 20:00:34+05:30	\N	{"order_paid": "2017-04-04T15:16:41.832Z", "order_ready": "2017-04-04T17:17:38.815Z", "order_cooking": "2017-04-04T17:17:19.552Z", "order_accepted": "2017-04-04T15:12:30.764Z", "order_picked_up": "2017-04-05T17:32:04.329Z", "order_requested": "2017-04-04T15:11:26.525Z"}	\N	12345	f	f	\N	\N	\N	\N	\N	{"1485610859987206473": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-04 20:41:24.139705+05:30	2017-04-05 23:02:04.23125+05:30
941	1495626381407552258	R$12.60	\N	\N	\N	2017-04-19 13:20:00+05:30	\N	{"order_paid": "2017-04-18T10:50:27.021Z", "order_ready": "2017-04-19T22:34:45.613Z", "order_cooking": "2017-04-19T22:34:34.259Z", "order_accepted": "2017-04-18T10:50:10.706Z", "order_picked_up": "2017-04-19T22:35:18.004Z", "order_requested": "2017-04-18T10:49:52.982Z"}	\N	1492555851	f	f	\N	\N	\N	\N	\N	{"1495626383840248579": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-18 16:19:50.809572+05:30	2017-04-20 04:05:17.894834+05:30
952	1496394399012094177	R$13.60	\N	\N	\N	2017-04-20 14:45:00+05:30	\N	{"order_declined": "2017-04-19T12:19:11.874Z", "order_requested": "2017-04-19T12:15:44.742Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496394401511899362": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 17:45:42.548001+05:30	2017-04-19 17:49:11.762434+05:30
770	1485591752885666104	R$21.60	\N	\N	\N	2017-03-11 19:45:34+05:30	\N	{"order_declined": "2017-04-04T15:17:27.026Z", "order_requested": "2017-04-04T14:37:48.333Z"}	\N	\N	f	t	2017-03-11 20:00:34+05:30	10	{"city": "Natal", "phone": "Stacy / 555-9988", "state": "RN", "address1": "Avenida Mal Rondon, 3490 Candelária", "address2": "Apt 760", "nickname": "Car Dealership"}	\N	\N	{"1485591755268030777": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-04 20:07:46.10815+05:30	2017-04-04 20:47:26.918176+05:30
768	1485590514341249334	R$11.60	\N	\N	\N	2017-03-11 20:21:34+05:30	\N	{"order_accepted": "2017-04-04T15:08:00.486Z", "order_requested": "2017-04-04T14:32:05.941Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1485590516723614007": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-04 20:02:04.121631+05:30	2017-04-04 20:37:58.955937+05:30
769	1485590514341249334	R$11.60	\N	\N	\N	2017-03-11 20:21:34+05:30	\N	{"order_accepted": "2017-04-05T17:47:39.551Z", "order_requested": "2017-04-04T14:33:43.105Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1485590516723614007": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-04 20:01:33.339154+05:30	2017-04-05 23:17:39.447054+05:30
773	1485937011373114007	R$28.60	\N	\N	\N	2017-03-11 21:00:34+05:30	\N	{"order_accepted": "2017-04-05T06:48:08.587Z", "order_requested": "2017-04-05T02:00:28.579Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1485937013847753368": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}, "1485937015810687641": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-05 07:30:25.359786+05:30	2017-04-05 12:18:08.472503+05:30
1072	1501723604566409405	R$13.60	\N	\N	\N	2017-04-27 02:45:00+05:30	\N	{"order_accepted": "2017-04-26T20:44:37.651Z", "order_requested": "2017-04-26T20:43:55.906Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501723607133323454": {"title": "Volcano Burger", "options": [], "quantity": 2, "selections": {}}}	\N	d n	9020	2094	Thaitanic Xpress	1092	2017-04-27 02:13:52.784049+05:30	2017-04-27 02:14:37.545849+05:30
774	1485940194866627226	R$28.60	\N	\N	\N	2017-03-11 19:40:34+05:30	\N	{"no_show": "2017-04-05T17:32:37.441Z", "order_paid": "2017-04-05T02:09:06.659Z", "order_ready": "2017-04-05T07:05:40.442Z", "order_cooking": "2017-04-05T07:05:06.368Z", "order_accepted": "2017-04-05T02:07:50.187Z", "order_requested": "2017-04-05T02:06:19.134Z"}	\N	\N	f	t	2017-03-11 19:55:34+05:30	10	{"city": "Natal", "phone": "Stacy / 555-9988", "state": "RN", "address1": "Avenida Mal Rondon, 3490 Candelária", "address2": "Apt 760", "nickname": "Car Dealership"}	21	\N	{"1485940197316100763": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}, "1485940199144817308": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-05 07:36:16.282721+05:30	2017-04-05 23:02:37.361955+05:30
766	1484794325467399147	R$21.60	\N	\N	\N	2017-03-11 20:00:34+05:30	\N	{"order_paid": "2017-04-03T12:11:35.144Z", "order_ready": "2017-04-04T07:28:46.266Z", "order_cooking": "2017-04-04T03:22:02.703Z", "order_accepted": "2017-04-03T12:12:12.999Z", "order_delivered": "2017-04-05T06:19:49.222Z", "order_requested": "2017-04-03T12:10:02.644Z", "order_dispatched": "2017-04-05T06:19:41.254Z"}	\N	\N	f	t	2017-03-11 20:15:34+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	21	\N	{"1484794328009147372": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-03 17:40:00.129084+05:30	2017-04-05 11:49:49.128145+05:30
778	1486232224910016838	R$10.60	\N	\N	\N	2017-04-06 02:15:00+05:30	\N	{"order_accepted": "2017-04-05T11:45:45.319Z", "order_requested": "2017-04-05T11:45:20.665Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486232227208495431": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-05 17:15:17.195451+05:30	2017-04-05 17:15:45.22068+05:30
777	1486129938242208032	R$23.60	\N	\N	\N	2017-04-05 22:55:00+05:30	\N	{"order_declined": "2017-04-10T06:46:48.124Z", "order_requested": "2017-04-05T08:26:17.365Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486129940549075233": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1486129942243574050": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-05 13:56:14.760665+05:30	2017-04-10 12:16:48.049409+05:30
781	1486300803038708064	R$10.60	\N	\N	\N	2017-04-06 04:35:00+05:30	\N	{"order_accepted": "2017-04-05T14:02:53.513Z", "order_requested": "2017-04-05T14:01:33.039Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486300805353963873": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-05 19:31:30.576543+05:30	2017-04-05 19:32:53.414639+05:30
779	1486285166740504922	R$10.60	\N	\N	\N	2017-04-06 04:00:00+05:30	\N	{"order_accepted": "2017-04-05T13:31:51.421Z", "order_requested": "2017-04-05T13:30:26.717Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486285169055760731": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-05 19:00:24.601567+05:30	2017-04-05 19:01:51.275429+05:30
1054	1501326196384727181	R$13.60	\N	\N	\N	2017-04-26 22:05:00+05:30	\N	{"order_declined": "2017-04-26T07:39:27.898Z", "order_requested": "2017-04-26T07:34:48.658Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501326198834200718": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-26 13:04:45.238115+05:30	2017-04-26 13:09:27.808701+05:30
786	1486430601706734534	R$6.60	\N	\N	\N	2017-04-06 00:20:00+05:30	\N	{"order_accepted": "2017-04-06T13:20:54.739Z", "order_requested": "2017-04-05T18:20:53.252Z"}	\N	\N	f	t	2017-04-06 00:35:00+05:30	11	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Prudente de Morais, 5950 - Candelária, Natal - RN", "address2": null, "nickname": "Subway"}	\N	\N	{"1486430604240094151": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-05 23:50:51.020586+05:30	2017-04-06 18:50:54.639136+05:30
780	1486289424688873820	R$10.60	\N	\N	\N	2017-04-06 04:10:00+05:30	\N	{"order_accepted": "2017-04-05T13:44:11.930Z", "order_requested": "2017-04-05T13:38:58.969Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486289426995741021": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-05 19:08:56.291725+05:30	2017-04-05 19:14:11.821505+05:30
782	1486321291718820198	R$19.60	\N	\N	\N	2017-04-06 05:10:00+05:30	\N	{"order_accepted": "2017-04-05T14:43:18.940Z", "order_requested": "2017-04-05T14:42:12.006Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486321294017298791": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 2, "selections": {}}}	\N	Matt G	9012	2094	Thaitanic Xpress	1092	2017-04-05 20:12:09.922588+05:30	2017-04-05 20:13:18.838736+05:30
775	1486128086918365467	R$9.60	\N	\N	\N	2017-04-05 22:40:00+05:30	\N	{"order_declined": "2017-04-10T06:46:29.268Z", "order_requested": "2017-04-05T08:19:59.741Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486128089250398492": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-05 13:49:57.619976+05:30	2017-04-10 12:16:29.188008+05:30
953	1496414892775702758	R$13.60	\N	\N	\N	2017-04-20 15:30:00+05:30	\N	{"order_declined": "2017-04-19T13:00:44.902Z", "order_requested": "2017-04-19T12:56:48.331Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496414895309062375": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 18:26:46.033337+05:30	2017-04-19 18:30:44.811696+05:30
771	1485591752885666104	R$21.60	\N	\N	\N	2017-03-11 19:45:34+05:30	\N	{"order_paid": "2017-04-05T17:49:52.852Z", "order_ready": "2017-04-06T06:21:13.334Z", "order_cooking": "2017-04-05T17:50:28.964Z", "order_accepted": "2017-04-05T17:48:28.727Z", "order_delivered": "2017-04-06T10:09:52.277Z", "order_requested": "2017-04-04T14:38:52.424Z"}	\N	\N	f	t	2017-03-11 20:00:34+05:30	10	{"city": "Natal", "phone": "Stacy / 555-9988", "state": "RN", "address1": "Avenida Mal Rondon, 3490 Candelária", "address2": "Apt 760", "nickname": "Car Dealership"}	21	\N	{"1485591755268030777": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-04 20:08:51.332635+05:30	2017-04-06 15:39:52.151215+05:30
784	1486422672819618744	R$11.60	\N	\N	\N	2017-04-06 00:05:00+05:30	\N	{"order_accepted": "2017-04-06T13:20:22.333Z", "order_requested": "2017-04-05T18:05:00.344Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486422675227149241": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-05 23:34:58.212363+05:30	2017-04-06 18:50:22.249305+05:30
794	1487726847289459343	R$12.60	\N	\N	\N	2017-04-08 06:15:00+05:30	\N	{"order_declined": "2017-04-08T13:46:43.607Z", "order_requested": "2017-04-07T13:15:32.116Z"}	\N	\N	f	t	2017-04-08 06:30:00+05:30	7	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "123 Prudente", "address2": "Apt 2000", "nickname": "Oak Pine Estate"}	\N	\N	{"1487726849663435408": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-07 18:45:28.386678+05:30	2017-04-08 19:16:43.528115+05:30
789	1487013067999936645	R$25.60	\N	\N	\N	2017-03-11 19:45:34+05:30	\N	{"order_paid": "2017-04-06T13:39:00.725Z", "order_ready": "2017-04-06T13:46:34.167Z", "order_cooking": "2017-04-06T13:54:38.464Z", "order_accepted": "2017-04-06T13:38:29.164Z", "order_picked_up": "2017-04-06T14:06:23.311Z", "order_requested": "2017-04-06T13:38:08.023Z"}	\N	12345	f	f	\N	\N	\N	\N	\N	{"1487013070441021574": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-06 19:08:05.894098+05:30	2017-04-06 19:36:23.187598+05:30
793	1487693678163001964	R$14.60	\N	\N	\N	2017-04-08 05:40:00+05:30	\N	{"order_declined": "2017-04-08T13:57:02.589Z", "order_requested": "2017-04-07T12:10:29.526Z"}	\N	\N	f	t	2017-04-08 06:10:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1487693680453091949": {"title": "fdsfs", "options": [], "quantity": 1, "selections": {}}, "1487693682164367982": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-07 17:40:25.477826+05:30	2017-04-08 19:27:02.493501+05:30
796	1487799857891508650	R$8.60	\N	\N	\N	2017-04-07 21:40:00+05:30	\N	{"order_accepted": "2017-04-08T12:21:55.270Z", "order_requested": "2017-04-07T15:42:09.527Z"}	\N	\N	f	t	2017-04-07 21:55:00+05:30	10	{"city": "Natal", "phone": "Stacy / 555-9988", "state": "RN", "address1": "Avenida Mal Rondon, 3490 Candelária", "address2": "Apt 760", "nickname": "Car Dealership"}	\N	\N	{"1487799860366148011": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-07 21:12:06.188498+05:30	2017-04-08 17:51:55.146635+05:30
785	1486430614700688328	R$6.60	\N	\N	\N	2017-04-06 00:20:00+05:30	\N	{"order_accepted": "2017-04-06T13:20:38.516Z", "order_requested": "2017-04-05T18:19:29.816Z"}	\N	\N	f	t	2017-04-06 00:35:00+05:30	11	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Prudente de Morais, 5950 - Candelária, Natal - RN", "address2": null, "nickname": "Subway"}	\N	\N	{"1486430617217270729": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-05 23:49:27.72742+05:30	2017-04-06 18:50:38.423188+05:30
783	1486417227614782389	R$21.60	\N	\N	\N	2017-03-11 19:40:34+05:30	\N	{"order_paid": "2017-04-05T17:55:00.442Z", "order_ready": "2017-04-06T11:14:25.917Z", "order_cooking": "2017-04-05T17:55:09.301Z", "order_accepted": "2017-04-05T17:54:23.909Z", "order_delivered": "2017-04-07T15:15:59.287Z", "order_requested": "2017-04-05T17:53:59.616Z", "order_dispatched": "2017-04-06T17:11:42.564Z"}	\N	12345	f	t	2017-03-11 19:55:34+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	21	\N	{"1486417230961836982": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-05 23:23:57.292919+05:30	2017-04-07 20:45:59.179827+05:30
805	1488449883902837672	R$19.60	\N	\N	\N	2017-04-09 03:40:00+05:30	\N	{"order_accepted": "2017-04-08T15:28:18.547Z", "order_requested": "2017-04-08T13:45:51.426Z"}	\N	\N	f	t	2017-04-09 03:55:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore", "nickname": "Test Location"}	\N	\N	{"1488449886377477033": {"title": "New", "options": [], "quantity": 1, "selections": {}}, "1488449888499794858": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-08 19:15:48.821399+05:30	2017-04-08 20:58:18.445044+05:30
788	1486992821096284283	R$21.60	\N	\N	\N	2017-03-11 20:52:34+05:30	\N	{"order_paid": "2017-04-06T13:18:47.564Z", "order_ready": "2017-04-06T13:34:20.044Z", "order_accepted": "2017-04-07T16:49:59.166Z", "order_picked_up": "2017-04-07T20:43:46.734Z", "order_requested": "2017-04-06T12:57:59.167Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486992823612866684": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-06 18:27:56.06353+05:30	2017-04-08 02:13:41.67122+05:30
791	1487521579905581631	R$19.60	\N	\N	\N	2017-04-07 21:00:00+05:30	\N	{"order_accepted": "2017-04-07T06:28:05.684Z", "order_requested": "2017-04-07T06:27:39.242Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1487521582204060224": {"title": "Mongolian Beef with Cashews", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-07 11:57:37.113165+05:30	2017-04-07 11:58:05.608491+05:30
790	1487363676229861652	R$32.60	\N	\N	\N	2017-03-11 19:55:34+05:30	\N	{"order_accepted": "2017-04-08T12:22:18.659Z", "order_requested": "2017-04-07T01:15:20.327Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1487363678696112405": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}, "1487363680499663126": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-07 06:45:16.871739+05:30	2017-04-08 17:52:18.548842+05:30
787	1486992429356679289	R$31.60	\N	\N	\N	2017-03-11 21:00:34+05:30	\N	{"order_paid": "2017-04-06T13:18:39.972Z", "order_ready": "2017-04-06T17:40:57.936Z", "order_cooking": "2017-04-06T13:34:13.079Z", "order_accepted": "2017-04-07T14:00:40.509Z", "order_picked_up": "2017-04-07T13:58:26.656Z", "order_requested": "2017-04-06T12:57:21.547Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1486992431780987002": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 3, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-06 18:27:19.096113+05:30	2017-04-07 19:30:40.40982+05:30
792	1487686573976715876	R$4.60	\N	\N	\N	2017-04-08 05:25:00+05:30	\N	{"order_declined": "2017-04-08T13:56:47.933Z", "order_requested": "2017-04-07T12:01:59.688Z"}	\N	\N	f	t	2017-04-08 05:55:00+05:30	13	{"city": null, "phone": "564846345", "state": null, "address1": "345 Baker Streets", "address2": "Gsj", "nickname": "Sam"}	\N	\N	{"1487686576317137509": {"title": "fdsfs", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2089	Chunky Monkey	1088	2017-04-07 17:31:57.254936+05:30	2017-04-08 19:26:47.849483+05:30
943	1495638632717878028	R$16.60	\N	\N	\N	2017-04-19 13:45:00+05:30	\N	{"no_show": "2017-04-18T21:12:09.865Z", "order_paid": "2017-04-18T11:15:23.618Z", "order_ready": "2017-04-18T11:16:39.907Z", "order_cooking": "2017-04-18T11:16:29.112Z", "order_accepted": "2017-04-18T11:15:17.168Z", "order_requested": "2017-04-18T11:14:12.301Z"}	\N	1492557348	f	f	\N	\N	\N	\N	\N	{"1495638635158962957": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 16:44:10.040129+05:30	2017-04-19 02:42:09.721283+05:30
802	1488393920319587195	R$12.60	\N	\N	\N	2017-04-09 01:50:00+05:30	\N	{"order_declined": "2017-04-08T13:47:35.514Z", "order_requested": "2017-04-08T11:20:16.582Z"}	\N	\N	f	t	2017-04-09 02:05:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1488393922727117692": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-08 16:50:14.391371+05:30	2017-04-08 19:17:35.426383+05:30
800	1488381791768150898	R$20.60	\N	\N	\N	2017-04-09 03:55:00+05:30	\N	{"order_accepted": "2017-04-08T10:57:09.444Z", "order_requested": "2017-04-08T10:56:05.296Z"}	\N	\N	f	t	2017-04-09 04:10:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1488381794075018099": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}, "1488381795786294132": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-08 16:26:02.629045+05:30	2017-04-08 16:27:09.341016+05:30
954	1496416778828382443	R$49.60	\N	\N	\N	2017-04-20 15:30:00+05:30	\N	{"order_declined": "2017-04-19T13:00:33.200Z", "order_requested": "2017-04-19T13:00:10.140Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496416782376763628": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}, "1496416784532635885": {"title": "Pork Plate", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 18:30:07.295251+05:30	2017-04-19 18:30:33.096208+05:30
801	1488390412816089974	R$12.60	\N	\N	\N	2017-04-09 01:45:00+05:30	\N	{"order_declined": "2017-04-08T13:47:09.232Z", "order_requested": "2017-04-08T11:16:19.791Z"}	\N	\N	f	t	2017-04-09 02:00:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1488390415190066040": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-08 16:46:17.572965+05:30	2017-04-08 19:17:09.172819+05:30
799	1488348333394101049	R$6.60	\N	\N	\N	2017-04-09 02:50:00+05:30	\N	{"order_accepted": "2017-04-08T12:22:07.000Z", "order_requested": "2017-04-08T09:51:59.656Z"}	\N	\N	f	t	2017-04-09 03:05:00+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67", "nickname": "Big Party"}	\N	\N	{"1488348335717745466": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-08 15:21:57.550555+05:30	2017-04-08 17:52:06.927188+05:30
820	1489787026759745966	R$17.60	\N	\N	\N	2017-04-10 23:50:00+05:30	\N	{"order_declined": "2017-04-11T09:39:33.027Z", "order_requested": "2017-04-10T09:28:02.412Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489787034653426095": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1489787039250383280": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:57:59.831967+05:30	2017-04-11 15:09:32.90509+05:30
806	1488468633414796213	R$12.60	\N	\N	\N	2017-04-09 04:20:00+05:30	\N	{"order_paid": "2017-04-08T18:50:00.943Z", "order_ready": "2017-04-11T07:33:17.290Z", "order_cooking": "2017-04-10T16:02:19.333Z", "order_accepted": "2017-04-08T18:49:06.255Z", "order_delivered": "2017-04-11T07:47:26.089Z", "order_requested": "2017-04-08T13:53:01.891Z", "order_dispatched": "2017-04-11T07:33:42.642Z"}	\N	\N	f	t	2017-04-09 04:35:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	5	\N	{"1488468635805549494": {"title": "New", "options": [], "quantity": 1, "selections": {}}, "1488468637541991351": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-08 19:22:59.210712+05:30	2017-04-11 13:17:25.987725+05:30
908	1494390188619596672	R$16.60	\N	\N	\N	2017-04-16 23:55:00+05:30	\N	{"order_paid": "2017-04-16T17:54:45.648Z", "order_ready": "2017-04-17T11:07:24.782Z", "order_cooking": "2017-04-16T19:46:56.379Z", "order_accepted": "2017-04-16T17:54:33.792Z", "order_picked_up": "2017-04-20T18:12:30.704Z", "order_requested": "2017-04-16T17:53:42.994Z"}	\N	1492365290	f	f	\N	\N	\N	\N	\N	{"1494390191899542401": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 1, "selections": {}}, "1494390194617451394": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-16 23:23:39.621588+05:30	2017-04-20 23:42:30.46056+05:30
803	1488398956185518973	R$9.60	\N	\N	\N	2017-04-09 02:20:00+05:30	\N	{"order_declined": "2017-04-08T13:46:52.975Z", "order_requested": "2017-04-08T11:47:22.218Z"}	\N	\N	f	t	2017-04-09 02:35:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1488398958643381118": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-08 17:17:20.208022+05:30	2017-04-08 19:16:52.901663+05:30
798	1487953959304823266	R$11.60	\N	\N	\N	2017-03-11 20:51:34+05:30	\N	{"order_paid": "2017-04-07T20:50:51.028Z", "order_ready": "2017-04-07T20:52:46.616Z", "order_cooking": "2017-04-07T20:52:12.477Z", "order_accepted": "2017-04-07T20:50:27.907Z", "order_picked_up": "2017-04-13T13:55:06.140Z", "order_requested": "2017-04-07T20:47:18.510Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1487953961829794275": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-08 02:17:15.860778+05:30	2017-04-13 19:25:06.048967+05:30
807	1488482842408125382	R$21.60	\N	\N	\N	2017-04-09 04:40:00+05:30	\N	{"order_declined": "2017-04-10T06:46:56.800Z", "order_requested": "2017-04-08T14:18:29.894Z"}	\N	\N	f	t	2017-04-09 04:55:00+05:30	2	{"city": "Natal", "phone": "Doug / 444-3636", "state": "RN", "address1": "Rua da Prudente 390", "address2": "Apt 67", "nickname": "Big Party"}	\N	\N	{"1488482844689826759": {"title": "Delivery Charge", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-08 19:48:27.777504+05:30	2017-04-10 12:16:56.724926+05:30
804	1488425615005582233	R$7.60	\N	\N	\N	2017-04-09 02:55:00+05:30	\N	{"order_accepted": "2017-04-08T15:27:52.769Z", "order_requested": "2017-04-08T12:23:16.678Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1488425617471832986": {"title": "New", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-08 17:53:14.579963+05:30	2017-04-08 20:57:52.681371+05:30
811	1489335544981750544	R$11.60	\N	\N	\N	2017-04-10 00:30:00+05:30	\N	{"order_accepted": "2017-04-10T07:41:31.670Z", "order_requested": "2017-04-09T18:31:07.965Z"}	\N	\N	f	t	2017-04-10 00:45:00+05:30	11	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Prudente de Morais, 5950 - Candelária, Natal - RN", "address2": null, "nickname": "Subway"}	\N	\N	{"1489335547456389905": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-10 00:01:04.763183+05:30	2017-04-10 13:11:31.543365+05:30
812	1489344654229897288	R$8.60	\N	\N	\N	2017-04-10 09:20:00+05:30	\N	{"order_accepted": "2017-04-09T18:53:20.444Z", "order_requested": "2017-04-09T18:49:37.431Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489344656587096137": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-10 00:19:34.000997+05:30	2017-04-10 00:23:20.350253+05:30
795	1487756683605180829	R$25.60	\N	\N	\N	2017-03-11 19:40:34+05:30	\N	{"order_paid": "2017-04-07T14:21:51.337Z", "order_ready": "2017-04-07T16:39:13.844Z", "order_cooking": "2017-04-07T14:44:34.117Z", "order_accepted": "2017-04-07T14:34:00.579Z", "order_delivered": "2017-04-09T20:43:07.722Z", "order_requested": "2017-04-07T14:15:13.848Z", "order_dispatched": "2017-04-07T16:52:05.579Z"}	\N	\N	f	t	2017-03-11 19:55:34+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	9	\N	{"1487756686138540446": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-07 19:45:11.712086+05:30	2017-04-10 02:13:07.633193+05:30
810	1489331038017553164	R$11.60	\N	\N	\N	2017-04-10 00:25:00+05:30	\N	{"order_accepted": "2017-04-09T18:23:42.405Z", "order_requested": "2017-04-09T18:22:38.006Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489331040576078605": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-09 23:52:35.864685+05:30	2017-04-09 23:53:42.307756+05:30
813	1489707694309769343	R$18.60	\N	\N	\N	2017-04-10 21:10:00+05:30	\N	{"order_declined": "2017-04-10T07:08:00.843Z", "order_requested": "2017-04-10T07:00:39.747Z"}	\N	\N	f	t	2017-04-10 21:25:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1489707696641802368": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}, "1489707698403410049": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 12:30:36.145744+05:30	2017-04-10 12:38:00.758179+05:30
814	1489760594834751880	R$2.60	\N	\N	\N	2017-04-10 23:00:00+05:30	\N	{"order_accepted": "2017-04-10T08:43:16.858Z", "order_requested": "2017-04-10T08:35:45.874Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489760597225505161": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:05:43.778812+05:30	2017-04-10 14:13:16.741838+05:30
808	1488610936175460935	R$20.60	\N	\N	\N	2017-04-09 00:30:00+05:30	\N	{"order_paid": "2017-04-08T18:36:25.701Z", "order_ready": "2017-04-08T18:37:39.842Z", "order_accepted": "2017-04-08T18:33:30.453Z", "order_delivered": "2017-04-18T19:33:02.325Z", "order_requested": "2017-04-08T18:31:41.222Z", "order_dispatched": "2017-04-14T14:53:11.256Z"}	\N	\N	f	t	2017-04-09 00:45:00+05:30	11	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Prudente de Morais, 5950 - Candelária, Natal - RN", "address2": null, "nickname": "Subway"}	22	\N	{"1488610938658488904": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1488610940487205449": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-09 00:01:38.574378+05:30	2017-04-19 01:03:02.204436+05:30
839	1490574104531567592	R$12.60	\N	\N	\N	2017-04-12 02:05:00+05:30	\N	{"order_declined": "2017-04-11T11:33:57.645Z", "order_requested": "2017-04-11T11:32:01.003Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490574107509523433": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 17:01:58.878596+05:30	2017-04-11 17:03:57.538799+05:30
809	1488615647536480852	R$12.60	\N	\N	\N	2017-04-09 00:40:00+05:30	\N	{"order_paid": "2017-04-08T18:43:15.871Z", "order_cooking": "2017-04-08T18:43:32.205Z", "order_accepted": "2017-04-08T18:42:08.521Z", "order_delivered": "2017-04-14T14:52:55.275Z", "order_requested": "2017-04-08T18:40:55.566Z"}	\N	\N	f	t	2017-04-09 00:55:00+05:30	8	{"city": "Natal", "phone": "Jim / 444-3636", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2895", "address2": "null", "nickname": "Nordestao"}	23	\N	{"1488615649985954389": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-09 00:10:53.343784+05:30	2017-04-14 20:22:55.1625+05:30
815	1489761134138360206	R$9.60	\N	\N	\N	2017-04-10 23:00:00+05:30	\N	{"order_declined": "2017-04-10T08:51:03.400Z", "order_requested": "2017-04-10T08:36:33.580Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489761136487170447": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:06:31.508649+05:30	2017-04-10 14:21:03.301695+05:30
816	1489761323603460496	R$24.60	\N	\N	\N	2017-04-10 23:00:00+05:30	\N	{"order_accepted": "2017-04-10T08:59:42.786Z", "order_requested": "2017-04-10T08:37:02.194Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489761325943882129": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 2, "selections": {}}, "1489761327680323986": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:06:59.593495+05:30	2017-04-10 14:29:42.69086+05:30
956	1496426438117556470	R$18.60	\N	\N	\N	2017-04-20 15:50:00+05:30	\N	{"order_declined": "2017-04-19T13:23:02.777Z", "order_requested": "2017-04-19T13:19:47.317Z"}	\N	\N	f	t	2017-04-20 16:05:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore", "nickname": "Test Location"}	\N	\N	{"1496426440516698359": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1496426442437689592": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 18:49:44.531582+05:30	2017-04-19 18:53:02.677253+05:30
988	1498896606852808977	R$9.60	\N	\N	\N	2017-04-23 05:10:00+05:30	\N	{"order_paid": "2017-04-22T23:12:35.792Z", "order_ready": "2017-04-22T23:13:19.958Z", "order_cooking": "2017-04-22T23:12:45.623Z", "order_accepted": "2017-04-22T23:12:16.872Z", "order_picked_up": "2017-04-22T23:13:47.793Z", "order_requested": "2017-04-22T23:09:48.395Z"}	\N	1492902755	f	f	\N	\N	\N	\N	\N	{"1498896609503609106": {"title": "Buffalo Wings", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-23 04:39:45.878795+05:30	2017-04-23 04:43:47.666198+05:30
989	1498902050900017427	R$13.60	\N	\N	\N	2017-04-23 05:20:00+05:30	\N	{"order_paid": "2017-04-22T23:19:37.970Z", "order_ready": "2017-04-23T01:15:19.705Z", "order_cooking": "2017-04-23T01:15:00.599Z", "order_accepted": "2017-04-22T23:19:02.860Z", "order_picked_up": "2017-04-23T01:15:50.312Z", "order_requested": "2017-04-22T23:18:00.946Z"}	\N	1492903177	f	f	\N	\N	\N	\N	\N	{"1498902053424988436": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-23 04:47:58.477601+05:30	2017-04-23 06:45:50.213868+05:30
825	1489816225289601488	R$20.60	\N	\N	\N	2017-04-11 01:00:00+05:30	\N	{"order_accepted": "2017-04-11T10:52:47.433Z", "order_requested": "2017-04-10T10:26:09.389Z"}	\N	\N	f	t	2017-04-11 01:15:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1489816227596468689": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1489816229324521938": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-10 15:56:06.808617+05:30	2017-04-11 16:22:47.349646+05:30
819	1489786282002350505	R$43.60	\N	\N	\N	2017-04-10 23:50:00+05:30	\N	{"order_declined": "2017-04-10T09:27:21.053Z", "order_requested": "2017-04-10T09:26:34.943Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489786289543709098": {"title": "sdsdsd", "options": [], "quantity": 2, "selections": {}}, "1489786294912418219": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 2, "selections": {}}, "1489786299945583020": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 2, "selections": {}}, "1489786305918271917": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:56:31.648448+05:30	2017-04-10 14:57:20.971078+05:30
823	1489807553473806784	R$24.60	\N	\N	\N	2017-04-11 00:40:00+05:30	\N	{"order_declined": "2017-04-11T10:44:26.056Z", "order_requested": "2017-04-10T10:08:50.306Z"}	\N	\N	f	t	2017-04-11 00:55:00+05:30	3	{"city": "Natal", "phone": "Cliff / 444-3636", "state": "RN", "address1": "123 Drummond St", "address2": "Apt 2000", "nickname": "Tango"}	\N	\N	{"1489807555931668929": {"title": "New", "options": [], "quantity": 1, "selections": {}}, "1489807557693276610": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1489807560243413443": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-10 15:38:47.378001+05:30	2017-04-11 16:14:25.948794+05:30
824	1489814224665313732	R$20.60	\N	\N	\N	2017-04-11 00:55:00+05:30	\N	{"order_declined": "2017-04-11T10:52:37.886Z", "order_requested": "2017-04-10T10:22:27.291Z"}	\N	\N	f	t	2017-04-11 01:10:00+05:30	1	{"city": "Natal", "phone": "Mary / 555-9988", "state": "RN", "address1": "Rua da Campina 140", "address2": "Apt 2203", "nickname": "Verano Condominium"}	\N	\N	{"1489814226997346757": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1489814228725400006": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-10 15:52:24.651597+05:30	2017-04-11 16:22:37.79011+05:30
826	1489816756850524627	R$12.60	\N	\N	\N	2017-04-11 01:00:00+05:30	\N	{"order_declined": "2017-04-11T10:53:07.350Z", "order_requested": "2017-04-10T10:27:06.316Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489816759190946260": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-10 15:57:04.167369+05:30	2017-04-11 16:23:07.248101+05:30
842	1490581883212268526	R$12.60	\N	\N	\N	2017-04-12 02:20:00+05:30	\N	{"order_declined": "2017-04-11T11:49:26.630Z", "order_requested": "2017-04-11T11:47:14.445Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490581886282499055": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 17:17:12.331494+05:30	2017-04-11 17:19:26.529536+05:30
817	1489781890759000480	R$20.60	\N	\N	\N	2017-04-10 23:40:00+05:30	\N	{"order_declined": "2017-04-10T10:34:09.733Z", "order_requested": "2017-04-10T09:18:27.211Z"}	\N	\N	f	t	2017-04-10 23:55:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore", "nickname": "Test Location"}	\N	\N	{"1489781893057479073": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1489781895053967778": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1489781896798798243": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:48:24.089787+05:30	2017-04-10 16:04:09.648382+05:30
821	1489794724624597428	R$34.60	\N	\N	\N	2017-04-11 00:15:00+05:30	\N	{"order_declined": "2017-04-10T10:47:40.283Z", "order_requested": "2017-04-10T09:44:26.883Z"}	\N	\N	f	t	2017-04-11 00:30:00+05:30	3	{"city": "Natal", "phone": "Cliff / 444-3636", "state": "RN", "address1": "123 Drummond St", "address2": "Apt 2000", "nickname": "Tango"}	\N	\N	{"1489794726956630453": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1489794728701460918": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1489794730454679991": {"title": "New", "options": [], "quantity": 1, "selections": {}}, "1489794732258230712": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-10 15:14:23.556948+05:30	2017-04-10 16:17:40.211963+05:30
840	1490578529128023018	R$12.60	\N	\N	\N	2017-04-12 02:10:00+05:30	\N	{"order_declined": "2017-04-11T11:48:58.460Z", "order_requested": "2017-04-11T11:40:35.803Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490578531543942123": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 17:10:33.655677+05:30	2017-04-11 17:18:58.355429+05:30
822	1489801128638939577	R$13.60	\N	\N	\N	2017-04-11 00:30:00+05:30	\N	{"order_declined": "2017-04-11T10:43:58.279Z", "order_requested": "2017-04-10T10:02:11.122Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1489801131432346042": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-10 15:32:08.984862+05:30	2017-04-11 16:13:58.157574+05:30
818	1489785594136494500	R$27.60	\N	\N	\N	2017-04-10 23:45:00+05:30	\N	{"order_declined": "2017-04-10T10:39:05.262Z", "order_requested": "2017-04-10T09:25:16.925Z"}	\N	\N	f	t	2017-04-11 00:00:00+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1489785603020030373": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1489785609160491430": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1489785614797636007": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}, "1489785620468335016": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 14:55:12.462948+05:30	2017-04-10 16:09:05.170801+05:30
831	1490529219355083688	R$2.60	\N	\N	\N	2017-04-12 00:25:00+05:30	\N	{"order_declined": "2017-04-11T10:05:34.847Z", "order_requested": "2017-04-11T10:02:41.430Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490529221880054697": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 15:32:39.332339+05:30	2017-04-11 15:35:34.762506+05:30
837	1490555589523145693	R$12.60	\N	\N	\N	2017-04-12 01:25:00+05:30	\N	{"order_declined": "2017-04-11T10:55:20.872Z", "order_requested": "2017-04-11T10:55:00.030Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490555591863567326": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 16:24:57.851779+05:30	2017-04-11 16:25:20.763076+05:30
829	1490507580638757770	R$9.60	\N	\N	\N	2017-04-11 23:40:00+05:30	\N	{"order_declined": "2017-04-11T09:25:47.826Z", "order_requested": "2017-04-11T09:20:00.187Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490507582962402187": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 14:49:57.349958+05:30	2017-04-11 14:55:47.71993+05:30
834	1490548335935751122	R$8.60	\N	\N	\N	2017-04-12 01:00:00+05:30	\N	{"order_declined": "2017-04-11T10:41:07.731Z", "order_requested": "2017-04-11T10:40:37.997Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490548338351670227": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 16:10:34.981938+05:30	2017-04-11 16:11:07.643968+05:30
832	1490534758587827115	R$9.60	\N	\N	\N	2017-04-12 00:35:00+05:30	\N	{"order_declined": "2017-04-11T10:17:51.546Z", "order_requested": "2017-04-11T10:13:53.370Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490534760936637356": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 15:43:50.609254+05:30	2017-04-11 15:47:51.462261+05:30
830	1490511277758350221	R$2.60	\N	\N	\N	2017-04-11 23:50:00+05:30	\N	{"order_declined": "2017-04-11T09:37:52.197Z", "order_requested": "2017-04-11T09:26:58.221Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490511280123937678": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 14:56:56.054816+05:30	2017-04-11 15:07:52.09338+05:30
827	1489824600509383127	R$20.60	\N	\N	\N	2017-04-11 01:05:00+05:30	\N	{"order_declined": "2017-04-11T09:39:38.703Z", "order_requested": "2017-04-10T10:42:57.992Z"}	\N	\N	f	t	2017-04-11 01:20:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore", "nickname": "Test Location"}	\N	\N	{"1489824602916913624": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1489824604644966873": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1489824606448517594": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-10 16:12:55.094453+05:30	2017-04-11 15:09:38.618709+05:30
836	1490553046835397593	R$8.60	\N	\N	\N	2017-04-12 01:10:00+05:30	\N	{"order_declined": "2017-04-11T10:50:18.287Z", "order_requested": "2017-04-11T10:49:58.919Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490553049184207834": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 16:19:56.858427+05:30	2017-04-11 16:20:18.196414+05:30
835	1490549895478641620	R$13.60	\N	\N	\N	2017-04-12 01:15:00+05:30	\N	{"order_declined": "2017-04-11T10:44:36.370Z", "order_requested": "2017-04-11T10:43:45.409Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490549897835840469": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-11 16:13:43.311892+05:30	2017-04-11 16:14:36.274295+05:30
833	1490541481964864462	R$8.60	\N	\N	\N	2017-04-12 00:50:00+05:30	\N	{"order_declined": "2017-04-11T10:27:50.176Z", "order_requested": "2017-04-11T10:27:16.605Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490541484330451919": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-11 15:57:14.346416+05:30	2017-04-11 15:57:50.059166+05:30
838	1490558462050960358	R$12.60	\N	\N	\N	2017-04-12 01:30:00+05:30	\N	{"order_declined": "2017-04-11T11:06:19.956Z", "order_requested": "2017-04-11T11:01:04.958Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490558465314128871": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 16:31:02.781165+05:30	2017-04-11 16:36:19.877422+05:30
957	1496427604419281145	R$16.60	\N	\N	\N	2017-04-20 15:55:00+05:30	\N	{"order_declined": "2017-04-19T13:22:50.404Z", "order_requested": "2017-04-19T13:21:44.181Z"}	\N	\N	f	t	2017-04-20 16:10:00+05:30	9	{"city": "Natal", "phone": "999-5555", "state": "RN", "address1": "Av. Sen. Salgado Filho, 2234 - 400 - Candelária, Natal - RN, 59064-900", "address2": "null", "nickname": "Natal Shopping"}	\N	\N	{"1496427606860366074": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1496427608672305403": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 18:51:41.200689+05:30	2017-04-19 18:52:50.990874+05:30
841	1490581001728951276	R$12.60	\N	\N	\N	2017-04-12 02:15:00+05:30	\N	{"order_declined": "2017-04-11T11:49:41.534Z", "order_requested": "2017-04-11T11:45:32.000Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490581004086150125": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-11 17:15:29.809408+05:30	2017-04-11 17:19:41.450059+05:30
1002	1499879876574839438	R$11.60	\N	\N	\N	2017-04-24 22:10:00+05:30	\N	{"order_declined": "2017-04-26T10:09:22.700Z", "order_requested": "2017-04-24T07:40:44.818Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499879879284359823": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-24 13:10:42.404042+05:30	2017-04-26 15:39:22.607998+05:30
1004	1499889845865022102	R$9.60	\N	\N	\N	2017-04-24 22:30:00+05:30	\N	{"order_declined": "2017-04-24T08:02:53.725Z", "order_requested": "2017-04-24T08:00:38.234Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499889848473879193": {"title": "Green Curry Regular", "options": [], "quantity": 1, "selections": {"Sauce": "Regular"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-24 13:30:35.609241+05:30	2017-04-24 13:32:53.625022+05:30
853	1491366834555847125	R$10.60	\N	\N	\N	2017-04-13 04:10:00+05:30	\N	{"order_accepted": "2017-04-12T13:47:46.293Z", "order_requested": "2017-04-12T13:46:57.643Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491366836887880150": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491366838674653655": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 19:16:53.791592+05:30	2017-04-12 19:17:46.210111+05:30
852	1491362897664672207	R$10.60	\N	\N	\N	2017-04-13 04:00:00+05:30	\N	{"order_accepted": "2017-04-12T13:42:56.847Z", "order_requested": "2017-04-12T13:39:22.044Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491362899996705232": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491362901766701521": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 19:09:19.052754+05:30	2017-04-12 19:12:56.767371+05:30
845	1491270052173840799	R$4.60	\N	\N	\N	2017-04-13 00:55:00+05:30	\N	{"order_declined": "2017-04-12T13:37:39.319Z", "order_requested": "2017-04-12T10:35:00.550Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491270055403454880": {"title": "sdsdsd", "options": [], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 16:04:58.345268+05:30	2017-04-12 19:07:39.205808+05:30
847	1491295616741933477	R$8.60	\N	\N	\N	2017-04-13 01:45:00+05:30	\N	{"order_accepted": "2017-04-12T11:26:54.674Z", "order_requested": "2017-04-12T11:25:18.940Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491295619099132326": {"title": "sdsdsd", "options": [], "quantity": 7, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 16:55:15.727355+05:30	2017-04-12 16:56:54.563729+05:30
849	1491311350364766636	R$12.60	\N	\N	\N	2017-04-13 02:30:00+05:30	\N	{"order_accepted": "2017-04-12T11:57:36.047Z", "order_requested": "2017-04-12T11:56:50.362Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491311352797462957": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-12 17:26:47.044033+05:30	2017-04-12 17:27:35.943226+05:30
848	1491302123013406864	R$11.60	\N	\N	\N	2017-04-12 17:55:00+05:30	\N	{"order_accepted": "2017-04-12T11:38:52.526Z", "order_requested": "2017-04-12T11:38:14.332Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491302125504823441": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-12 17:08:12.095257+05:30	2017-04-12 17:08:52.442029+05:30
846	1491270585873858977	R$7.60	\N	\N	\N	2017-04-13 00:55:00+05:30	\N	{"order_declined": "2017-04-12T13:37:53.719Z", "order_requested": "2017-04-12T10:35:37.954Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491270588256223650": {"title": "sdsdsd", "options": [], "quantity": 6, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 16:05:35.888746+05:30	2017-04-12 19:07:53.614796+05:30
850	1491350476317262282	R$12.60	\N	\N	\N	2017-04-13 03:45:00+05:30	\N	{"order_accepted": "2017-04-12T13:15:33.242Z", "order_requested": "2017-04-12T13:14:20.121Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491350478682849739": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-12 18:44:17.611713+05:30	2017-04-12 18:45:33.139965+05:30
854	1491372159233163736	R$9.60	\N	\N	\N	2017-04-13 04:20:00+05:30	\N	{"order_accepted": "2017-04-12T13:58:29.542Z", "order_requested": "2017-04-12T13:57:44.804Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491372161607139801": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 19:27:42.708921+05:30	2017-04-12 19:28:29.43157+05:30
851	1491358520866505164	R$10.60	\N	\N	\N	2017-04-13 03:55:00+05:30	\N	{"order_declined": "2017-04-12T13:38:03.355Z", "order_requested": "2017-04-12T13:30:17.437Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491358523215315405": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1491358524976923086": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}}	\N	testerqr q	9017	2075	Grilla Cheez	1008	2017-04-12 19:00:14.701572+05:30	2017-04-12 19:08:03.276051+05:30
855	1491373794701345242	R$10.60	\N	\N	\N	2017-04-13 04:25:00+05:30	\N	{"order_accepted": "2017-04-12T14:02:16.668Z", "order_requested": "2017-04-12T14:00:57.790Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491373797134041563": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491373799013089756": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-12 19:30:54.96832+05:30	2017-04-12 19:32:16.509355+05:30
859	1491911209824289464	R$10.60	\N	\N	\N	2017-04-14 00:50:00+05:30	\N	{"order_accepted": "2017-04-13T07:49:30.328Z", "order_requested": "2017-04-13T07:48:56.239Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491911212886131385": {"title": "Mongolian Beef with Cashews White", "options": [], "quantity": 1, "selections": {"Rice": "White"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-13 13:18:54.05474+05:30	2017-04-13 13:19:30.231887+05:30
1006	1499893351942455966	R$13.60	\N	\N	\N	2017-04-24 22:40:00+05:30	\N	{"order_declined": "2017-04-24T08:14:53.199Z", "order_requested": "2017-04-24T08:07:31.075Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499893354559701663": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 13:37:28.761143+05:30	2017-04-24 13:44:53.108431+05:30
843	1490695627728748609	R$22.60	\N	\N	\N	2017-04-11 21:35:00+05:30	\N	{"order_paid": "2017-04-11T15:39:48.696Z", "order_ready": "2017-04-13T18:19:56.258Z", "order_cooking": "2017-04-11T15:46:54.944Z", "order_accepted": "2017-04-11T15:34:35.606Z", "order_picked_up": "2017-04-15T11:04:44.747Z", "order_requested": "2017-04-11T15:33:53.197Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1490695630220165186": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1490695632174710851": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-11 21:03:50.03746+05:30	2017-04-15 16:34:44.626653+05:30
1005	1499892910198358684	R$13.60	\N	\N	\N	2017-04-24 22:40:00+05:30	\N	{"order_declined": "2017-04-24T08:14:33.987Z", "order_requested": "2017-04-24T08:06:42.988Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499892912689775261": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 13:36:40.647634+05:30	2017-04-24 13:44:33.875303+05:30
862	1491951254312583893	R$10.60	\N	\N	\N	2017-04-14 02:00:00+05:30	\N	{"order_accepted": "2017-04-13T09:14:34.053Z", "order_requested": "2017-04-13T09:08:11.426Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491951256762057430": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491951259010204375": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 14:38:08.912982+05:30	2017-04-13 14:44:33.941666+05:30
863	1491957236413498073	R$9.60	\N	\N	\N	2017-04-14 02:10:00+05:30	\N	{"order_accepted": "2017-04-13T09:20:41.790Z", "order_requested": "2017-04-13T09:20:22.383Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491957238787474138": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491957240532304603": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 14:50:19.532815+05:30	2017-04-13 14:50:41.691282+05:30
869	1492009199637365525	R$16.60	\N	\N	\N	2017-04-14 01:25:00+05:30	\N	{"order_accepted": "2017-04-13T11:04:14.479Z", "order_requested": "2017-04-13T11:03:24.733Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492009202002952982": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1492009203991053079": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 16:33:21.059881+05:30	2017-04-13 16:34:14.375412+05:30
867	1491985294545650430	R$16.60	\N	\N	\N	2017-04-14 03:05:00+05:30	\N	{"order_accepted": "2017-04-13T10:21:48.077Z", "order_requested": "2017-04-13T10:15:57.341Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491985296978346751": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1491985298731565824": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 15:45:54.772118+05:30	2017-04-13 15:51:47.984258+05:30
864	1491960434008261340	R$10.60	\N	\N	\N	2017-04-14 02:15:00+05:30	\N	{"order_accepted": "2017-04-13T09:29:17.722Z", "order_requested": "2017-04-13T09:26:10.715Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491960436373848797": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491960438194176734": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 14:56:08.283671+05:30	2017-04-13 14:59:17.629304+05:30
865	1491963161094390495	R$9.60	\N	\N	\N	2017-04-14 02:25:00+05:30	\N	{"order_accepted": "2017-04-13T09:34:33.105Z", "order_requested": "2017-04-13T09:31:36.528Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491963164030403296": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491963165968171745": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 15:01:34.039028+05:30	2017-04-13 15:04:32.992425+05:30
871	1492022032144007964	R$19.60	\N	\N	\N	2017-04-14 02:00:00+05:30	\N	{"order_accepted": "2017-04-13T11:29:31.743Z", "order_requested": "2017-04-13T11:28:51.769Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492022034509595421": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1492022036329923358": {"title": "New", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 16:58:49.206378+05:30	2017-04-13 16:59:31.649106+05:30
868	1491990354428166913	R$17.60	\N	\N	\N	2017-04-14 03:15:00+05:30	\N	{"order_accepted": "2017-04-13T11:00:59.373Z", "order_requested": "2017-04-13T10:26:03.547Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491990357271905026": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}, "1491990359176119043": {"title": "Pork Slider \\"Tuesday\\" Avalanche", "options": [], "quantity": 1, "selections": {}}, "1491990361030001412": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 15:56:00.393544+05:30	2017-04-13 16:30:59.243749+05:30
866	1491969579226759915	R$10.60	\N	\N	\N	2017-04-14 02:35:00+05:30	\N	{"order_declined": "2017-04-13T10:06:11.313Z", "order_requested": "2017-04-13T09:44:27.329Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1491969582498317036": {"title": "sdsdsd", "options": [], "quantity": 1, "selections": {}}, "1491969585082008301": {"title": "BBQ Rib Wednesday", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2075	Grilla Cheez	1008	2017-04-13 15:14:24.754806+05:30	2017-04-13 15:36:11.216323+05:30
870	1492015826302141208	R$23.60	\N	\N	\N	2017-04-14 01:50:00+05:30	\N	{"order_accepted": "2017-04-13T11:17:43.648Z", "order_requested": "2017-04-13T11:16:47.415Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492015828961329945": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1492015831536632602": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 16:46:44.806297+05:30	2017-04-13 16:47:43.531553+05:30
874	1492051487868584751	R$57.60	\N	\N	\N	2017-04-14 03:00:00+05:30	\N	{"order_accepted": "2017-04-13T12:29:04.089Z", "order_requested": "2017-04-13T12:27:06.366Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492051490267726640": {"title": "New", "options": [], "quantity": 2, "selections": {}}, "1492051492104831793": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}, "1492051493891605298": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 17:57:03.466552+05:30	2017-04-13 17:59:16.021305+05:30
873	1492033329476666148	R$23.60	\N	\N	\N	2017-04-14 02:25:00+05:30	\N	{"order_accepted": "2017-04-13T11:52:15.835Z", "order_requested": "2017-04-13T11:51:30.255Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492033331850642213": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1492033333603861286": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 17:21:27.129877+05:30	2017-04-13 17:22:15.731964+05:30
872	1492028650772497183	R$23.60	\N	\N	\N	2017-04-14 02:15:00+05:30	\N	{"order_accepted": "2017-04-13T11:42:21.018Z", "order_requested": "2017-04-13T11:41:45.050Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492028653070975776": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1492028655671444257": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 17:11:42.551214+05:30	2017-04-13 17:12:20.924598+05:30
890	1492792852357316817	R$12.60	\N	\N	\N	2017-04-15 03:30:00+05:30	\N	{"order_accepted": "2017-04-14T13:00:49.341Z", "order_requested": "2017-04-14T13:00:25.620Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492792854764847314": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 18:30:23.4252+05:30	2017-04-14 18:30:49.247228+05:30
891	1492798817328693459	R$12.60	\N	\N	\N	2017-04-15 03:45:00+05:30	\N	{"order_accepted": "2017-04-14T13:12:11.737Z", "order_requested": "2017-04-14T13:11:55.827Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492798819736223956": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 18:41:53.61148+05:30	2017-04-14 18:42:11.641783+05:30
844	1490836234715529312	R$27.60	\N	\N	\N	2017-04-12 02:15:00+05:30	\N	{"order_accepted": "2017-04-13T12:28:44.144Z", "order_requested": "2017-04-11T20:12:40.134Z"}	\N	\N	f	t	2017-04-12 02:30:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1490836237232111713": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1490836239119548514": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1490836240998596707": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-12 01:42:37.042646+05:30	2017-04-13 17:58:44.060251+05:30
875	1492062631849100098	R$10.60	\N	\N	\N	2017-04-14 05:50:00+05:30	\N	{"order_accepted": "2017-04-13T12:50:17.764Z", "order_requested": "2017-04-13T12:49:42.400Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492062634315350853": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-13 18:19:40.088649+05:30	2017-04-13 18:20:17.660554+05:30
882	1492719480759910560	R$12.60	\N	\N	\N	2017-04-15 03:35:00+05:30	\N	{"order_accepted": "2017-04-14T10:41:09.373Z", "order_requested": "2017-04-14T10:34:36.734Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492719483175829665": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 16:04:34.405713+05:30	2017-04-14 16:11:09.25029+05:30
876	1492067603349242707	R$23.60	\N	\N	\N	2017-04-14 06:00:00+05:30	\N	{"order_accepted": "2017-04-13T13:00:35.140Z", "order_requested": "2017-04-13T12:59:34.881Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492067605731607380": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1492067607493215061": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-13 18:29:32.385149+05:30	2017-04-13 18:30:35.023281+05:30
884	1492749019271659712	R$12.60	\N	\N	\N	2017-04-15 04:35:00+05:30	\N	{"order_declined": "2017-04-14T11:40:37.561Z", "order_requested": "2017-04-14T11:33:59.386Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492749021687578817": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 17:03:57.202727+05:30	2017-04-14 17:10:37.452049+05:30
877	1492092679197032714	R$22.60	\N	\N	\N	2017-04-13 19:50:00+05:30	\N	{"order_accepted": "2017-04-13T13:49:57.287Z", "order_requested": "2017-04-13T13:49:32.297Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492092681688449291": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1492092683567497484": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-13 19:19:27.106237+05:30	2017-04-13 19:19:57.199676+05:30
883	1492743166757961917	R$12.60	\N	\N	\N	2017-04-15 04:20:00+05:30	\N	{"order_accepted": "2017-04-14T11:21:40.591Z", "order_requested": "2017-04-14T11:21:19.732Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492743169157103806": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 16:51:17.548265+05:30	2017-04-14 16:51:40.481749+05:30
878	1492094868095239032	R$12.60	\N	\N	\N	2017-04-14 06:55:00+05:30	\N	{"order_accepted": "2017-04-13T13:57:12.552Z", "order_requested": "2017-04-13T13:56:13.627Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492094870452437881": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-13 19:26:10.555788+05:30	2017-04-13 19:27:12.445378+05:30
881	1492485821880599539	R$23.60	\N	\N	\N	2017-04-14 17:20:00+05:30	\N	{"order_declined": "2017-04-14T12:48:50.751Z", "order_requested": "2017-04-14T02:50:25.749Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492485824212632564": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1492485825957463029": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-14 08:20:22.270289+05:30	2017-04-14 18:18:50.611635+05:30
887	1492779239945011401	R$12.60	\N	\N	\N	2017-04-15 05:35:00+05:30	\N	{"order_accepted": "2017-04-14T12:33:38.479Z", "order_requested": "2017-04-14T12:33:15.779Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492779242402873546": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 18:03:13.593868+05:30	2017-04-14 18:03:38.358766+05:30
886	1492769656958615751	R$12.60	\N	\N	\N	2017-04-15 05:15:00+05:30	\N	{"order_accepted": "2017-04-14T12:14:27.826Z", "order_requested": "2017-04-14T12:13:58.046Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492769659399700680": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 17:43:55.842657+05:30	2017-04-14 17:44:27.725502+05:30
885	1492759884616171716	R$12.60	\N	\N	\N	2017-04-15 04:55:00+05:30	\N	{"order_accepted": "2017-04-14T11:55:09.757Z", "order_requested": "2017-04-14T11:54:35.261Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492759887090811077": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 17:24:32.766985+05:30	2017-04-14 17:25:09.6396+05:30
888	1492788330218127565	R$13.60	\N	\N	\N	2017-04-15 03:20:00+05:30	\N	{"order_accepted": "2017-04-14T12:52:15.070Z", "order_requested": "2017-04-14T12:51:54.034Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492788332642435278": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-14 18:21:51.958643+05:30	2017-04-14 18:22:14.9885+05:30
889	1492789700883120335	R$12.60	\N	\N	\N	2017-04-15 03:25:00+05:30	\N	{"order_accepted": "2017-04-14T12:54:19.515Z", "order_requested": "2017-04-14T12:53:52.045Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492789703282262224": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 18:23:49.605362+05:30	2017-04-14 18:24:19.436592+05:30
1057	1501386809261686982	R$15.60	\N	\N	\N	2017-04-27 00:05:00+05:30	\N	{"order_declined": "2017-04-26T10:08:46.715Z", "order_requested": "2017-04-26T09:35:15.502Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501386811702771911": {"title": "French Dip", "options": ["French Fries", "Extra Au Jus"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 15:05:13.153763+05:30	2017-04-26 15:38:46.613966+05:30
1059	1501397578657300684	R$11.60	\N	\N	\N	2017-04-27 00:30:00+05:30	\N	{"order_declined": "2017-04-26T10:08:55.185Z", "order_requested": "2017-04-26T09:56:27.020Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501397581115162829": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 15:26:24.394714+05:30	2017-04-26 15:38:55.081301+05:30
880	1492231254211297578	R$8.60	\N	\N	\N	2017-04-14 00:50:00+05:30	\N	{"no_show": "2017-04-14T14:54:22.668Z", "order_paid": "2017-04-13T18:27:41.685Z", "order_accepted": "2017-04-13T18:25:05.305Z", "order_requested": "2017-04-13T18:24:23.939Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492231256836931883": {"title": "Buffalo Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2132	Crazy Jack's	1109	2017-04-13 23:54:21.712174+05:30	2017-04-14 20:24:22.57026+05:30
893	1492817031446134999	R$12.60	\N	\N	\N	2017-04-15 04:20:00+05:30	\N	{"order_accepted": "2017-04-14T13:48:26.969Z", "order_requested": "2017-04-14T13:48:05.571Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1492817033920774360": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 19:18:03.40832+05:30	2017-04-14 19:18:26.910627+05:30
928	1495478781098328747	R$13.60	\N	\N	\N	2017-04-18 20:30:00+05:30	\N	{"no_show": "2017-04-18T09:37:18.766Z", "order_paid": "2017-04-18T05:58:01.633Z", "order_accepted": "2017-04-18T05:57:48.669Z", "order_requested": "2017-04-18T05:57:00.962Z"}	\N	1492495079	f	f	\N	\N	\N	\N	\N	{"1495478783463916204": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 11:26:58.654407+05:30	2017-04-18 15:07:18.028715+05:30
797	1487938853703516629	R$24.60	\N	\N	\N	2017-04-08 02:15:00+05:30	\N	{"order_paid": "2017-04-07T20:21:49.747Z", "order_ready": "2017-04-07T20:36:00.085Z", "order_cooking": "2017-04-07T20:22:19.400Z", "order_accepted": "2017-04-07T20:19:09.110Z", "order_picked_up": "2017-04-14T14:52:35.057Z", "order_requested": "2017-04-07T20:16:10.833Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1487938856228487638": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1487938858141090263": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}, "1487938859986584024": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-08 01:46:07.744988+05:30	2017-04-14 20:22:34.937887+05:30
976	1497340197476500396	R$12.60	\N	\N	\N	2017-04-21 01:35:00+05:30	\N	{"order_paid": "2017-04-20T19:37:07.359Z", "order_ready": "2017-04-20T19:40:27.427Z", "order_cooking": "2017-04-20T19:37:54.505Z", "order_accepted": "2017-04-20T19:36:58.657Z", "order_picked_up": "2017-04-20T19:41:14.749Z", "order_requested": "2017-04-20T19:35:55.044Z"}	\N	1492717028	f	f	\N	\N	\N	\N	\N	{"1497340200664171437": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-21 01:05:52.166051+05:30	2017-04-21 01:11:14.633706+05:30
894	1492835161442615828	R$19.60	\N	\N	\N	2017-04-14 20:25:00+05:30	\N	{"order_paid": "2017-04-14T14:25:47.814Z", "order_cooking": "2017-04-15T11:22:23.369Z", "order_accepted": "2017-04-14T14:25:41.308Z", "order_picked_up": "2017-04-15T14:20:25.147Z", "order_requested": "2017-04-14T14:24:36.722Z"}	\N	1492179952	f	f	\N	\N	\N	\N	\N	{"1492835164026307093": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1492835165955686934": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-14 19:54:33.906757+05:30	2017-04-15 19:50:25.058219+05:30
895	1492842515802358295	R$22.60	\N	\N	\N	2017-04-14 20:40:00+05:30	\N	{"order_paid": "2017-04-14T14:40:00.314Z", "order_ready": "2017-04-14T14:59:20.079Z", "order_cooking": "2017-04-14T14:50:47.719Z", "order_accepted": "2017-04-14T14:39:53.699Z", "order_picked_up": "2017-04-14T15:01:34.846Z", "order_requested": "2017-04-14T14:39:10.232Z"}	\N	1492180804	f	f	\N	\N	\N	\N	\N	{"1492842519023583768": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1492842520919409177": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-14 20:09:06.935268+05:30	2017-04-14 20:31:34.763314+05:30
944	1495847981050495468	R$32.60	\N	\N	\N	2017-04-19 00:10:00+05:30	\N	{"order_paid": "2017-04-18T18:12:52.032Z", "order_ready": "2017-04-18T18:16:12.788Z", "order_cooking": "2017-04-18T18:15:57.874Z", "order_accepted": "2017-04-18T18:12:44.671Z", "order_delivered": "2017-04-18T19:32:37.010Z", "order_requested": "2017-04-18T18:10:28.772Z", "order_dispatched": "2017-04-18T18:17:29.571Z"}	\N	1492539172	f	t	2017-04-19 00:25:00+05:30	6	{"city": "Natal", "phone": "Bob / 444-3636", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 701, Capim Macio, Natal-RN", "address2": null, "nickname": "Ponta Negra Fiat"}	23	\N	{"1495847983558689261": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 2, "selections": {}}, "1495847985462903278": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}, "1495847987367117295": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-18 23:40:25.627329+05:30	2017-04-19 01:02:36.867477+05:30
968	1496987972971528921	R$16.60	\N	\N	\N	2017-04-20 22:25:00+05:30	\N	{"order_declined": "2017-04-20T08:58:05.308Z", "order_requested": "2017-04-20T07:55:17.165Z"}	\N	\N	f	t	2017-04-20 22:40:00+05:30	16	{"city": "This Is City", "phone": "123487978", "state": null, "address1": "This Is Address 1", "address2": "This Is Address 2", "nickname": "New Field Test"}	\N	\N	{"1496987975387448026": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1496987977199387355": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 13:25:13.807352+05:30	2017-04-20 14:28:05.229876+05:30
926	1495095796742226132	R$25.60	\N	\N	\N	2017-04-17 23:15:00+05:30	\N	{"order_paid": "2017-04-17T17:16:28.512Z", "order_accepted": "2017-04-17T17:16:20.336Z", "order_delivered": "2017-04-20T14:16:36.640Z", "order_requested": "2017-04-17T17:15:40.189Z"}	\N	1492449393	f	t	2017-04-17 23:30:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	22	\N	{"1495095799334306005": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 1, "selections": {}}, "1495095801238520022": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}, "1495095803394392279": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-17 22:45:35.849412+05:30	2017-04-20 19:46:36.516392+05:30
958	1496479320246321798	R$23.60	\N	\N	\N	2017-04-19 21:30:00+05:30	\N	{"order_accepted": "2017-04-20T13:55:21.894Z", "order_requested": "2017-04-19T15:04:26.160Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496479322930676359": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 2, "selections": {}}, "1496479325019439752": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-19 20:34:23.293751+05:30	2017-04-20 19:25:21.766852+05:30
1052	1501312671742427257	R$11.60	\N	\N	\N	2017-04-26 21:40:00+05:30	\N	{"order_declined": "2017-04-26T10:08:33.282Z", "order_requested": "2017-04-26T07:07:54.830Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501312674166734970": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 12:37:52.520038+05:30	2017-04-26 15:38:33.171104+05:30
899	1493409941816345318	R$22.60	\N	\N	\N	2017-04-15 15:45:00+05:30	\N	{"order_accepted": "2017-04-17T06:30:21.164Z", "order_requested": "2017-04-15T09:26:16.493Z"}	\N	\N	f	t	2017-04-15 16:00:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1493409944483922663": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}, "1493409946438468328": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}, "1493409948376236777": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-15 14:56:13.237431+05:30	2017-04-17 12:00:21.064361+05:30
986	1498853344771309831	R$24.60	\N	\N	\N	2017-04-23 03:55:00+05:30	\N	{"order_paid": "2017-04-22T21:43:08.584Z", "order_ready": "2017-04-22T22:01:10.285Z", "order_cooking": "2017-04-22T22:00:54.472Z", "order_accepted": "2017-04-22T21:43:00.320Z", "order_picked_up": "2017-04-22T22:01:40.994Z", "order_requested": "2017-04-22T21:42:08.451Z"}	\N	1492897393	f	f	\N	\N	\N	\N	\N	{"1498853347363389704": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 1, "selections": {}}, "1498853349410210057": {"title": "Pad Thai", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-23 03:12:05.754003+05:30	2017-04-23 03:31:40.88724+05:30
896	1493404080855319256	R$42.60	\N	\N	\N	2017-04-15 15:15:00+05:30	\N	{"order_accepted": "2017-04-15T09:54:13.227Z", "order_requested": "2017-04-15T09:15:03.828Z"}	\N	\N	f	t	2017-04-15 15:30:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1493404088220517081": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1493404094788797146": {"title": "Panang Curry", "options": ["Bamboo Shoots"], "quantity": 1, "selections": {}}, "1493404098219737819": {"title": "Pad Thai", "options": [], "quantity": 2, "selections": {}}, "1493404100325278428": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-15 14:44:59.994352+05:30	2017-04-15 15:24:13.128713+05:30
945	1495855139183919602	R$25.60	\N	\N	\N	2017-04-19 00:45:00+05:30	\N	{"order_paid": "2017-04-18T18:25:29.803Z", "order_ready": "2017-04-20T20:02:09.315Z", "order_cooking": "2017-04-18T18:28:47.665Z", "order_accepted": "2017-04-18T18:25:23.654Z", "order_delivered": "2017-04-21T14:24:47.698Z", "order_requested": "2017-04-18T18:24:35.511Z", "order_dispatched": "2017-04-20T20:02:15.555Z"}	\N	1492539930	f	t	2017-04-19 01:00:00+05:30	6	{"city": null, "phone": "Bob / 444-3636", "state": null, "address1": "Av. Engenheiro Roberto Freire, 701, Natal-RN", "address2": null, "nickname": "Ponta Negra Fiat"}	6	\N	{"1495855141700502003": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1495855143629881844": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1495855145634759157": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-18 23:54:31.81844+05:30	2017-04-21 19:54:47.585016+05:30
930	1495484925745300145	R$21.60	\N	\N	\N	2017-04-18 08:40:00+05:30	\N	{"order_accepted": "2017-04-18T06:14:48.725Z", "order_requested": "2017-04-18T06:10:08.912Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495484928144442034": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 11:40:06.172715+05:30	2017-04-18 11:44:48.381604+05:30
959	1496481680146301225	R$13.60	\N	\N	\N	2017-04-20 17:40:00+05:30	\N	{"order_declined": "2017-04-19T22:28:50.273Z", "order_requested": "2017-04-19T15:09:20.437Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496481682679660842": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 20:39:17.976951+05:30	2017-04-20 03:58:50.179814+05:30
967	1496979999800951510	R$18.60	\N	\N	\N	2017-04-20 22:10:00+05:30	\N	{"order_declined": "2017-04-20T08:58:14.656Z", "order_requested": "2017-04-20T07:39:27.489Z"}	\N	\N	f	t	2017-04-20 22:25:00+05:30	12	{"city": null, "phone": "546538497", "state": null, "address1": "17 Gyaneshwar", "address2": "Ind", "nickname": "Ashley"}	\N	\N	{"1496980002267202263": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1496980004087530200": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 13:09:24.455448+05:30	2017-04-20 14:28:14.584858+05:30
983	1498022608287826055	R$16.60	\N	\N	\N	2017-04-22 00:10:00+05:30	\N	{"order_paid": "2017-04-21T18:12:05.084Z", "order_ready": "2017-04-21T18:12:54.906Z", "order_cooking": "2017-04-21T18:12:43.083Z", "order_accepted": "2017-04-21T18:11:56.096Z", "order_picked_up": "2017-04-21T18:15:56.235Z", "order_requested": "2017-04-21T18:10:41.946Z"}	\N	1492798325	f	f	\N	\N	\N	\N	\N	{"1498022610854740104": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-21 23:40:39.694086+05:30	2017-04-21 23:45:56.010513+05:30
985	1498420224087556320	R$18.60	\N	\N	\N	2017-04-23 09:50:00+05:30	\N	{"order_declined": "2017-04-23T03:34:56.656Z", "order_requested": "2017-04-22T07:20:41.045Z"}	\N	\N	f	t	2017-04-23 10:05:00+05:30	15	{"city": null, "phone": "465329458", "state": null, "address1": "304, Princess Business Park", "address2": "Indore", "nickname": "Test Locations"}	\N	\N	{"1498420226537029857": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1498420228365746402": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-22 12:50:38.230884+05:30	2017-04-23 09:04:56.570368+05:30
1003	1499880415727452818	R$10.60	\N	\N	\N	2017-04-24 22:15:00+05:30	\N	{"order_declined": "2017-04-24T08:02:46.654Z", "order_requested": "2017-04-24T07:41:50.312Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499880418931901077": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-24 13:11:47.920899+05:30	2017-04-24 13:32:46.536922+05:30
1083	1502309133162905912	R$21.60	\N	\N	\N	2017-04-27 22:30:00+05:30	\N	{"order_accepted": "2017-04-27T16:12:57.246Z", "order_requested": "2017-04-27T16:07:37.941Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502309135855649081": {"title": "French Dip", "options": [], "quantity": 2, "selections": {}}}	\N	Luiz C	9021	2132	Crazy Jack's	1109	2017-04-27 21:37:35.424979+05:30	2017-04-27 21:42:57.139219+05:30
934	1495514091114988228	R$10.60	\N	\N	\N	2017-04-19 09:40:00+05:30	\N	{"order_paid": "2017-04-18T07:12:01.870Z", "order_ready": "2017-04-19T22:39:43.115Z", "order_cooking": "2017-04-19T22:39:20.732Z", "order_accepted": "2017-04-18T07:11:52.276Z", "order_picked_up": "2017-04-19T22:40:20.058Z", "order_requested": "2017-04-18T07:07:37.727Z"}	\N	1492542746	f	f	\N	\N	\N	\N	\N	{"1495514093505741509": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-18 12:37:35.381226+05:30	2017-04-20 04:10:19.965802+05:30
932	1495495926481945269	R$13.60	\N	\N	\N	2017-04-18 12:00:00+05:30	\N	{"no_show": "2017-04-18T09:37:31.842Z", "order_paid": "2017-04-18T06:33:27.352Z", "order_accepted": "2017-04-18T06:33:15.213Z", "order_requested": "2017-04-18T06:31:07.066Z"}	\N	1492464740	f	f	\N	\N	\N	\N	\N	{"1495495928889475766": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 12:01:04.726351+05:30	2017-04-18 15:07:31.763028+05:30
960	1496482950055723310	R$45.60	\N	\N	\N	2017-04-20 17:40:00+05:30	\N	{"order_declined": "2017-04-19T22:29:11.565Z", "order_requested": "2017-04-19T15:11:42.869Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496482952899461423": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}, "1496482955239883056": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 20:41:39.75835+05:30	2017-04-20 03:59:11.458489+05:30
931	1495491086120911539	R$37.60	\N	\N	\N	2017-04-18 11:50:00+05:30	\N	{"no_show": "2017-04-18T09:37:38.187Z", "order_paid": "2017-04-18T06:42:21.668Z", "order_accepted": "2017-04-18T06:42:13.230Z", "order_requested": "2017-04-18T06:21:25.419Z"}	\N	1492465274	f	f	\N	\N	\N	\N	\N	{"1495491088528442036": {"title": "Cuban Reuben", "options": [], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 11:51:23.192178+05:30	2017-04-18 15:07:38.094374+05:30
948	1495887207146193419	R$10.60	\N	\N	\N	2017-04-19 01:30:00+05:30	\N	{"order_paid": "2017-04-18T19:30:25.536Z", "order_ready": "2017-04-18T19:33:58.462Z", "order_cooking": "2017-04-18T19:33:40.797Z", "order_accepted": "2017-04-18T19:28:21.911Z", "order_picked_up": "2017-04-18T19:35:36.425Z", "order_requested": "2017-04-18T19:28:00.292Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495887209654387212": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2097	Frank's BBQ	1095	2017-04-19 00:57:57.967044+05:30	2017-04-19 01:05:36.261042+05:30
969	1496988708895720156	R$18.60	\N	\N	\N	2017-04-20 22:25:00+05:30	\N	{"order_declined": "2017-04-20T08:58:23.546Z", "order_requested": "2017-04-20T07:56:28.339Z"}	\N	\N	f	t	2017-04-20 22:40:00+05:30	5	{"city": null, "phone": "9893479705", "state": null, "address1": "304 Princess Park", "address2": "AB Road,  Indore", "nickname": "Test Location"}	\N	\N	{"1496988711311639261": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1496988713148744414": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 13:26:25.631162+05:30	2017-04-20 14:28:23.491492+05:30
970	1497022243681600230	R$16.60	\N	\N	\N	2017-04-21 11:35:00+05:30	\N	{"no_show": "2017-04-20T09:05:30.665Z", "order_paid": "2017-04-20T09:03:57.172Z", "order_ready": "2017-04-20T09:05:15.695Z", "order_cooking": "2017-04-20T09:05:02.730Z", "order_accepted": "2017-04-20T09:03:42.504Z", "order_requested": "2017-04-20T09:03:31.077Z", "order_dispatched": "2017-04-20T09:05:22.891Z"}	\N	1492722260	f	t	2017-04-21 11:50:00+05:30	16	{"city": "This Is City", "phone": "123487978", "state": null, "address1": "This Is Address 1", "address2": "This Is Address 2", "nickname": "New Field Test"}	\N	\N	{"1497022246382732007": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1497022248471495400": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 14:33:28.352554+05:30	2017-04-20 14:35:30.557893+05:30
933	1495506134075703995	R$23.60	\N	\N	\N	2017-04-18 12:20:00+05:30	\N	{"order_declined": "2017-04-18T08:46:59.237Z", "order_requested": "2017-04-18T06:50:56.524Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495506137154323132": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1495506139243086525": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 12:20:53.656374+05:30	2017-04-18 14:16:59.131017+05:30
962	1496624931222323901	R$36.60	\N	\N	\N	2017-04-20 02:20:00+05:30	\N	{"order_requested": "2017-04-19T19:55:54.635Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496624933864735422": {"title": "Cheese Enchiladas", "options": ["Rice and Beans", "Pico De Gallo"], "quantity": 1, "selections": {}}, "1496624935794115263": {"title": "Beef Tacos", "options": ["Extra Gaucamole"], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2133	Paco's Tacos	1110	2017-04-20 01:25:51.752883+05:30	2017-04-20 01:25:51.752883+05:30
961	1496484155272200501	R$25.60	\N	\N	\N	2017-04-20 17:45:00+05:30	\N	{"order_declined": "2017-04-20T08:58:32.539Z", "order_requested": "2017-04-19T15:14:03.692Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496484158048829750": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1496484159852380471": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 20:44:00.36118+05:30	2017-04-20 14:28:32.458901+05:30
1001	1499879017120006796	R$11.60	\N	\N	\N	2017-04-24 22:10:00+05:30	\N	{"order_declined": "2017-04-26T10:09:03.640Z", "order_requested": "2017-04-24T07:39:21.235Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499879019552703117": {"title": "Submariner Gargonzola", "options": [], "quantity": 1, "selections": {"Cheese": "Gargonzola"}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-24 13:09:18.851283+05:30	2017-04-26 15:39:03.528078+05:30
1058	1501392206752121032	R$7.60	\N	\N	\N	2017-04-27 00:15:00+05:30	\N	{"order_declined": "2017-04-26T10:09:30.146Z", "order_requested": "2017-04-26T09:45:52.894Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501392210032066761": {"title": "Vege Sub", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 15:15:50.229653+05:30	2017-04-26 15:39:30.039137+05:30
993	1499031042676228386	R$11.60	\N	\N	\N	2017-04-23 09:35:00+05:30	\N	{"order_paid": "2017-04-23T03:35:53.015Z", "order_ready": "2017-04-23T03:37:14.417Z", "order_cooking": "2017-04-23T03:36:33.325Z", "order_accepted": "2017-04-23T03:35:46.408Z", "order_picked_up": "2017-04-23T03:38:53.773Z", "order_requested": "2017-04-23T03:34:12.077Z"}	\N	1492918557	f	f	\N	\N	\N	\N	\N	{"1499031045167644963": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-23 09:04:09.93102+05:30	2017-04-23 09:08:53.672888+05:30
991	1498959562827366684	R$8.60	\N	\N	\N	2017-04-23 07:15:00+05:30	\N	{"order_accepted": "2017-04-23T01:12:53.096Z", "order_requested": "2017-04-23T01:12:14.021Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1498959565327171869": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-23 06:42:11.051022+05:30	2017-04-23 06:42:53.001641+05:30
955	1496425059005235836	R$23.60	\N	\N	\N	2017-04-19 19:15:00+05:30	\N	{"no_show": "2017-04-19T22:33:49.869Z", "order_paid": "2017-04-19T20:27:59.415Z", "order_accepted": "2017-04-19T20:27:51.620Z", "order_requested": "2017-04-19T13:16:38.087Z"}	\N	1492633679	f	f	\N	\N	\N	\N	\N	{"1496425061681201789": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}, "1496425063602193022": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-19 18:46:35.319744+05:30	2017-04-20 04:03:49.748528+05:30
901	1493512492238766832	R$12.60	\N	\N	\N	2017-04-15 18:50:00+05:30	\N	{"order_accepted": "2017-04-15T13:06:08.150Z", "order_requested": "2017-04-15T12:50:04.153Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1493512494956675825": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-15 18:20:01.369331+05:30	2017-04-15 18:36:08.045327+05:30
828	1489987365752538029	R$17.60	\N	\N	\N	2017-04-10 22:05:00+05:30	\N	{"order_paid": "2017-04-10T16:21:18.569Z", "order_cooking": "2017-04-12T11:54:12.458Z", "order_accepted": "2017-04-10T16:09:38.066Z", "order_delivered": "2017-04-15T14:19:30.295Z", "order_requested": "2017-04-10T16:06:35.785Z"}	\N	\N	f	t	2017-04-10 22:20:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	9	\N	{"1489987368185234350": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1489987370089448367": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-10 21:36:30.501354+05:30	2017-04-15 19:49:30.161576+05:30
902	1493558976711754482	R$24.60	\N	\N	\N	2017-04-15 20:25:00+05:30	\N	{"order_paid": "2017-04-15T14:22:45.680Z", "order_ready": "2017-04-16T17:45:32.348Z", "order_cooking": "2017-04-16T16:46:28.126Z", "order_accepted": "2017-04-15T14:22:38.798Z", "order_picked_up": "2017-04-16T17:52:09.166Z", "order_requested": "2017-04-15T14:22:15.062Z"}	\N	1492266170	f	f	\N	\N	\N	\N	\N	{"1493558982759940851": {"title": "Panang Curry", "options": ["Bamboo Shoots", "Miso Soup"], "quantity": 1, "selections": {}}, "1493558985343632116": {"title": "Pad Thai", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-15 19:52:12.432774+05:30	2017-04-16 23:22:09.027958+05:30
942	1495633972477035274	R$12.60	\N	\N	\N	2017-04-19 13:35:00+05:30	\N	{"order_paid": "2017-04-18T11:05:52.875Z", "order_ready": "2017-04-19T22:37:33.814Z", "order_cooking": "2017-04-19T22:37:06.884Z", "order_accepted": "2017-04-18T11:05:46.945Z", "order_picked_up": "2017-04-19T22:38:24.952Z", "order_requested": "2017-04-18T11:05:13.538Z"}	\N	1492556777	f	f	\N	\N	\N	\N	\N	{"1495633975102669579": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-18 16:35:10.317357+05:30	2017-04-20 04:08:24.408016+05:30
971	1497025906189796076	R$25.60	\N	\N	\N	2017-04-21 11:40:00+05:30	\N	{"order_paid": "2017-04-20T09:11:32.805Z", "order_ready": "2017-04-20T09:12:24.771Z", "order_cooking": "2017-04-20T09:11:47.455Z", "order_accepted": "2017-04-20T09:10:50.636Z", "order_picked_up": "2017-04-20T09:14:16.384Z", "order_requested": "2017-04-20T09:10:26.981Z"}	\N	1492722716	t	f	\N	\N	\N	\N	\N	{"1497025908639269613": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1497025910493151982": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 14:40:22.872309+05:30	2017-04-20 14:44:16.268786+05:30
977	1497387343626109878	R$37.60	\N	\N	\N	2017-04-17 21:10:34+05:30	\N	{"no_show": "2017-04-21T17:53:32.509Z", "order_paid": "2017-04-20T21:11:37.050Z", "order_ready": "2017-04-21T17:50:42.136Z", "order_cooking": "2017-04-21T14:22:44.204Z", "order_accepted": "2017-04-20T21:10:47.721Z", "order_requested": "2017-04-20T21:09:54.136Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1497387346302075831": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 3, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-21 02:39:51.606083+05:30	2017-04-21 23:23:32.380555+05:30
963	1496702701218562797	R$30.60	\N	\N	\N	2017-04-20 05:05:00+05:30	\N	{"no_show": "2017-04-20T09:15:45.143Z", "order_paid": "2017-04-19T22:29:31.340Z", "order_accepted": "2017-04-19T22:29:24.991Z", "order_requested": "2017-04-19T22:28:17.169Z"}	\N	1492640971	f	t	2017-04-20 05:20:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	5	\N	{"1496702703844197102": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1496702705891017455": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}, "1496702707853951728": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 03:58:13.835555+05:30	2017-04-20 14:45:45.032728+05:30
1044	1501043294648402926	R$28.60	\N	\N	\N	2017-04-26 04:40:00+05:30	\N	{"order_declined": "2017-04-25T22:12:52.351Z", "order_requested": "2017-04-25T22:12:11.690Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501043297190151151": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1501043299136308208": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-26 03:42:08.900632+05:30	2017-04-26 03:42:52.23143+05:30
1034	1500849166186709838	R$21.60	\N	\N	\N	2017-04-25 21:45:00+05:30	\N	{"order_accepted": "2017-04-25T15:47:02.922Z", "order_requested": "2017-04-25T15:46:32.177Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1500849168736846671": {"title": "Frango frito", "options": [], "quantity": 1, "selections": {}}}	\N	d n	9020	2136	Soul Man	1112	2017-04-25 21:16:29.718429+05:30	2017-04-25 21:17:02.835795+05:30
1055	1501339046004129959	R$11.60	\N	\N	\N	2017-04-26 22:30:00+05:30	\N	{"order_declined": "2017-04-26T10:09:11.643Z", "order_requested": "2017-04-26T07:59:51.808Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501339048344551592": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 13:29:49.195537+05:30	2017-04-26 15:39:11.546839+05:30
947	1495867186726568445	R$11.60	\N	\N	\N	2017-04-19 01:20:00+05:30	\N	{"order_declined": "2017-04-26T10:09:45.956Z", "order_requested": "2017-04-18T18:48:20.442Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495867189259928062": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2132	Crazy Jack's	1109	2017-04-19 00:18:18.158944+05:30	2017-04-26 15:39:45.873871+05:30
949	1495892336645767693	R$12.60	\N	\N	\N	2017-04-19 02:15:00+05:30	\N	{"order_paid": "2017-04-18T19:39:03.736Z", "order_ready": "2017-04-18T19:42:47.119Z", "order_cooking": "2017-04-18T19:42:25.728Z", "order_accepted": "2017-04-18T19:38:52.081Z", "order_picked_up": "2017-04-18T19:44:39.414Z", "order_requested": "2017-04-18T19:38:24.795Z"}	\N	1492544343	f	f	\N	\N	\N	\N	\N	{"1495892339237847566": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-19 01:08:22.530216+05:30	2017-04-19 01:14:39.018009+05:30
936	1495565414581666532	R$23.60	\N	\N	\N	2017-04-19 11:20:00+05:30	\N	{"order_paid": "2017-04-18T09:17:43.300Z", "order_accepted": "2017-04-18T09:14:42.755Z", "order_picked_up": "2017-04-19T22:30:10.627Z", "order_requested": "2017-04-18T08:48:42.362Z"}	\N	1492550287	f	f	\N	\N	\N	\N	\N	{"1495565417014362853": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1495565419648385766": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 14:18:39.745477+05:30	2017-04-20 04:00:10.531193+05:30
904	1494297769446212452	R$11.60	\N	\N	\N	2017-04-16 20:55:34+05:30	\N	{"order_accepted": "2017-04-17T09:30:28.002Z", "order_requested": "2017-04-16T14:53:22.272Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1494297771987960677": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Jimmy C	9011	2096	Classy Cuban	1094	2017-04-16 20:23:19.949249+05:30	2017-04-17 15:00:27.926654+05:30
946	1495858385877205494	R$65.60	\N	\N	\N	2017-04-19 01:10:00+05:30	\N	{"order_paid": "2017-04-18T18:40:10.966Z", "order_ready": "2017-04-21T14:25:15.706Z", "order_cooking": "2017-04-20T19:55:28.208Z", "order_accepted": "2017-04-18T18:40:03.602Z", "order_delivered": "2017-04-21T14:25:55.815Z", "order_requested": "2017-04-18T18:30:51.913Z", "order_dispatched": "2017-04-21T14:25:34.577Z"}	\N	1492540811	f	t	2017-04-19 01:25:00+05:30	6	{"city": null, "phone": "Bob / 444-3636", "state": null, "address1": "Av. Engenheiro Roberto Freire, 701, Natal-RN, 59078-600", "address2": null, "nickname": "Ponta Negra Fiat"}	\N	\N	{"1495858388402176503": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1495858390323167736": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1495858392319656441": {"title": "Delivery Charge", "options": [], "quantity": 2, "selections": {}}, "1495858395020788218": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}, "1495858396983722491": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-19 00:00:47.681072+05:30	2017-04-21 19:55:55.716356+05:30
905	1494301297585685350	R$21.60	\N	\N	\N	2017-03-11 19:35:34+05:30	\N	{"order_accepted": "2017-04-17T10:40:30.935Z", "order_requested": "2017-04-16T15:06:39.315Z"}	\N	\N	f	t	2017-03-11 19:55:34+05:30	14	{"city": "Natal", "phone": "Marcy / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": null, "nickname": "Home"}	\N	\N	{"1494301300102267751": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 2, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-16 20:36:36.577981+05:30	2017-04-17 16:10:30.845582+05:30
1060	1501400563810566352	R$11.60	\N	\N	\N	2017-04-27 00:35:00+05:30	\N	{"order_declined": "2017-04-26T10:09:38.207Z", "order_requested": "2017-04-26T10:02:37.431Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501400566696247505": {"title": "French Dip", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 15:32:35.086968+05:30	2017-04-26 15:39:38.091069+05:30
929	1495480863058559663	R$25.60	\N	\N	\N	2017-04-18 08:30:00+05:30	\N	{"order_accepted": "2017-04-18T06:00:51.847Z", "order_requested": "2017-04-18T06:00:40.081Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495480866355282608": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 11:30:37.40287+05:30	2017-04-18 11:31:20.604955+05:30
964	1496716232177484541	R$25.60	\N	\N	\N	2017-04-20 05:25:00+05:30	\N	{"no_show": "2017-04-20T09:15:49.945Z", "order_paid": "2017-04-19T22:56:40.123Z", "order_accepted": "2017-04-19T22:56:34.518Z", "order_requested": "2017-04-19T22:55:45.665Z"}	\N	1492642599	f	t	2017-04-20 05:40:00+05:30	6	{"city": null, "phone": "Bob / 444-3636", "state": null, "address1": "Av. Engenheiro Roberto Freire, 701, Natal-RN, 59078-600", "address2": null, "nickname": "Ponta Negra Fiat"}	\N	\N	{"1496716234853450494": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1496716237604913919": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1496716240121496320": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-20 04:25:41.828007+05:30	2017-04-20 14:45:49.765733+05:30
981	1497939091231080525	R$18.60	\N	\N	\N	2017-04-21 21:25:00+05:30	\N	{"order_paid": "2017-04-21T15:26:15.701Z", "order_ready": "2017-04-21T15:48:08.168Z", "order_accepted": "2017-04-21T15:26:06.255Z", "order_delivered": "2017-04-21T18:00:21.110Z", "order_requested": "2017-04-21T15:24:56.725Z", "order_dispatched": "2017-04-21T18:00:07.760Z"}	\N	1492788375	f	t	2017-04-21 21:40:00+05:30	6	{"city": "Natal-RN, 59078-600", "phone": "Bob / 444-3636", "state": null, "address1": "Av. Engenheiro Roberto Freire, 701", "address2": "Apt 2009", "nickname": "Ponta Negra Fiat"}	\N	\N	{"1497939093907046478": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1497939095895146575": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-21 20:54:53.749428+05:30	2017-04-21 23:30:21.01362+05:30
987	1498873678010515725	R$13.60	\N	\N	\N	2017-04-23 04:25:00+05:30	\N	{"order_paid": "2017-04-22T22:23:01.011Z", "order_ready": "2017-04-22T22:23:37.043Z", "order_cooking": "2017-04-22T22:23:31.076Z", "order_accepted": "2017-04-22T22:22:54.543Z", "order_picked_up": "2017-04-22T22:23:56.377Z", "order_requested": "2017-04-22T22:21:56.277Z"}	\N	1492899779	f	f	\N	\N	\N	\N	\N	{"1498873680552263950": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-23 03:51:53.840186+05:30	2017-04-23 03:53:56.272223+05:30
1025	1500320949130494702	R$5.60	\N	\N	\N	2017-04-25 04:20:00+05:30	\N	{"order_declined": "2017-04-26T11:16:56.204Z", "order_requested": "2017-04-24T22:17:03.276Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1500320951680631535": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-25 03:47:00.596148+05:30	2017-04-26 16:46:56.104401+05:30
1008	1499897366906405538	R$11.60	\N	\N	\N	2017-04-24 22:45:00+05:30	\N	{"order_declined": "2017-04-24T08:16:55.395Z", "order_requested": "2017-04-24T08:15:28.849Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1499897369313936035": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 13:45:26.554052+05:30	2017-04-24 13:46:55.303511+05:30
900	1493501762454160106	R$62.60	\N	\N	\N	2017-04-15 18:30:00+05:30	\N	{"order_paid": "2017-04-15T12:38:53.356Z", "order_ready": "2017-04-15T14:27:42.032Z", "order_cooking": "2017-04-15T12:42:03.248Z", "order_accepted": "2017-04-15T12:34:01.552Z", "order_delivered": "2017-04-16T15:16:40.627Z", "order_requested": "2017-04-15T12:29:29.935Z", "order_dispatched": "2017-04-15T14:28:29.782Z"}	\N	\N	f	t	2017-04-15 18:45:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	6	\N	{"1493501765021074155": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1493501766916899564": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1493501768829502189": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1493501770775659246": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}, "1493501772730204911": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-15 17:59:25.747892+05:30	2017-04-16 20:46:40.49936+05:30
906	1494351253860254575	R$62.60	\N	\N	\N	2017-04-16 22:35:00+05:30	\N	{"order_declined": "2017-04-16T16:55:53.503Z", "order_requested": "2017-04-16T16:36:57.023Z"}	\N	\N	f	t	2017-04-16 22:50:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1494351256385225584": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1494351258272662385": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}, "1494351260176876402": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1494351262106256243": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1494351264052413300": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-16 22:06:52.853643+05:30	2017-04-16 22:25:53.309942+05:30
922	1494990471032734280	R$13.60	\N	\N	\N	2017-04-18 04:20:00+05:30	\N	{"order_paid": "2017-04-17T13:47:27.289Z", "order_ready": "2017-04-17T13:47:42.825Z", "order_cooking": "2017-04-17T13:47:37.066Z", "order_accepted": "2017-04-17T13:47:17.884Z", "order_picked_up": "2017-04-17T13:48:09.990Z", "order_requested": "2017-04-17T13:46:37.900Z"}	\N	1492436844	f	f	\N	\N	\N	\N	\N	{"1494990473431876169": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 19:16:35.389446+05:30	2017-04-17 19:18:09.884935+05:30
909	1494432808771257281	R$25.60	\N	\N	\N	2017-04-17 21:10:34+05:30	\N	{"order_accepted": "2017-04-16T19:21:36.957Z", "order_requested": "2017-04-16T19:21:10.685Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1494432811313005506": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 2, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-17 00:51:08.27141+05:30	2017-04-17 00:51:36.876291+05:30
965	1496926018848424635	R$13.60	\N	\N	\N	2017-04-20 08:30:00+05:30	\N	{"order_paid": "2017-04-20T05:58:35.276Z", "order_ready": "2017-04-20T06:00:01.033Z", "order_cooking": "2017-04-20T05:59:25.673Z", "order_accepted": "2017-04-20T05:58:22.213Z", "order_picked_up": "2017-04-20T06:00:34.462Z", "order_requested": "2017-04-20T05:52:13.890Z"}	\N	1492711138	t	f	\N	\N	\N	\N	\N	{"1496926021281120956": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-20 11:22:11.70562+05:30	2017-04-20 11:30:34.371467+05:30
950	1496383029294137559	R$13.60	\N	\N	\N	2017-04-20 14:25:00+05:30	\N	{"order_declined": "2017-04-19T12:02:40.571Z", "order_requested": "2017-04-19T11:53:36.834Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1496383032196595928": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-19 17:23:34.67119+05:30	2017-04-19 17:32:40.480235+05:30
907	1494364991145378682	R$13.60	\N	\N	\N	2017-04-16 21:22:34+05:30	\N	{"no_show": "2017-04-17T09:19:09.327Z", "order_paid": "2017-04-16T17:06:13.607Z", "order_ready": "2017-04-17T09:05:20.837Z", "order_cooking": "2017-04-17T09:05:16.397Z", "order_accepted": "2017-04-16T17:05:45.735Z", "order_requested": "2017-04-16T17:05:17.522Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1494364993712292731": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-16 22:35:14.957645+05:30	2017-04-17 14:49:09.223136+05:30
973	1497089428068238105	R$13.60	\N	\N	\N	2017-04-21 13:50:00+05:30	\N	{"order_paid": "2017-04-20T11:24:38.366Z", "order_ready": "2017-04-20T11:27:54.629Z", "order_cooking": "2017-04-20T11:26:50.358Z", "order_accepted": "2017-04-20T11:24:20.959Z", "order_picked_up": "2017-04-20T11:28:29.944Z", "order_requested": "2017-04-20T11:16:59.955Z"}	\N	1492730702	f	f	\N	\N	\N	\N	\N	{"1497089431088136986": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-20 16:46:57.377239+05:30	2017-04-20 16:58:29.846658+05:30
1073	1501727338746872001	R$10.60	\N	\N	\N	2017-04-27 02:50:00+05:30	\N	{"order_accepted": "2017-04-26T20:51:52.640Z", "order_requested": "2017-04-26T20:51:22.343Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501727342186201284": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	d n	9020	2094	Thaitanic Xpress	1092	2017-04-27 02:21:19.842014+05:30	2017-04-27 02:21:52.532666+05:30
979	1497892414356979746	R$23.60	\N	\N	\N	2017-04-21 19:55:00+05:30	\N	{"order_accepted": "2017-04-22T06:24:02.126Z", "order_requested": "2017-04-21T13:52:33.809Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1497892416898727971": {"title": "Panang Curry", "options": ["Miso Soup"], "quantity": 1, "selections": {}}, "1497892418794553380": {"title": "Pad Thai", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-21 19:22:31.14242+05:30	2017-04-22 11:54:02.00602+05:30
982	1498019481971064965	R$13.60	\N	\N	\N	2017-04-22 00:05:00+05:30	\N	{"order_paid": "2017-04-21T18:05:39.647Z", "order_ready": "2017-04-21T18:05:56.306Z", "order_cooking": "2017-04-21T18:05:50.056Z", "order_accepted": "2017-04-21T18:05:29.594Z", "order_picked_up": "2017-04-21T18:07:35.138Z", "order_requested": "2017-04-21T18:05:06.746Z"}	\N	1492797940	f	f	\N	\N	\N	\N	\N	{"1498019484571533446": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-21 23:35:04.451703+05:30	2017-04-21 23:37:35.047281+05:30
1045	1501045531672052721	R$11.60	\N	\N	\N	2017-04-26 04:20:00+05:30	\N	{"order_declined": "2017-04-25T22:16:55.760Z", "order_requested": "2017-04-25T22:16:40.840Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501045534205412338": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-26 03:46:38.636559+05:30	2017-04-26 03:46:55.653909+05:30
1071	1501489240649761076	R$14.60	\N	\N	\N	2017-04-27 03:30:00+05:30	\N	{"order_accepted": "2017-04-27T05:23:16.283Z", "order_requested": "2017-04-26T12:58:13.312Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501489243124400437": {"title": "French Dip", "options": ["French Fries"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-26 18:28:11.079486+05:30	2017-04-27 10:53:16.112396+05:30
938	1495606760168227567	R$13.60	\N	\N	\N	2017-04-19 12:40:00+05:30	\N	{"order_declined": "2017-04-19T12:02:05.013Z", "order_requested": "2017-04-18T10:11:04.282Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1495606762626089712": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-18 15:41:01.767381+05:30	2017-04-19 17:32:04.918638+05:30
911	1494785261656080904	R$18.60	\N	\N	\N	2017-04-17 21:30:00+05:30	\N	{"no_show": "2017-04-17T08:50:56.614Z", "order_paid": "2017-04-17T06:59:25.753Z", "order_ready": "2017-04-17T08:50:43.485Z", "order_cooking": "2017-04-17T08:50:39.245Z", "order_accepted": "2017-04-17T06:59:18.257Z", "order_requested": "2017-04-17T06:58:41.431Z", "order_dispatched": "2017-04-17T08:50:48.093Z"}	\N	1492412365	f	t	2017-04-17 21:45:00+05:30	12	{"city": null, "phone": "546538497", "state": null, "address1": "17 Gyaneshwar", "address2": "Ind", "nickname": "Ashley"}	\N	\N	{"1494785264013279753": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1494785265774887434": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 12:28:38.719892+05:30	2017-04-17 14:20:56.525359+05:30
921	1494948945938350218	R$18.60	\N	\N	\N	2017-04-17 18:25:00+05:30	\N	{"order_paid": "2017-04-17T12:26:44.243Z", "order_ready": "2017-04-20T05:59:41.509Z", "order_cooking": "2017-04-17T13:49:58.417Z", "order_accepted": "2017-04-17T12:25:00.509Z", "order_delivered": "2017-04-20T06:00:51.770Z", "order_requested": "2017-04-17T12:24:24.329Z", "order_dispatched": "2017-04-20T05:59:51.154Z"}	\N	1492432041	f	t	2017-04-17 18:40:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1494948948412989579": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1494948950359146636": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 17:54:21.760535+05:30	2017-04-20 11:30:51.674127+05:30
910	1494779706258489862	R$11.60	\N	\N	\N	2017-04-17 21:20:00+05:30	\N	{"order_paid": "2017-04-17T06:48:57.545Z", "order_ready": "2017-04-17T08:51:14.289Z", "order_cooking": "2017-04-17T08:50:32.973Z", "order_accepted": "2017-04-17T06:48:38.617Z", "order_picked_up": "2017-04-17T08:51:44.021Z", "order_requested": "2017-04-17T06:47:52.108Z"}	\N	1492411737	t	f	\N	\N	\N	\N	\N	{"1494779708716352007": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 12:17:49.970638+05:30	2017-04-17 14:21:43.889476+05:30
974	1497090677559788323	R$25.60	\N	\N	\N	2017-04-21 13:50:00+05:30	\N	{"order_paid": "2017-04-20T11:28:50.496Z", "order_ready": "2017-04-20T11:29:11.949Z", "order_cooking": "2017-04-20T11:29:05.136Z", "order_accepted": "2017-04-20T11:28:43.746Z", "order_picked_up": "2017-04-20T11:30:24.086Z", "order_requested": "2017-04-20T11:19:08.206Z"}	\N	1492730954	t	f	\N	\N	\N	\N	\N	{"1497090680017650468": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-20 16:49:05.957465+05:30	2017-04-20 17:00:23.999431+05:30
923	1494995955101991498	R$26.60	\N	\N	\N	2017-04-18 04:30:00+05:30	\N	{"order_paid": "2017-04-17T13:58:33.999Z", "order_ready": "2017-04-17T13:59:47.585Z", "order_cooking": "2017-04-17T13:59:35.688Z", "order_accepted": "2017-04-17T13:58:22.218Z", "order_picked_up": "2017-04-17T14:00:37.418Z", "order_requested": "2017-04-17T13:57:14.402Z"}	\N	1492437511	f	f	\N	\N	\N	\N	\N	{"1494995957509521995": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1494995960076436044": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 19:27:11.531807+05:30	2017-04-17 19:30:33.829335+05:30
912	1494791622720750104	R$25.60	\N	\N	\N	2017-04-17 21:40:00+05:30	\N	{"order_paid": "2017-04-17T07:11:57.580Z", "order_ready": "2017-04-17T07:18:21.671Z", "order_cooking": "2017-04-17T07:17:54.712Z", "order_accepted": "2017-04-17T07:11:49.022Z", "order_picked_up": "2017-04-17T08:59:02.375Z", "order_requested": "2017-04-17T07:11:23.710Z"}	\N	1492413117	t	f	\N	\N	\N	\N	\N	{"1494791625136669209": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}, "1494791626923442714": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 12:41:20.996513+05:30	2017-04-17 14:29:02.244212+05:30
980	1497906632493891627	R$23.60	\N	\N	\N	2017-04-21 20:20:00+05:30	\N	{"order_paid": "2017-04-21T14:21:09.259Z", "order_ready": "2017-04-21T14:26:13.452Z", "order_cooking": "2017-04-21T14:23:23.273Z", "order_accepted": "2017-04-21T14:20:57.838Z", "order_picked_up": "2017-04-21T14:27:15.257Z", "order_requested": "2017-04-21T14:20:22.062Z"}	\N	1492784469	f	f	\N	\N	\N	\N	\N	{"1497906635262132268": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1497906637216677933": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-21 19:50:19.13408+05:30	2017-04-21 19:57:15.168197+05:30
1014	1500025753427771768	R$13.60	\N	\N	\N	2017-04-24 18:30:00+05:30	\N	{"order_paid": "2017-04-24T22:17:24.526Z", "order_ready": "2017-04-26T13:16:07.449Z", "order_cooking": "2017-04-24T22:17:54.965Z", "order_accepted": "2017-04-24T22:17:17.761Z", "order_requested": "2017-04-24T12:30:33.401Z"}	\N	1493072236	f	f	\N	\N	\N	\N	\N	{"1500025756019851641": {"title": "Pad Thai", "options": [], "quantity": 1, "selections": {}}, "1500025757949231482": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2094	Thaitanic Xpress	1092	2017-04-24 18:00:30.619308+05:30	2017-04-26 18:46:07.350772+05:30
984	1498022910076387465	R$11.60	\N	\N	\N	2017-04-22 01:00:00+05:30	\N	{"order_paid": "2017-04-21T18:12:07.697Z", "order_ready": "2017-04-22T22:17:21.556Z", "order_cooking": "2017-04-22T22:16:52.627Z", "order_accepted": "2017-04-21T18:12:01.186Z", "order_picked_up": "2017-04-22T22:18:32.347Z", "order_requested": "2017-04-21T18:11:20.301Z"}	\N	1492798328	f	f	\N	\N	\N	\N	\N	{"1498022912592969866": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-21 23:41:17.499822+05:30	2017-04-23 03:48:32.233295+05:30
903	1493572729306088181	R$62.60	\N	\N	\N	2017-04-15 20:50:00+05:30	\N	{"order_paid": "2017-04-16T16:38:37.966Z", "order_ready": "2017-04-16T19:49:45.202Z", "order_accepted": "2017-04-16T16:38:26.551Z", "order_delivered": "2017-04-17T08:50:18.821Z", "order_requested": "2017-04-15T14:49:45.003Z", "order_dispatched": "2017-04-17T08:50:10.103Z"}	\N	1492360722	f	t	2017-04-15 21:05:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	5	\N	{"1493572731797504758": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1493572733752050423": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}, "1493572735647875832": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1493572737644364537": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1493572739666019066": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-15 20:19:40.793631+05:30	2017-04-17 14:20:18.709587+05:30
916	1494880162641084978	R$13.60	\N	\N	\N	2017-04-17 10:35:00+05:30	\N	{"order_paid": "2017-04-17T10:07:50.147Z", "order_ready": "2017-04-17T10:09:52.162Z", "order_cooking": "2017-04-17T10:09:45.230Z", "order_accepted": "2017-04-17T10:07:43.777Z", "order_picked_up": "2017-04-17T10:11:30.063Z", "order_requested": "2017-04-17T10:07:18.689Z"}	\N	1492373203	f	f	\N	\N	\N	\N	\N	{"1494880165023449651": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 15:37:16.408077+05:30	2017-04-17 15:41:29.957532+05:30
917	1494897484638454324	R$13.60	\N	\N	\N	2017-04-17 15:10:00+05:30	\N	{"order_paid": "2017-04-17T10:43:23.640Z", "order_ready": "2017-04-17T10:44:25.607Z", "order_cooking": "2017-04-17T10:44:15.365Z", "order_accepted": "2017-04-17T10:43:14.615Z", "order_picked_up": "2017-04-17T10:44:58.658Z", "order_requested": "2017-04-17T10:41:38.028Z"}	\N	1492389728	f	f	\N	\N	\N	\N	\N	{"1494897487012430389": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 16:11:35.181133+05:30	2017-04-17 16:14:58.555449+05:30
920	1494908602052248122	R$12.60	\N	\N	\N	2017-04-17 15:35:00+05:30	\N	{"order_paid": "2017-04-17T11:05:20.107Z", "order_ready": "2017-04-17T11:07:58.759Z", "order_cooking": "2017-04-17T11:07:37.974Z", "order_accepted": "2017-04-17T11:05:14.200Z", "order_picked_up": "2017-04-17T11:14:48.565Z", "order_requested": "2017-04-17T11:04:10.060Z"}	\N	1492391044	f	f	\N	\N	\N	\N	\N	{"1494908604409446971": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-17 16:34:07.663796+05:30	2017-04-17 16:44:48.359719+05:30
914	1494872776043921964	R$13.60	\N	\N	\N	2017-04-17 10:20:00+05:30	\N	{"order_paid": "2017-04-17T09:53:21.899Z", "order_ready": "2017-04-17T09:53:44.261Z", "order_cooking": "2017-04-17T09:53:37.199Z", "order_accepted": "2017-04-17T09:53:05.703Z", "order_picked_up": "2017-04-17T09:54:06.182Z", "order_requested": "2017-04-17T09:52:34.420Z"}	\N	1492372335	t	f	\N	\N	\N	\N	\N	{"1494872778518561325": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 15:22:28.038977+05:30	2017-04-17 15:24:06.084871+05:30
913	1494854394112377377	R$13.60	\N	\N	\N	2017-04-17 23:45:00+05:30	\N	{"order_paid": "2017-04-17T09:16:29.253Z", "order_ready": "2017-04-17T09:16:49.171Z", "order_cooking": "2017-04-17T09:16:45.828Z", "order_accepted": "2017-04-17T09:16:22.037Z", "order_picked_up": "2017-04-17T09:17:20.329Z", "order_requested": "2017-04-17T09:15:58.346Z"}	\N	1492420588	t	f	\N	\N	\N	\N	\N	{"1494854396503130658": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 14:45:55.793591+05:30	2017-04-17 14:47:20.237178+05:30
919	1494901101739115064	R$13.60	\N	\N	\N	2017-04-17 15:20:00+05:30	\N	{"order_paid": "2017-04-17T10:50:35.698Z", "order_ready": "2017-04-17T11:42:47.468Z", "order_cooking": "2017-04-17T11:42:41.490Z", "order_accepted": "2017-04-17T10:50:25.727Z", "order_picked_up": "2017-04-17T12:10:46.241Z", "order_requested": "2017-04-17T10:48:45.562Z"}	\N	1492390160	f	f	\N	\N	\N	\N	\N	{"1494901104121479737": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 16:18:42.49264+05:30	2017-04-17 17:40:46.106824+05:30
915	1494876524048810544	R$25.60	\N	\N	\N	2017-04-17 10:30:00+05:30	\N	{"order_paid": "2017-04-17T10:00:47.326Z", "order_ready": "2017-04-17T10:01:07.125Z", "order_cooking": "2017-04-17T10:00:58.829Z", "order_accepted": "2017-04-17T10:00:20.743Z", "order_picked_up": "2017-04-17T10:01:39.652Z", "order_requested": "2017-04-17T09:59:58.049Z"}	\N	1492372780	f	f	\N	\N	\N	\N	\N	{"1494876526397620785": {"title": "Cuban Reuben", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 15:29:55.781948+05:30	2017-04-17 15:31:39.55222+05:30
924	1495091093333606601	R$28.60	\N	\N	\N	2017-04-17 23:30:00+05:30	\N	{"order_requested": "2017-04-17T17:06:39.532Z"}	\N	\N	f	t	2017-04-17 23:45:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	\N	\N	{"1495091095942463690": {"title": "Breakfast Burrito Beef", "options": [], "quantity": 1, "selections": {"Meat": "Beef"}}, "1495091097855066315": {"title": "Chimichanga Plate", "options": [], "quantity": 1, "selections": {}}, "1495091099801223372": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2133	Paco's Tacos	1110	2017-04-17 22:36:35.090426+05:30	2017-04-17 22:36:35.090426+05:30
918	1494899780323639862	R$11.60	\N	\N	\N	2017-04-17 15:15:00+05:30	\N	{"order_paid": "2017-04-17T10:47:29.981Z", "order_ready": "2017-04-17T11:42:29.292Z", "order_cooking": "2017-04-17T11:42:16.478Z", "order_accepted": "2017-04-17T10:47:24.227Z", "order_picked_up": "2017-04-17T11:47:20.209Z", "order_requested": "2017-04-17T10:46:14.800Z"}	\N	1492389974	f	f	\N	\N	\N	\N	\N	{"1494899782764724791": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-17 16:16:12.627276+05:30	2017-04-17 17:17:20.113395+05:30
1043	1501040735065998315	R$18.60	\N	\N	\N	2017-04-26 04:10:00+05:30	\N	{"order_declined": "2017-04-25T22:22:35.637Z", "order_requested": "2017-04-25T22:07:06.980Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501040737691632620": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1501040739662955501": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-26 03:37:04.157183+05:30	2017-04-26 03:52:35.540643+05:30
994	1499252699277820202	R$16.60	\N	\N	\N	2017-04-23 16:55:00+05:30	\N	{"order_paid": "2017-04-23T10:55:25.554Z", "order_ready": "2017-04-23T10:56:51.188Z", "order_cooking": "2017-04-23T10:56:34.597Z", "order_accepted": "2017-04-23T10:55:18.106Z", "order_picked_up": "2017-04-23T10:57:42.740Z", "order_requested": "2017-04-23T10:54:46.390Z"}	\N	1492944918	f	f	\N	\N	\N	\N	\N	{"1499252701920231723": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-23 16:24:44.096797+05:30	2017-04-23 16:27:42.641176+05:30
992	1499030354348998943	R$27.60	\N	\N	\N	2017-04-23 09:35:00+05:30	\N	{"order_paid": "2017-04-23T03:35:32.746Z", "order_ready": "2017-04-23T03:37:08.209Z", "order_cooking": "2017-04-23T03:36:58.117Z", "order_accepted": "2017-04-23T03:35:26.341Z", "order_picked_up": "2017-04-23T10:52:49.358Z", "order_requested": "2017-04-23T03:32:51.874Z"}	\N	1492918537	f	f	\N	\N	\N	\N	\N	{"1499030356882358560": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1499030358786572577": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-23 09:02:48.915344+05:30	2017-04-23 16:22:49.145025+05:30
996	1499262184243331374	R$22.60	\N	\N	\N	2017-04-23 17:15:00+05:30	\N	{"order_paid": "2017-04-23T11:13:53.522Z", "order_ready": "2017-04-23T11:14:20.053Z", "order_cooking": "2017-04-23T11:14:15.429Z", "order_accepted": "2017-04-23T11:13:45.332Z", "order_picked_up": "2017-04-23T11:14:30.012Z", "order_requested": "2017-04-23T11:13:28.568Z"}	\N	1492946026	f	f	\N	\N	\N	\N	\N	{"1499262186818634031": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1499262188848677168": {"title": "Beef Brisket", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2097	Frank's BBQ	1095	2017-04-23 16:43:25.733904+05:30	2017-04-23 16:44:29.867743+05:30
995	1499255987687653676	R$9.60	\N	\N	\N	2017-04-23 17:20:00+05:30	\N	{"order_paid": "2017-04-23T11:09:47.635Z", "order_ready": "2017-04-23T11:10:24.462Z", "order_cooking": "2017-04-23T11:10:02.922Z", "order_accepted": "2017-04-23T11:09:40.819Z", "order_picked_up": "2017-04-23T11:10:58.958Z", "order_requested": "2017-04-23T11:01:07.521Z"}	\N	1492945780	f	f	\N	\N	\N	\N	\N	{"1499255990330065197": {"title": "Pulled Pork Sliders", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2097	Frank's BBQ	1095	2017-04-23 16:31:05.361047+05:30	2017-04-23 16:40:58.86111+05:30
997	1499265095207747889	R$12.60	\N	\N	\N	2017-04-23 17:20:00+05:30	\N	{"order_paid": "2017-04-23T11:19:57.851Z", "order_ready": "2017-04-23T11:21:25.104Z", "order_cooking": "2017-04-23T11:20:42.045Z", "order_accepted": "2017-04-23T11:19:51.404Z", "order_picked_up": "2017-04-23T11:21:47.642Z", "order_requested": "2017-04-23T11:19:14.901Z"}	\N	1492946390	f	f	\N	\N	\N	\N	\N	{"1499265097699164466": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}}	\N	Marcy J	9018	2094	Thaitanic Xpress	1092	2017-04-23 16:49:11.554743+05:30	2017-04-23 16:51:47.54566+05:30
1036	1500890232776557473	R$39.60	\N	\N	\N	2017-04-25 23:10:00+05:30	\N	{"order_paid": "2017-04-25T17:09:14.402Z", "order_ready": "2017-04-25T17:12:13.201Z", "order_cooking": "2017-04-25T17:11:49.022Z", "order_accepted": "2017-04-25T17:09:08.165Z", "order_picked_up": "2017-04-25T17:16:46.900Z", "order_requested": "2017-04-25T17:08:09.561Z"}	\N	1493140153	f	f	\N	\N	\N	\N	\N	{"1500890238061380514": {"title": "Ervilha de olhos pretos", "options": [], "quantity": 2, "selections": {}}, "1500890243354592165": {"title": "Rabos de boi", "options": ["extra cebolas grilhada"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2136	Soul Man	1112	2017-04-25 22:38:06.842356+05:30	2017-04-25 22:46:46.790886+05:30
1035	1500852375072539475	R$33.60	\N	\N	\N	2017-04-25 22:10:00+05:30	\N	{"order_paid": "2017-04-25T15:54:14.671Z", "order_ready": "2017-04-25T15:55:39.500Z", "order_cooking": "2017-04-25T15:55:21.340Z", "order_accepted": "2017-04-25T15:54:04.760Z", "order_picked_up": "2017-04-25T17:17:49.821Z", "order_requested": "2017-04-25T15:53:09.494Z"}	\N	1493135654	t	f	\N	\N	\N	\N	\N	{"1500852377631064916": {"title": "milho na espiga grilhada", "options": [], "quantity": 1, "selections": {}}, "1500852379593999189": {"title": "Ervilha de olhos pretos", "options": [], "quantity": 1, "selections": {}}, "1500852381548544854": {"title": "Tomates verdes fritos", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2136	Soul Man	1112	2017-04-25 21:23:06.364233+05:30	2017-04-25 22:47:49.622018+05:30
1046	1501049622494184435	R$23.60	\N	\N	\N	2017-04-26 04:40:00+05:30	\N	{"order_accepted": "2017-04-25T22:46:16.088Z", "order_requested": "2017-04-25T22:24:46.973Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501049625019155444": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 2, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-26 03:54:44.661662+05:30	2017-04-26 04:16:15.999181+05:30
1067	1501446718460264699	R$10.60	\N	\N	\N	2017-04-27 02:05:00+05:30	\N	{"order_paid": "2017-04-26T15:08:17.257Z", "order_ready": "2017-04-26T15:15:44.601Z", "order_cooking": "2017-04-26T15:15:39.685Z", "order_accepted": "2017-04-26T15:08:08.728Z", "order_picked_up": "2017-04-27T05:43:18.111Z", "order_requested": "2017-04-26T11:33:49.651Z"}	\N	1493219296	f	f	\N	\N	\N	\N	\N	{"1501446721413054718": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 17:03:47.190188+05:30	2017-04-27 11:13:17.96232+05:30
1053	1501316123763671164	R$9.60	\N	\N	\N	2017-04-26 21:45:00+05:30	\N	{"order_paid": "2017-04-26T10:25:09.786Z", "order_ready": "2017-04-26T10:25:32.283Z", "order_cooking": "2017-04-26T10:25:27.644Z", "order_accepted": "2017-04-26T10:24:59.699Z", "order_picked_up": "2017-04-26T13:15:50.419Z", "order_requested": "2017-04-26T07:14:25.442Z"}	\N	1493202307	f	f	\N	\N	\N	\N	\N	{"1501316127756648575": {"title": "Green Curry Regular", "options": [], "quantity": 1, "selections": {"Sauce": "Regular"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 12:44:23.067088+05:30	2017-04-26 18:45:50.302691+05:30
1040	1501012736174195679	R$22.60	\N	\N	\N	2017-04-26 03:15:00+05:30	\N	{"no_show": "2017-04-25T23:13:42.347Z", "order_paid": "2017-04-25T21:12:44.352Z", "order_cooking": "2017-04-25T21:13:05.498Z", "order_accepted": "2017-04-25T21:12:06.963Z", "order_requested": "2017-04-25T21:11:38.015Z"}	\N	1493154764	f	f	\N	\N	\N	\N	\N	{"1501012738715943904": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1501012741131863009": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-26 02:41:34.946169+05:30	2017-04-26 04:43:42.254055+05:30
998	1499279587568255283	R$12.60	\N	\N	\N	2017-04-23 17:50:00+05:30	\N	{"order_paid": "2017-04-23T11:49:15.586Z", "order_ready": "2017-04-23T11:58:37.004Z", "order_cooking": "2017-04-23T11:58:26.301Z", "order_accepted": "2017-04-23T11:49:09.552Z", "order_picked_up": "2017-04-23T11:58:58.068Z", "order_requested": "2017-04-23T11:48:01.237Z"}	\N	1492948148	f	f	\N	\N	\N	\N	\N	{"1499279590135169332": {"title": "Beef Brisket", "options": ["Mashed Potatoes"], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2097	Frank's BBQ	1095	2017-04-23 17:17:58.977574+05:30	2017-04-23 17:28:57.982539+05:30
1000	1499462208277446985	R$23.60	\N	\N	\N	2017-04-23 23:50:00+05:30	\N	{"order_paid": "2017-04-23T17:51:26.411Z", "order_ready": "2017-04-24T10:59:57.122Z", "order_cooking": "2017-04-24T10:59:51.865Z", "order_accepted": "2017-04-23T17:51:20.748Z", "order_picked_up": "2017-04-24T22:18:17.844Z", "order_requested": "2017-04-23T17:50:55.450Z"}	\N	1492969878	f	f	\N	\N	\N	\N	\N	{"1499462210768863562": {"title": "Pad Thai", "options": [], "quantity": 2, "selections": {}}, "1499462212673077579": {"title": "Panang Curry", "options": ["Miso Soup"], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2094	Thaitanic Xpress	1092	2017-04-23 23:20:52.75979+05:30	2017-04-25 03:48:17.755214+05:30
972	1497032518828819234	R$13.60	\N	\N	\N	2017-04-20 15:25:00+05:30	\N	{"order_paid": "2017-04-20T09:25:36.346Z", "order_ready": "2017-04-21T17:59:44.546Z", "order_cooking": "2017-04-21T15:46:32.505Z", "order_accepted": "2017-04-20T09:25:27.509Z", "order_delivered": "2017-04-24T22:32:56.053Z", "order_requested": "2017-04-20T09:23:40.699Z", "order_dispatched": "2017-04-24T10:54:22.625Z"}	\N	1492680336	f	t	2017-04-20 15:40:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	5	\N	{"1497032521446064931": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1497032523392221988": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-20 14:53:37.875711+05:30	2017-04-25 04:02:55.961709+05:30
1007	1499896383384060576	R$13.60	\N	\N	\N	2017-04-24 22:45:00+05:30	\N	{"order_paid": "2017-04-24T08:15:07.731Z", "order_ready": "2017-04-24T09:07:02.874Z", "order_cooking": "2017-04-24T08:59:12.570Z", "order_accepted": "2017-04-24T08:14:58.632Z", "order_picked_up": "2017-04-24T10:40:21.649Z", "order_requested": "2017-04-24T08:13:30.092Z"}	\N	1493021706	t	f	\N	\N	\N	\N	\N	{"1499896385858699937": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 13:43:27.819451+05:30	2017-04-24 16:10:21.502261+05:30
1038	1500899538460738483	R$45.60	\N	\N	\N	2017-04-25 23:25:00+05:30	\N	{"order_paid": "2017-04-25T17:28:18.497Z", "order_ready": "2017-04-25T17:28:57.801Z", "order_cooking": "2017-04-25T17:28:46.686Z", "order_accepted": "2017-04-25T17:27:31.314Z", "order_picked_up": "2017-04-25T17:30:08.046Z", "order_requested": "2017-04-25T17:27:11.899Z"}	\N	1493141298	t	f	\N	\N	\N	\N	\N	{"1500899540977320884": {"title": "milho na espiga grilhada", "options": [], "quantity": 2, "selections": {}}, "1500899543015752629": {"title": "Tomates verdes fritos", "options": [], "quantity": 2, "selections": {}}}	\N	Bob S	9009	2136	Soul Man	1112	2017-04-25 22:57:08.902443+05:30	2017-04-25 23:00:07.945086+05:30
1047	1501051946843243509	R$12.60	\N	\N	\N	2017-04-26 04:50:00+05:30	\N	{"order_paid": "2017-04-25T22:30:39.700Z", "order_cooking": "2017-04-25T22:31:25.371Z", "order_accepted": "2017-04-25T22:29:42.885Z", "order_picked_up": "2017-04-25T23:08:40.817Z", "order_requested": "2017-04-25T22:29:27.592Z"}	\N	1493159440	f	f	\N	\N	\N	\N	\N	{"1501051950223852534": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-26 03:59:23.762132+05:30	2017-04-26 04:38:40.740661+05:30
999	1499287034311737653	R$25.60	\N	\N	\N	2017-04-23 18:05:00+05:30	\N	{"order_paid": "2017-04-23T12:03:21.131Z", "order_ready": "2017-04-23T12:05:50.699Z", "order_cooking": "2017-04-23T12:03:27.159Z", "order_accepted": "2017-04-23T12:03:15.008Z", "order_picked_up": "2017-04-23T12:06:10.776Z", "order_requested": "2017-04-23T12:02:57.432Z"}	\N	1492948993	f	f	\N	\N	\N	\N	\N	{"1499287042012479798": {"title": "Full Slab of Ribs", "options": [], "quantity": 2, "selections": {}}}	\N	Marcy J	9018	2097	Frank's BBQ	1095	2017-04-23 17:32:55.315993+05:30	2017-04-23 17:36:10.668404+05:30
1065	1501436224949190899	R$10.60	\N	\N	\N	2017-04-27 01:45:00+05:30	\N	{"order_paid": "2017-04-26T11:17:47.611Z", "order_ready": "2017-04-26T14:38:41.800Z", "order_cooking": "2017-04-26T13:16:23.921Z", "order_accepted": "2017-04-26T11:17:40.178Z", "order_picked_up": "2017-04-26T14:49:55.589Z", "order_requested": "2017-04-26T11:13:39.963Z"}	\N	1493205475	f	f	\N	\N	\N	\N	\N	{"1501436227398664436": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 16:43:37.54964+05:30	2017-04-26 20:19:55.489658+05:30
1015	1500080225961116423	R$10.60	\N	\N	\N	2017-04-25 16:50:00+05:30	\N	{"order_declined": "2017-04-26T11:16:41.008Z", "order_requested": "2017-04-24T14:19:04.948Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1500080230004425482": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-24 19:49:02.203276+05:30	2017-04-26 16:46:40.902265+05:30
1061	1501411754003923154	R$10.60	\N	\N	\N	2017-04-27 00:55:00+05:30	\N	{"order_declined": "2017-04-26T11:17:00.215Z", "order_requested": "2017-04-26T10:24:46.513Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501411756797329621": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 15:54:44.154146+05:30	2017-04-26 16:47:00.126084+05:30
1063	1501421867896930526	R$10.60	\N	\N	\N	2017-04-27 01:15:00+05:30	\N	{"order_declined": "2017-04-26T11:17:18.659Z", "order_requested": "2017-04-26T10:44:52.580Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501421871143321823": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 16:14:50.210325+05:30	2017-04-26 16:47:18.576583+05:30
1037	1500890232776557472	R$39.60	\N	\N	\N	2017-04-25 23:10:00+05:30	\N	{"order_paid": "2017-04-25T17:12:33.750Z", "order_ready": "2017-04-25T17:50:41.323Z", "order_cooking": "2017-04-25T17:18:09.899Z", "order_accepted": "2017-04-25T17:12:27.740Z", "order_picked_up": "2017-04-26T20:55:17.344Z", "order_requested": "2017-04-25T17:09:14.748Z"}	\N	1493140353	t	f	\N	\N	\N	\N	\N	{"1500890238363370403": {"title": "Ervilha de olhos pretos", "options": [], "quantity": 2, "selections": {}}, "1500890243279094692": {"title": "Rabos de boi", "options": ["extra cebolas grilhada"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2136	Soul Man	1112	2017-04-25 22:39:11.548817+05:30	2017-04-27 02:25:17.240009+05:30
1048	1501060224738395129	R$14.60	\N	\N	\N	2017-04-26 04:45:00+05:30	\N	{"order_paid": "2017-04-25T22:46:57.596Z", "order_ready": "2017-04-25T23:18:07.613Z", "order_cooking": "2017-04-25T22:47:34.810Z", "order_accepted": "2017-04-25T22:46:22.326Z", "order_requested": "2017-04-25T22:45:51.689Z"}	\N	1493160417	f	f	\N	\N	\N	\N	\N	{"1501060227288531962": {"title": "Cuban Sausage Melt", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-26 04:15:49.46664+05:30	2017-04-26 04:48:07.538049+05:30
1011	1499918309745754792	R$13.60	\N	\N	\N	2017-04-24 23:30:00+05:30	\N	{"order_paid": "2017-04-24T08:57:50.401Z", "order_ready": "2017-04-24T08:59:39.109Z", "order_cooking": "2017-04-24T08:58:30.646Z", "order_accepted": "2017-04-24T08:57:42.414Z", "order_picked_up": "2017-04-24T09:03:28.217Z", "order_requested": "2017-04-24T08:57:04.431Z"}	\N	1493024269	f	f	\N	\N	\N	\N	\N	{"1499918312178451113": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 14:27:01.978636+05:30	2017-04-24 14:33:27.537638+05:30
1027	1500331441861427959	R$23.60	\N	\N	\N	2017-04-25 04:40:00+05:30	\N	{"no_show": "2017-04-25T22:14:39.064Z", "order_paid": "2017-04-24T22:39:59.538Z", "order_ready": "2017-04-25T21:29:04.260Z", "order_accepted": "2017-04-24T22:39:27.842Z", "order_requested": "2017-04-24T22:37:52.927Z"}	\N	1493073600	f	f	\N	\N	\N	\N	\N	{"1500331444411564792": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1500331446408053497": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2096	Classy Cuban	1094	2017-04-25 04:07:49.871881+05:30	2017-04-26 03:44:38.976883+05:30
1039	1500921403971470267	R$26.60	\N	\N	\N	2017-04-25 23:55:00+05:30	\N	{"order_paid": "2017-04-25T18:10:44.484Z", "order_cooking": "2017-04-25T18:10:57.708Z", "order_accepted": "2017-04-25T18:10:36.433Z", "order_requested": "2017-04-25T18:10:04.500Z"}	\N	1493143844	f	t	2017-04-26 00:10:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	35	\N	{"1500921406496441276": {"title": "Tomates verdes fritos", "options": [], "quantity": 1, "selections": {}}, "1500921408476152765": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2136	Soul Man	1112	2017-04-25 23:40:01.666144+05:30	2017-04-25 23:42:11.348397+05:30
1028	1500345860762895099	R$28.60	\N	\N	\N	2017-04-25 05:10:00+05:30	\N	{"order_accepted": "2017-04-24T23:06:49.383Z", "order_requested": "2017-04-24T23:06:34.112Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1500345863329809148": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1500345865250800381": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-25 04:36:31.250902+05:30	2017-04-25 04:36:49.304292+05:30
1049	1501071406593475580	R$16.60	\N	\N	\N	2017-04-26 05:20:00+05:30	\N	{"order_paid": "2017-04-25T23:09:08.504Z", "order_ready": "2017-04-25T23:59:32.618Z", "order_cooking": "2017-04-25T23:09:21.164Z", "order_accepted": "2017-04-25T23:08:19.771Z", "order_requested": "2017-04-25T23:08:02.374Z"}	\N	1493161747	f	f	\N	\N	\N	\N	\N	{"1501071409177166845": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-26 04:37:59.959871+05:30	2017-04-26 05:29:32.536142+05:30
1062	1501414966287139032	R$10.60	\N	\N	\N	2017-04-27 01:00:00+05:30	\N	{"order_declined": "2017-04-26T11:17:09.534Z", "order_requested": "2017-04-26T10:31:12.133Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501414969541918937": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-26 16:01:09.635353+05:30	2017-04-26 16:47:09.435682+05:30
1070	1501484360367341858	R$10.60	\N	\N	\N	2017-04-27 03:20:00+05:30	\N	{"order_accepted": "2017-04-26T15:25:20.293Z", "order_requested": "2017-04-26T12:49:09.943Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501484365702496549": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 18:19:07.299514+05:30	2017-04-26 20:55:20.187943+05:30
1069	1501457747357466891	R$10.60	\N	\N	\N	2017-04-27 02:25:00+05:30	\N	{"order_accepted": "2017-04-26T15:13:54.248Z", "order_requested": "2017-04-26T11:55:42.145Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501457749890826510": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 17:25:39.782092+05:30	2017-04-26 20:43:54.160345+05:30
1068	1501454309320032513	R$10.60	\N	\N	\N	2017-04-27 02:20:00+05:30	\N	{"order_paid": "2017-04-26T14:50:18.612Z", "order_ready": "2017-04-26T14:50:31.486Z", "order_cooking": "2017-04-26T14:50:26.626Z", "order_accepted": "2017-04-26T14:50:09.714Z", "order_picked_up": "2017-04-26T15:04:02.433Z", "order_requested": "2017-04-26T11:48:53.895Z"}	\N	1493218217	f	f	\N	\N	\N	\N	\N	{"1501454312440594692": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 17:18:51.480292+05:30	2017-04-26 20:34:02.323996+05:30
1064	1501430702409777383	R$10.60	\N	\N	\N	2017-04-27 01:35:00+05:30	\N	{"order_paid": "2017-04-26T11:17:53.143Z", "order_ready": "2017-04-26T13:16:29.746Z", "order_cooking": "2017-04-26T13:12:59.453Z", "order_accepted": "2017-04-26T11:17:29.052Z", "order_picked_up": "2017-04-26T14:38:16.464Z", "order_requested": "2017-04-26T11:02:43.156Z"}	\N	1493205481	f	f	\N	\N	\N	\N	\N	{"1501430705362567402": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 16:32:40.790981+05:30	2017-04-26 20:08:16.318774+05:30
1080	1502251461952668076	R$11.60	\N	\N	\N	2017-04-28 04:45:00+05:30	\N	{"order_accepted": "2017-04-27T15:32:25.971Z", "order_requested": "2017-04-27T14:12:42.012Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502251464410530221": {"title": "Ham Salsa", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-27 19:42:39.404115+05:30	2017-04-27 21:02:25.839913+05:30
1087	1502326840147050830	R$53.60	\N	\N	\N	2017-04-27 23:35:00+05:30	\N	{"order_requested": "2017-04-27T16:42:27.839Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502326842739130703": {"title": "Cuban Sausage Melt", "options": [], "quantity": 4, "selections": {}}, "1502326844735619408": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Luiz C	9021	2096	Classy Cuban	1094	2017-04-27 22:12:24.831744+05:30	2017-04-27 22:12:24.831744+05:30
1016	1500211369088123415	R$36.60	\N	\N	\N	2017-04-25 01:10:00+05:30	\N	{"order_paid": "2017-04-24T18:41:19.841Z", "order_ready": "2017-04-24T19:23:45.645Z", "order_cooking": "2017-04-24T19:23:14.905Z", "order_accepted": "2017-04-24T18:41:12.475Z", "order_requested": "2017-04-24T18:39:49.296Z"}	\N	1493059272	f	f	\N	\N	\N	\N	\N	{"1500211372183519768": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1500211374398112281": {"title": "Beef Brisket", "options": ["Mashed Potatoes"], "quantity": 1, "selections": {}}, "1500211376562373146": {"title": "Beef Brisket", "options": ["Mac n Cheese"], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2097	Frank's BBQ	1095	2017-04-25 00:09:45.974202+05:30	2017-04-25 00:53:45.546223+05:30
1009	1499900295579173540	R$13.60	\N	\N	\N	2017-04-24 22:55:00+05:30	\N	{"order_paid": "2017-04-24T08:58:01.603Z", "order_ready": "2017-04-24T10:42:59.356Z", "order_cooking": "2017-04-24T10:42:12.559Z", "order_accepted": "2017-04-24T08:57:54.698Z", "order_picked_up": "2017-04-24T10:44:23.567Z", "order_requested": "2017-04-24T08:21:23.443Z"}	\N	1493024280	f	f	\N	\N	\N	\N	\N	{"1499900298095755941": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 13:51:21.079077+05:30	2017-04-24 16:14:23.463367+05:30
1012	1499979255927276258	R$17.60	\N	\N	\N	2017-04-25 01:30:00+05:30	\N	{"order_paid": "2017-04-24T10:58:29.389Z", "order_ready": "2017-04-24T12:36:44.836Z", "order_cooking": "2017-04-24T10:59:23.254Z", "order_accepted": "2017-04-24T10:58:22.782Z", "order_picked_up": "2017-04-24T13:19:47.000Z", "order_requested": "2017-04-24T10:58:13.645Z"}	\N	1493031508	f	f	\N	\N	\N	\N	\N	{"1499979258846511845": {"title": "Green Curry Regular", "options": [], "quantity": 2, "selections": {"Sauce": "Regular"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-24 16:28:11.306551+05:30	2017-04-24 18:52:20.620708+05:30
1010	1499917824406061734	R$11.60	\N	\N	\N	2017-04-24 23:25:00+05:30	\N	{"order_paid": "2017-04-24T08:57:39.965Z", "order_ready": "2017-04-24T10:44:44.332Z", "order_cooking": "2017-04-24T10:42:53.700Z", "order_accepted": "2017-04-24T08:57:32.019Z", "order_picked_up": "2017-04-24T10:51:53.690Z", "order_requested": "2017-04-24T08:56:07.472Z"}	\N	1493024259	t	f	\N	\N	\N	\N	\N	{"1499917827040084647": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-24 14:26:04.601306+05:30	2017-04-24 16:21:53.596478+05:30
1013	1499979669200437992	R$10.60	\N	\N	\N	2017-04-25 01:30:00+05:30	\N	{"order_paid": "2017-04-24T10:59:16.733Z", "order_ready": "2017-04-24T12:36:38.283Z", "order_cooking": "2017-04-24T10:59:32.163Z", "order_accepted": "2017-04-24T10:59:07.423Z", "order_picked_up": "2017-04-24T13:08:11.602Z", "order_requested": "2017-04-24T10:58:59.451Z"}	\N	1493031555	f	f	\N	\N	\N	\N	\N	{"1499979672044176105": {"title": "Mongolian Beef with Cashews White", "options": [], "quantity": 1, "selections": {"Rice": "White"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-24 16:28:57.23315+05:30	2017-04-24 18:38:11.476841+05:30
1017	1500213108516323867	R$17.60	\N	\N	\N	2017-04-25 00:45:00+05:30	\N	{"order_paid": "2017-04-24T18:44:39.039Z", "order_ready": "2017-04-24T19:28:42.372Z", "order_cooking": "2017-04-24T19:28:38.239Z", "order_accepted": "2017-04-24T18:43:16.000Z", "order_picked_up": "2017-04-24T21:01:59.490Z", "order_requested": "2017-04-24T18:42:46.609Z"}	\N	1493059478	f	f	\N	\N	\N	\N	\N	{"1500213111058072092": {"title": "Pulled Pork Sliders", "options": [], "quantity": 2, "selections": {}}}	\N	Dirk N	9019	2097	Frank's BBQ	1095	2017-04-25 00:12:44.470382+05:30	2017-04-25 02:31:59.395468+05:30
1018	1500221495740203556	R$31.60	\N	\N	\N	2017-04-25 01:00:00+05:30	\N	{"order_paid": "2017-04-24T19:21:18.159Z", "order_accepted": "2017-04-24T19:01:40.299Z", "order_requested": "2017-04-24T18:59:28.706Z", "order_dispatched": "2017-04-24T21:01:14.869Z"}	\N	\N	f	t	2017-04-25 01:15:00+05:30	6	{"city": "Natal-RN, 59078-600", "phone": "Bob / 444-3636", "state": null, "address1": "Av. Engenheiro Roberto Freire, 701", "address2": "Apt 2009", "nickname": "Ponta Negra Fiat"}	26	\N	{"1500221498357449253": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 1, "selections": {}}, "1500221500295217702": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1500221502283317799": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2097	Frank's BBQ	1095	2017-04-25 00:29:25.727149+05:30	2017-04-25 02:31:14.781638+05:30
1019	1500230492950102583	R$19.60	\N	\N	\N	2017-04-25 01:30:00+05:30	\N	{"order_accepted": "2017-04-24T19:18:10.934Z", "order_requested": "2017-04-24T19:17:43.661Z"}	\N	\N	f	t	2017-04-25 01:45:00+05:30	14	{"city": "Natal", "phone": "Marcy / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": null, "nickname": "Home"}	\N	\N	{"1500230509341442616": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 1, "selections": {}}, "1500230527133680185": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Marcy J	9018	2097	Frank's BBQ	1095	2017-04-25 00:47:29.375582+05:30	2017-04-25 00:48:10.856455+05:30
1029	1500349054347903743	R$28.60	\N	\N	\N	2017-04-25 05:15:00+05:30	\N	{"order_paid": "2017-04-24T23:13:29.730Z", "order_ready": "2017-04-24T23:15:30.387Z", "order_cooking": "2017-04-24T23:13:48.982Z", "order_accepted": "2017-04-24T23:13:21.914Z", "order_picked_up": "2017-04-25T14:54:54.426Z", "order_requested": "2017-04-24T23:12:54.324Z"}	\N	1493075608	f	f	\N	\N	\N	\N	\N	{"1500349056889651968": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1500349059196519169": {"title": "Cuban Sausage Melt", "options": ["Extra Beef"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-25 04:42:51.408994+05:30	2017-04-25 20:24:54.311513+05:30
1020	1500263079831667339	R$22.60	\N	\N	\N	2017-04-25 02:25:00+05:30	\N	{"order_paid": "2017-04-24T20:23:11.775Z", "order_ready": "2017-04-24T20:24:03.150Z", "order_cooking": "2017-04-24T20:23:46.569Z", "order_accepted": "2017-04-24T20:22:28.754Z", "order_picked_up": "2017-04-24T20:58:24.636Z", "order_requested": "2017-04-24T20:22:05.983Z"}	\N	1493065391	f	f	\N	\N	\N	\N	\N	{"1500263082373415564": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1500263084378292877": {"title": "Beef Brisket", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2097	Frank's BBQ	1095	2017-04-25 01:52:01.781826+05:30	2017-04-25 02:28:24.554171+05:30
966	1496927281426203325	R$28.60	\N	\N	\N	2017-04-20 08:25:00+05:30	\N	{"order_paid": "2017-04-20T05:59:01.098Z", "order_ready": "2017-04-20T05:59:30.551Z", "order_cooking": "2017-04-20T05:59:21.220Z", "order_accepted": "2017-04-20T05:58:54.297Z", "order_declined": "2017-04-20T08:57:10.419Z", "order_delivered": "2017-04-24T23:20:49.467Z", "order_requested": "2017-04-20T05:54:28.456Z", "order_dispatched": "2017-04-20T11:29:23.646Z"}	\N	1492711164	f	t	2017-04-20 08:40:00+05:30	15	{"city": null, "phone": "465329458", "state": null, "address1": "304, Princess Business Park", "address2": "Indore", "nickname": "Test Locations"}	9	\N	{"1496927283850511038": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}, "1496927285670838975": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}, "1496927287516332736": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-20 11:24:25.214772+05:30	2017-04-25 04:50:49.331213+05:30
1031	1500357995261854468	R$29.60	\N	\N	\N	2017-04-25 05:30:00+05:30	\N	{"order_paid": "2017-04-25T21:13:46.227Z", "order_accepted": "2017-04-25T21:13:39.406Z", "order_picked_up": "2017-04-25T21:29:40.867Z", "order_requested": "2017-04-24T23:30:40.944Z"}	\N	1493154830	f	f	\N	\N	\N	\N	\N	{"1500357997795214085": {"title": "Cuban Reuben", "options": ["Onion Rings"], "quantity": 1, "selections": {}}, "1500358000034972422": {"title": "Cuban Sausage Melt", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-25 05:00:38.048706+05:30	2017-04-26 02:59:40.78159+05:30
1030	1500355424958808834	R$8.60	\N	\N	\N	2017-04-25 05:40:00+05:30	\N	{"order_paid": "2017-04-24T23:26:32.503Z", "order_ready": "2017-04-24T23:27:03.012Z", "order_cooking": "2017-04-24T23:26:49.528Z", "order_accepted": "2017-04-24T23:26:20.332Z", "order_picked_up": "2017-04-24T23:27:32.562Z", "order_requested": "2017-04-24T23:25:31.096Z"}	\N	1493076393	f	f	\N	\N	\N	\N	\N	{"1500355427508945667": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-25 04:55:28.607477+05:30	2017-04-25 04:57:32.473775+05:30
1051	1501158477324615702	R$14.60	\N	\N	\N	2017-04-26 08:00:00+05:30	\N	{"order_requested": "2017-04-26T02:01:06.185Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501158479958638615": {"title": "Cuban Sausage Melt", "options": ["Curly Fries"], "quantity": 1, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-26 07:31:03.429376+05:30	2017-04-26 07:31:03.429376+05:30
1042	1501026478727365608	R$22.60	\N	\N	\N	2017-04-26 04:00:00+05:30	\N	{"order_declined": "2017-04-25T23:07:26.298Z", "order_requested": "2017-04-25T21:38:47.838Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501026481319445481": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1501026483383043050": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-04-26 03:08:44.971342+05:30	2017-04-26 04:37:26.206322+05:30
1041	1501022682261488613	R$18.60	\N	\N	\N	2017-04-26 03:50:00+05:30	\N	{"order_paid": "2017-04-25T22:17:14.098Z", "order_cooking": "2017-04-25T22:17:22.985Z", "order_accepted": "2017-04-25T22:17:06.468Z", "order_picked_up": "2017-04-25T23:08:34.410Z", "order_requested": "2017-04-25T21:31:28.581Z"}	\N	1493158638	f	f	\N	\N	\N	\N	\N	{"1501022684803236838": {"title": "Chicken Pesto Panini", "options": [], "quantity": 1, "selections": {}}, "1501022686757782503": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-26 03:01:25.722988+05:30	2017-04-26 04:38:34.329593+05:30
1066	1501440669317595381	R$9.60	\N	\N	\N	2017-04-27 01:55:00+05:30	\N	{"order_paid": "2017-04-26T15:04:23.016Z", "order_ready": "2017-04-26T15:04:33.099Z", "order_cooking": "2017-04-26T15:04:29.311Z", "order_accepted": "2017-04-26T15:04:14.132Z", "order_picked_up": "2017-04-26T15:14:46.054Z", "order_requested": "2017-04-26T11:21:59.660Z"}	\N	1493219062	f	f	\N	\N	\N	\N	\N	{"1501440672186499320": {"title": "Green Curry Regular", "options": [], "quantity": 1, "selections": {"Sauce": "Regular"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-26 16:51:56.713053+05:30	2017-04-26 20:44:45.970395+05:30
1050	1501095618901180420	R$33.60	\N	\N	\N	2017-04-26 06:25:00+05:30	\N	{"order_paid": "2017-04-25T23:57:23.863Z", "order_accepted": "2017-04-25T23:56:43.338Z", "order_requested": "2017-04-25T23:56:17.265Z"}	\N	1493164642	f	f	\N	\N	\N	\N	\N	{"1501095621468094469": {"title": "Chicken Pesto Panini", "options": ["Curly Fries"], "quantity": 2, "selections": {}}, "1501095623414251526": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-04-26 05:26:14.264838+05:30	2017-04-26 05:27:23.750678+05:30
1026	1500323439372665584	R$28.60	\N	\N	\N	2017-04-25 04:50:00+05:30	\N	{"order_paid": "2017-04-24T22:23:06.101Z", "order_ready": "2017-04-24T22:24:22.833Z", "order_cooking": "2017-04-24T22:23:20.580Z", "order_accepted": "2017-04-24T22:22:29.205Z", "order_delivered": "2017-04-25T23:59:12.380Z", "order_requested": "2017-04-24T22:22:00.378Z", "order_dispatched": "2017-04-25T21:29:07.886Z"}	\N	1493072585	f	t	2017-04-25 05:05:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	5	\N	{"1500323441964745457": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}, "1500323443919291122": {"title": "Cuban BLT Pomegranite Basil", "options": [], "quantity": 1, "selections": {"Bread": "Pomegranite Basil"}}, "1500323445873836787": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-25 03:51:57.082737+05:30	2017-04-26 05:29:12.272293+05:30
1074	1501988667390951786	R$14.60	\N	\N	\N	2017-04-27 20:00:00+05:30	\N	{"order_accepted": "2017-04-27T05:32:07.069Z", "order_requested": "2017-04-27T05:30:45.344Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501988669823648107": {"title": "French Dip", "options": ["French Fries"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2132	Crazy Jack's	1109	2017-04-27 11:00:42.870301+05:30	2017-04-27 11:02:06.937577+05:30
1088	1502331741820420437	R$15.60	\N	\N	\N	2017-04-27 22:55:00+05:30	\N	{"order_requested": "2017-04-27T16:52:13.390Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502331744412500310": {"title": "Valanish Burger", "options": [], "quantity": 2, "selections": {}}}	\N	Bob S	9009	2094	Thaitanic Xpress	1092	2017-04-27 22:22:11.283463+05:30	2017-04-27 22:22:11.283463+05:30
1076	1501996037932319086	R$7.60	\N	\N	\N	2017-04-27 20:15:00+05:30	\N	{"order_paid": "2017-04-27T05:46:44.862Z", "order_ready": "2017-04-27T05:47:23.274Z", "order_cooking": "2017-04-27T05:47:09.706Z", "order_accepted": "2017-04-27T05:46:38.438Z", "order_picked_up": "2017-04-27T06:12:30.549Z", "order_requested": "2017-04-27T05:45:09.860Z"}	\N	1493272003	f	f	\N	\N	\N	\N	\N	{"1501996040541176175": {"title": "Volcano Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-27 11:15:07.456661+05:30	2017-04-27 11:42:30.336964+05:30
1077	1501996718130987376	R$16.60	\N	\N	\N	2017-04-27 20:20:00+05:30	\N	{"order_paid": "2017-04-27T05:46:57.163Z", "order_ready": "2017-04-27T05:47:27.572Z", "order_cooking": "2017-04-27T05:47:14.646Z", "order_accepted": "2017-04-27T05:46:50.425Z", "order_picked_up": "2017-04-27T06:07:44.342Z", "order_requested": "2017-04-27T05:46:30.542Z"}	\N	1493272015	f	f	\N	\N	\N	\N	\N	{"1501996720622403953": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}, "1501996722543395186": {"title": "Volcano Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-27 11:16:27.651512+05:30	2017-04-27 11:37:44.167607+05:30
1079	1502238897780818346	R$14.60	\N	\N	\N	2017-04-28 04:20:00+05:30	\N	{"order_requested": "2017-04-27T13:48:07.321Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502238900515504555": {"title": "French Dip", "options": ["French Fries"], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2132	Crazy Jack's	1109	2017-04-27 19:18:05.064827+05:30	2017-04-27 19:18:05.064827+05:30
1078	1502008683146510707	R$10.60	\N	\N	\N	2017-04-27 20:40:00+05:30	\N	{"order_paid": "2017-04-27T06:10:36.509Z", "order_ready": "2017-04-27T06:10:55.784Z", "order_cooking": "2017-04-27T06:10:49.960Z", "order_accepted": "2017-04-27T06:10:29.710Z", "order_picked_up": "2017-04-28T06:43:06.646Z", "order_requested": "2017-04-27T06:10:22.022Z"}	\N	1493273435	f	f	\N	\N	\N	\N	\N	{"1502008686183186805": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-27 11:40:19.194314+05:30	2017-04-28 12:13:06.527546+05:30
1075	1501990340523983212	R$7.60	\N	\N	\N	2017-04-27 20:05:00+05:30	\N	{"order_paid": "2017-04-27T05:34:11.822Z", "order_ready": "2017-04-27T05:35:07.681Z", "order_cooking": "2017-04-27T05:35:02.518Z", "order_accepted": "2017-04-27T05:34:05.086Z", "order_picked_up": "2017-04-27T05:44:10.728Z", "order_requested": "2017-04-27T05:33:54.077Z"}	\N	1493271250	f	f	\N	\N	\N	\N	\N	{"1501990343501939053": {"title": "Volcano Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-27 11:03:51.84394+05:30	2017-04-27 11:27:48.134865+05:30
1056	1501343552582451528	R$13.60	\N	\N	\N	2017-04-26 22:40:00+05:30	\N	{"order_declined": "2017-04-27T15:14:33.964Z", "order_requested": "2017-04-26T08:09:22.060Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1501343554889318729": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-26 13:39:19.051174+05:30	2017-04-27 20:44:33.824321+05:30
1086	1502325526298100043	R$47.60	\N	\N	\N	2017-04-27 23:30:00+05:30	\N	{"order_accepted": "2017-04-27T16:40:03.702Z", "order_requested": "2017-04-27T16:39:49.272Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502325528856625484": {"title": "Cuban Reuben", "options": [], "quantity": 3, "selections": {}}, "1502325530836336973": {"title": "Cuban Sausage Melt", "options": [], "quantity": 1, "selections": {}}}	\N	Luiz C	9021	2096	Classy Cuban	1094	2017-04-27 22:09:45.348186+05:30	2017-04-27 22:10:03.602387+05:30
1082	1502282217827598634	R$26.60	\N	\N	\N	2017-04-27 21:30:00+05:30	\N	{"order_paid": "2017-04-27T15:14:50.540Z", "order_ready": "2017-04-27T15:15:53.676Z", "order_cooking": "2017-04-27T15:15:43.432Z", "order_accepted": "2017-04-27T15:14:42.526Z", "order_picked_up": "2017-04-27T15:17:01.732Z", "order_requested": "2017-04-27T15:14:09.797Z"}	\N	1493306094	f	f	\N	\N	\N	\N	\N	{"1502282220360958251": {"title": "Cuban Sausage Melt", "options": ["Curly Fries"], "quantity": 1, "selections": {}}, "1502282222315503916": {"title": "Chicken Pesto Panini", "options": ["Salad"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-04-27 20:44:06.916316+05:30	2017-04-27 20:47:01.554383+05:30
1081	1502265072586588606	R$17.60	\N	\N	\N	2017-04-28 05:10:00+05:30	\N	{"order_accepted": "2017-04-27T15:21:11.282Z", "order_requested": "2017-04-27T14:39:41.092Z"}	\N	\N	f	t	2017-04-28 05:25:00+05:30	15	{"city": null, "phone": "465329458", "state": null, "address1": "304, Princess Business Park", "address2": "Indore", "nickname": "Test Locations"}	\N	\N	{"1502265075430326719": {"title": "Valanish Burger", "options": [], "quantity": 1, "selections": {}}, "1502265077628142016": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-27 20:09:38.339202+05:30	2017-04-27 20:51:11.178577+05:30
1098	1502850796444713533	R$13.60	\N	\N	\N	2017-04-29 12:35:00+05:30	\N	{"no_show": "2017-04-28T10:05:14.394Z", "order_paid": "2017-04-28T10:04:46.886Z", "order_accepted": "2017-04-28T10:04:30.485Z", "order_requested": "2017-04-28T10:03:37.228Z"}	\N	1493417108	f	f	\N	\N	\N	\N	\N	{"1502850799565275710": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}, "1502850801419158079": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:33:34.427183+05:30	2017-04-28 15:35:14.272039+05:30
1024	1500298657730134745	R$21.60	\N	\N	\N	2017-04-25 04:00:00+05:30	\N	{"order_paid": "2017-04-24T21:33:42.088Z", "order_ready": "2017-04-27T15:42:10.584Z", "order_cooking": "2017-04-24T21:33:50.989Z", "order_accepted": "2017-04-24T21:33:34.582Z", "order_delivered": "2017-04-28T06:51:57.717Z", "order_requested": "2017-04-24T21:33:18.952Z", "order_dispatched": "2017-04-28T06:43:13.316Z"}	\N	1493069614	f	t	2017-04-25 04:15:00+05:30	2	{"city": "Natal", "phone": "Bob / 555-9988", "state": "RN", "address1": "Av. Engenheiro Roberto Freire, 2610 - Ponta Negra, Natal - RN, 59090-000", "address2": "Apt 67", "nickname": "Camarões"}	23	\N	{"1500298660431266522": {"title": "Mongolian Beef with Cashews Pork Fried Rice", "options": [], "quantity": 1, "selections": {"Rice": "Pork Fried Rice"}}, "1500298662494864091": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-04-25 03:03:16.269288+05:30	2017-04-28 12:21:57.53019+05:30
1084	1502316057354830143	R$23.60	\N	\N	\N	2017-04-27 23:00:00+05:30	\N	{"order_paid": "2017-04-27T16:21:59.120Z", "order_ready": "2017-04-27T16:23:56.624Z", "order_cooking": "2017-04-27T16:23:28.577Z", "order_accepted": "2017-04-27T16:21:52.415Z", "order_requested": "2017-04-27T16:20:59.249Z"}	\N	1493310124	f	f	\N	\N	\N	\N	\N	{"1502316059930132800": {"title": "Buffalo Wings", "options": [], "quantity": 1, "selections": {}}, "1502316061976953153": {"title": "Chicken Pesto Panini", "options": [], "quantity": 2, "selections": {}}}	\N	Luiz C	9021	2096	Classy Cuban	1094	2017-04-27 21:50:55.629492+05:30	2017-04-27 21:53:56.526212+05:30
1085	1502316125906534722	R$45.60	\N	\N	\N	2017-04-27 23:00:00+05:30	\N	{"order_paid": "2017-04-27T16:22:09.085Z", "order_cooking": "2017-04-27T16:25:07.706Z", "order_accepted": "2017-04-27T16:22:02.914Z", "order_requested": "2017-04-27T16:21:08.682Z"}	\N	1493310134	f	f	\N	\N	\N	\N	\N	{"1502316129152926019": {"title": "Buffalo Wings", "options": [], "quantity": 2, "selections": {}}, "1502316131753394500": {"title": "Chicken Pesto Panini", "options": [], "quantity": 4, "selections": {}}}	\N	Luiz C	9021	2096	Classy Cuban	1094	2017-04-27 21:51:05.35739+05:30	2017-04-27 21:55:07.608937+05:30
1023	1500295906031829718	R$31.60	\N	\N	\N	2017-04-25 03:25:00+05:30	\N	{"order_paid": "2017-04-24T21:27:50.635Z", "order_ready": "2017-04-24T21:28:12.076Z", "order_cooking": "2017-04-24T21:28:03.778Z", "order_accepted": "2017-04-24T21:27:43.442Z", "order_picked_up": "2017-04-27T17:52:18.052Z", "order_requested": "2017-04-24T21:27:20.005Z"}	\N	1493069263	f	f	\N	\N	\N	\N	\N	{"1500295908531634903": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1500295910469403352": {"title": "Beef Brisket", "options": [], "quantity": 2, "selections": {}}}	\N	Stacy B	9008	2097	Frank's BBQ	1095	2017-04-25 02:57:17.26493+05:30	2017-04-27 23:22:17.944634+05:30
1089	1502335739159904599	R$17.60	\N	\N	\N	2017-04-27 23:00:00+05:30	\N	{"order_paid": "2017-04-27T17:01:07.975Z", "order_ready": "2017-04-27T17:02:32.265Z", "order_cooking": "2017-04-27T17:02:19.108Z", "order_accepted": "2017-04-27T17:01:02.835Z", "order_picked_up": "2017-04-27T17:03:36.666Z", "order_requested": "2017-04-27T17:00:20.043Z"}	\N	1493312472	f	f	\N	\N	\N	\N	\N	{"1502335741760373080": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}, "1502335743714918745": {"title": "Valanish Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-27 22:30:16.386542+05:30	2017-04-27 22:33:36.542333+05:30
1032	1500823397565727548	R$18.60	\N	\N	\N	2017-04-25 20:55:00+05:30	\N	{"order_paid": "2017-04-25T14:56:23.697Z", "order_ready": "2017-04-25T14:57:01.621Z", "order_cooking": "2017-04-25T14:56:48.877Z", "order_accepted": "2017-04-25T14:56:13.644Z", "order_picked_up": "2017-04-27T17:51:44.247Z", "order_requested": "2017-04-25T14:55:22.375Z"}	\N	1493132183	f	f	\N	\N	\N	\N	\N	{"1500823400141030205": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 1, "selections": {}}, "1500823402095575870": {"title": "Pulled Pork Sliders", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2097	Frank's BBQ	1095	2017-04-25 20:25:19.266494+05:30	2017-04-27 23:21:44.129942+05:30
1090	1502360922641924457	R$62.60	\N	\N	\N	2017-04-27 23:50:00+05:30	\N	{"order_paid": "2017-04-27T17:50:57.305Z", "order_ready": "2017-04-27T17:53:28.116Z", "order_cooking": "2017-04-27T17:53:00.236Z", "order_accepted": "2017-04-27T17:50:50.906Z", "order_picked_up": "2017-04-27T17:54:11.573Z", "order_requested": "2017-04-27T17:50:17.524Z"}	\N	1493315461	f	f	\N	\N	\N	\N	\N	{"1502360925359833450": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 2, "selections": {}}, "1502360927356322155": {"title": "Pulled Pork Sliders", "options": [], "quantity": 1, "selections": {}}, "1502360929327645036": {"title": "Full Slab of Ribs", "options": [], "quantity": 1, "selections": {}}, "1502360931416408429": {"title": "Beef Brisket", "options": ["Mac n Cheese"], "quantity": 1, "selections": {}}, "1502360933471617390": {"title": "Beef Brisket", "options": ["Mashed Potatoes"], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2097	Frank's BBQ	1095	2017-04-27 23:20:13.236953+05:30	2017-04-27 23:24:11.451764+05:30
1091	1502762752886702630	R$11.60	\N	\N	\N	2017-04-29 09:40:00+05:30	\N	{"no_show": "2017-04-28T08:52:48.273Z", "order_paid": "2017-04-28T07:12:58.921Z", "order_accepted": "2017-04-28T07:12:51.337Z", "order_requested": "2017-04-28T07:09:05.857Z"}	\N	1493406801	f	f	\N	\N	\N	\N	\N	{"1502762755336176167": {"title": "Ham Salsa", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 12:39:03.536639+05:30	2017-04-28 14:22:48.1744+05:30
1094	1502790708308738606	R$15.60	\N	\N	\N	2017-04-29 10:35:00+05:30	\N	{"no_show": "2017-04-28T08:52:59.555Z", "order_paid": "2017-04-28T08:45:43.494Z", "order_accepted": "2017-04-28T08:05:00.970Z", "order_requested": "2017-04-28T08:04:01.342Z"}	\N	1493412364	f	f	\N	\N	\N	\N	\N	{"1502790710808543791": {"title": "Valanish Burger", "options": [], "quantity": 2, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 13:33:59.055697+05:30	2017-04-28 14:22:59.449088+05:30
1099	1502852537701630532	R$13.60	\N	\N	\N	2017-04-29 12:40:00+05:30	\N	{"no_show": "2017-04-28T10:11:49.464Z", "order_paid": "2017-04-28T10:08:06.313Z", "order_accepted": "2017-04-28T10:07:34.509Z", "order_requested": "2017-04-28T10:06:54.570Z"}	\N	1493417308	f	f	\N	\N	\N	\N	\N	{"1502852540369207877": {"title": "Valanish Burger", "options": [], "quantity": 1, "selections": {}}, "1502852542231478854": {"title": "Cashew Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:36:50.207721+05:30	2017-04-28 15:41:49.369574+05:30
1093	1502772144772219434	R$11.60	\N	\N	\N	2017-04-29 10:00:00+05:30	\N	{"order_declined": "2017-04-28T07:36:54.860Z", "order_requested": "2017-04-28T07:27:08.940Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502772147272024619": {"title": "Ham Salsa", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 12:57:06.857988+05:30	2017-04-28 13:06:54.753388+05:30
1095	1502792574505583152	R$6.60	\N	\N	\N	2017-04-29 10:40:00+05:30	\N	{"no_show": "2017-04-28T09:57:55.044Z", "order_paid": "2017-04-28T08:57:32.886Z", "order_accepted": "2017-04-28T08:47:09.715Z", "order_requested": "2017-04-28T08:07:49.729Z"}	\N	1493413074	f	f	\N	\N	\N	\N	\N	{"1502792576996999729": {"title": "Cashew Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 13:37:47.399294+05:30	2017-04-28 15:27:54.944052+05:30
1111	1505132174842528347	R$10.60	\N	\N	\N	2017-05-02 16:05:00+05:30	\N	{"order_requested": "2017-05-01T13:36:25.484Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1505132177342333532": {"title": "Smoked Cheddar Melt", "options": [], "quantity": 1, "selections": {}}}	\N	samule t	9025	2097	Frank's BBQ	1095	2017-05-01 19:06:23.17229+05:30	2017-05-01 19:06:23.17229+05:30
1097	1502846835285295673	R$18.60	\N	\N	\N	2017-04-29 12:25:00+05:30	\N	{"no_show": "2017-04-28T09:57:59.943Z", "order_paid": "2017-04-28T09:56:58.356Z", "order_accepted": "2017-04-28T09:56:17.544Z", "order_requested": "2017-04-28T09:55:36.771Z"}	\N	1493416640	f	f	\N	\N	\N	\N	\N	{"1502846837726380602": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}, "1502846839580262971": {"title": "Cashew Curry", "options": [], "quantity": 1, "selections": {}}, "1502846841417368124": {"title": "Panang Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:25:33.332679+05:30	2017-04-28 15:27:59.375608+05:30
1092	1502770463401574952	R$8.60	\N	\N	\N	2017-04-29 09:55:00+05:30	\N	{"no_show": "2017-04-28T08:52:52.290Z", "order_paid": "2017-04-28T07:36:32.284Z", "order_accepted": "2017-04-28T07:36:21.012Z", "order_requested": "2017-04-28T07:23:55.619Z"}	\N	1493408214	f	f	\N	\N	\N	\N	\N	{"1502770465859437097": {"title": "Valanish Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 12:53:53.423755+05:30	2017-04-28 14:22:52.192207+05:30
1102	1502858314860462673	R$6.60	\N	\N	\N	2017-04-29 12:50:00+05:30	\N	{"no_show": "2017-04-28T10:28:06.913Z", "order_paid": "2017-04-28T10:20:28.909Z", "order_accepted": "2017-04-28T10:20:21.500Z", "order_requested": "2017-04-28T10:18:30.049Z"}	\N	1493418050	f	f	\N	\N	\N	\N	\N	{"1502858318132019794": {"title": "Cashew Curry", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:48:27.870464+05:30	2017-04-28 15:58:06.808371+05:30
1096	1502814427383071287	R$9.60	\N	\N	\N	2017-04-29 11:25:00+05:30	\N	{"order_paid": "2017-04-28T09:36:17.470Z", "order_accepted": "2017-04-28T08:58:21.650Z", "order_picked_up": "2017-04-28T10:05:17.424Z", "order_requested": "2017-04-28T08:51:12.733Z"}	\N	1493415399	f	f	\N	\N	\N	\N	\N	{"1502814430100980280": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 14:21:10.305517+05:30	2017-04-28 15:35:17.322831+05:30
1101	1502855485584310862	R$11.60	\N	\N	\N	2017-04-29 12:45:00+05:30	\N	{"order_paid": "2017-04-28T10:15:00.064Z", "order_accepted": "2017-04-28T10:14:48.505Z", "order_picked_up": "2017-04-28T10:22:47.530Z", "order_requested": "2017-04-28T10:12:43.562Z"}	\N	1493417722	f	f	\N	\N	\N	\N	\N	{"1502855488042173007": {"title": "Ham Salsa", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:42:41.443288+05:30	2017-04-28 15:52:47.392138+05:30
1100	1502854036963983944	R$9.60	\N	\N	\N	2017-04-29 12:40:00+05:30	\N	{"order_paid": "2017-04-28T10:11:10.614Z", "order_accepted": "2017-04-28T10:10:53.938Z", "order_picked_up": "2017-04-28T10:11:42.620Z", "order_requested": "2017-04-28T10:09:56.638Z"}	\N	1493417492	f	f	\N	\N	\N	\N	\N	{"1502854039438623305": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:39:54.459416+05:30	2017-04-28 15:41:42.511546+05:30
1103	1502860839143604819	R$9.60	\N	\N	\N	2017-04-29 12:55:00+05:30	\N	{"order_paid": "2017-04-28T10:25:37.626Z", "order_accepted": "2017-04-28T10:25:16.139Z", "order_picked_up": "2017-04-28T10:28:14.418Z", "order_requested": "2017-04-28T10:23:38.139Z"}	\N	1493418359	f	f	\N	\N	\N	\N	\N	{"1502860841601466964": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:53:35.89654+05:30	2017-04-28 15:58:14.292133+05:30
1105	1502863706898301527	R$9.60	\N	\N	\N	2017-04-29 13:00:00+05:30	\N	{"order_paid": "2017-04-28T10:50:49.972Z", "order_accepted": "2017-04-28T10:50:22.437Z", "order_picked_up": "2017-04-28T11:04:27.566Z", "order_requested": "2017-04-28T10:29:05.251Z"}	\N	1493419871	f	f	\N	\N	\N	\N	\N	{"1502863709330997848": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:59:03.08025+05:30	2017-04-28 16:34:27.476833+05:30
1104	1502863254081241685	R$8.60	\N	\N	\N	2017-04-29 13:00:00+05:30	\N	{"no_show": "2017-04-28T11:04:05.056Z", "order_paid": "2017-04-28T10:50:49.999Z", "order_accepted": "2017-04-28T10:50:30.674Z", "order_requested": "2017-04-28T10:28:20.938Z"}	\N	1493419871	f	f	\N	\N	\N	\N	\N	{"1502863256631378518": {"title": "Valanish Burger", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 15:58:18.726165+05:30	2017-04-28 16:34:04.929982+05:30
1107	1502885076776518242	R$10.60	\N	\N	\N	2017-04-29 13:45:00+05:30	\N	{"order_declined": "2017-04-28T11:20:31.896Z", "order_requested": "2017-04-28T11:11:37.367Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502885079972577892": {"title": "Green Curry Spicy", "options": [], "quantity": 1, "selections": {"Sauce": "Spicy"}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 16:41:34.998688+05:30	2017-04-28 16:50:31.797437+05:30
1116	1505173157017813867	R$55.60	\N	\N	\N	2017-05-01 21:00:00+05:30	\N	{"order_requested": "2017-05-01T14:57:33.095Z"}	\N	\N	f	t	2017-05-01 21:15:00+05:30	17	{"city": "Natal", "phone": "84999999999", "state": null, "address1": "Testando", "address2": "100", "nickname": "Teste"}	\N	\N	{"1505173159744111468": {"title": "Carne Asada Plate", "options": [], "quantity": 4, "selections": {}}, "1505173161866429293": {"title": "Delivery Charge", "options": [], "quantity": 1, "selections": {}}}	\N	luiz C	9022	2133	Paco's Tacos	1110	2017-05-01 20:27:30.390034+05:30	2017-05-01 20:27:30.390034+05:30
1108	1502888073732555370	R$11.60	\N	\N	\N	2017-04-29 13:50:00+05:30	\N	{"order_accepted": "2017-04-28T11:20:17.930Z", "order_requested": "2017-04-28T11:17:27.357Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1502888076240749163": {"title": "Submariner Gargonzola", "options": [], "quantity": 1, "selections": {"Cheese": "Gargonzola"}}}	\N	Dirk N	9019	2132	Crazy Jack's	1109	2017-04-28 16:47:24.536025+05:30	2017-04-28 16:50:17.834033+05:30
1106	1502883203289973344	R$9.60	\N	\N	\N	2017-04-29 13:40:00+05:30	\N	{"order_paid": "2017-04-28T11:20:26.663Z", "order_accepted": "2017-04-28T11:20:13.059Z", "order_requested": "2017-04-28T11:07:46.839Z"}	\N	1493421648	f	f	\N	\N	\N	\N	\N	{"1502883205739446881": {"title": "vegi Blast", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2094	Thaitanic Xpress	1092	2017-04-28 16:37:44.39561+05:30	2017-04-28 16:50:26.561384+05:30
1109	1504432626331550445	R$21.60	\N	\N	\N	2017-04-30 21:00:00+05:30	\N	{"order_requested": "2017-04-30T14:26:17.112Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1504432629032682222": {"title": "French Dip", "options": [], "quantity": 2, "selections": {}}}	\N	luiz C	9022	2132	Crazy Jack's	1109	2017-04-30 19:56:14.284267+05:30	2017-04-30 19:56:14.284267+05:30
1115	1505172151399875431	R$141.60	\N	\N	\N	2017-05-01 21:30:00+05:30	\N	{"order_accepted": "2017-05-01T15:33:57.460Z", "order_requested": "2017-05-01T14:55:32.900Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1505172154092618600": {"title": "Pork Plate", "options": [], "quantity": 6, "selections": {}}, "1505172156181381993": {"title": "Cuban Reuben", "options": [], "quantity": 4, "selections": {}}, "1505172158270145386": {"title": "Cuban Sausage Melt", "options": [], "quantity": 2, "selections": {}}}	\N	luiz C	9022	2096	Classy Cuban	1094	2017-05-01 20:25:29.234713+05:30	2017-05-01 21:03:57.354717+05:30
1112	1505157524880360421	R$13.60	\N	\N	\N	2017-05-02 17:00:00+05:30	\N	{"no_show": "2017-05-01T15:05:50.802Z", "order_paid": "2017-05-01T14:27:15.112Z", "order_accepted": "2017-05-01T14:27:03.874Z", "order_requested": "2017-05-01T14:26:44.725Z"}	\N	1493692052	f	f	\N	\N	\N	\N	\N	{"1505157528210637798": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2096	Classy Cuban	1094	2017-05-01 19:56:42.174462+05:30	2017-05-01 20:35:50.706752+05:30
1110	1505086743827710351	R$11.60	\N	\N	\N	2017-05-02 14:35:00+05:30	\N	{"order_declined": "2017-05-01T12:07:24.290Z", "order_requested": "2017-05-01T12:06:15.274Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1505086746394624400": {"title": "Ham Salsa", "options": [], "quantity": 1, "selections": {}}}	\N	Stacy B	9008	2094	Thaitanic Xpress	1092	2017-05-01 17:36:13.074464+05:30	2017-05-01 17:37:24.17218+05:30
1117	1505176103180829679	R$13.60	\N	\N	\N	2017-05-01 10:35:00+05:30	\N	{"no_show": "2017-05-01T15:06:03.561Z", "order_paid": "2017-05-01T15:04:18.577Z", "order_accepted": "2017-05-01T15:04:11.957Z", "order_requested": "2017-05-01T15:03:42.550Z"}	\N	1493582575	f	f	\N	\N	\N	\N	\N	{"1505176105672246256": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-05-01 20:33:39.95662+05:30	2017-05-01 20:36:03.472974+05:30
1119	1505185178429947908	R$25.60	\N	\N	\N	2017-05-01 10:50:00+05:30	\N	{"order_paid": "2017-05-01T15:22:08.548Z", "order_accepted": "2017-05-01T15:22:02.862Z", "order_requested": "2017-05-01T15:21:42.836Z"}	\N	1493583645	f	f	\N	\N	\N	\N	\N	{"1505185181818945541": {"title": "Pork Plate", "options": [], "quantity": 2, "selections": {}}}	\N	Bob S	9009	2096	Classy Cuban	1094	2017-05-01 20:51:40.237482+05:30	2017-05-01 20:52:08.465909+05:30
1118	1505178801275929591	R$13.60	\N	\N	\N	2017-05-01 10:40:00+05:30	\N	{"order_paid": "2017-05-01T15:09:42.414Z", "order_accepted": "2017-05-01T15:09:36.194Z", "order_requested": "2017-05-01T15:09:11.411Z"}	\N	1493582899	f	f	\N	\N	\N	\N	\N	{"1505178804555875320": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-05-01 20:39:07.321101+05:30	2017-05-01 20:39:42.317399+05:30
1114	1505161420063376365	R$13.60	\N	\N	\N	2017-05-02 17:05:00+05:30	\N	{"no_show": "2017-05-01T15:06:22.556Z", "order_paid": "2017-05-01T14:34:55.935Z", "order_accepted": "2017-05-01T14:34:48.744Z", "order_requested": "2017-05-01T14:34:25.401Z"}	\N	1493692513	f	f	\N	\N	\N	\N	\N	{"1505161423125218286": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-05-01 20:04:22.9598+05:30	2017-05-01 20:36:22.478049+05:30
1113	1505159618987295723	R$13.60	\N	\N	\N	2017-05-02 17:00:00+05:30	\N	{"no_show": "2017-05-01T15:05:29.141Z", "order_paid": "2017-05-01T14:31:33.420Z", "order_accepted": "2017-05-01T14:31:26.263Z", "order_requested": "2017-05-01T14:30:55.190Z"}	\N	1493692310	f	f	\N	\N	\N	\N	\N	{"1505159621789090796": {"title": "Cuban Reuben", "options": [], "quantity": 1, "selections": {}}}	\N	Dirk N	9019	2096	Classy Cuban	1094	2017-05-01 20:00:52.83809+05:30	2017-05-01 20:35:29.054012+05:30
1120	1505190689619574804	R$13.60	\N	\N	\N	2017-05-01 11:00:00+05:30	\N	{"order_requested": "2017-05-01T15:32:43.311Z"}	\N	\N	f	f	\N	\N	\N	\N	\N	{"1505190692077436949": {"title": "Pork Plate", "options": [], "quantity": 1, "selections": {}}}	\N	silvia d	9027	2096	Classy Cuban	1094	2017-05-01 21:02:40.094365+05:30	2017-05-01 21:02:40.094365+05:30
\.


--
-- Data for Name: order_state; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_state (id, order_id, order_requested_step, order_accepted_step, order_pay_fail, order_paid_step, order_in_queue_step, order_cooking_step, order_ready_step, order_dispatched_step, order_picked_up_step, order_no_show_step, order_delivered_step, apicall, paramstring, errorinfo, callinfo) FROM stdin;
\.


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.requests (id, customer_id, request_name, request_photo, category_id, latitude, longitude, created_at, modified_at, is_deleted, request_description, condition, buy_back_term, country, state, territory) FROM stdin;
4	9001	Test Postman	http://en.freejpg.com.ar/asset/400/ba/baaa/F100011052.jpg	1	140.4500	204.1200	2018-04-17 10:18:06.480154	2018-04-17 10:18:06.480154	f	\N	\N	\N	\N	\N	\N
7	9001	Test Postman 1	http://en.freejpg.com.ar/asset/400/ba/baaa/F100011052.jpg	1	140.4500	204.1200	2018-04-18 06:01:46.19811	2018-04-18 06:01:46.19811	f	Very Nice IPHone 5 with cable	Branch New	3 Months	\N	\N	\N
8	9001	Test Postman 2	http://en.freejpg.com.ar/asset/400/ba/baaa/F100011052.jpg	1	140.4500	204.1200	2018-04-18 06:01:52.04494	2018-04-18 06:01:52.04494	t	Very Nice IPHone 5 with cable	Branch New	3 Months	\N	\N	\N
1	9001	Test Postman 2 BY Rahul	http://en.freejpg.com.ar/asset/900/ba/baaa/F100011052.jpg	1	140.4500	105.1400	2018-04-17 05:55:13.653735	2018-04-17 11:25:13.653735	t	\N	\N	3 Months	\N	\N	\N
\.


--
-- Data for Name: review_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_approvals (id, review_id, reviewer_id, status, created_at, updated_at) FROM stdin;
2	13	\N	\N	2017-04-04 07:49:50.787784+05:30	2017-04-04 07:49:50.787784+05:30
\.


--
-- Data for Name: review_states; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_states (id, name, allowed_transitions) FROM stdin;
1	New	{2,3,4}
2	Approved	{3}
3	Updated	{2,4}
4	Disapproved	{3}
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, comment, rating, answers, customer_id, company_id, unit_id, status, power_reviewer, power_title, reviewer_name, review_photo, created_at, updated_at, contract_id) FROM stdin;
13	Best tacos in Austin	\N	{"answers":[{"answer":4},{"answer":5},{"answer":4},{"answer":5}]}	9008	1092	2094	New	f	\N	\N	\N	2017-04-04 07:49:50.787784+05:30	2017-04-04 07:49:50.787784+05:30	\N
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, type) FROM stdin;
1	CUSTOMER
2	OWNER
3	UNITMGR
4	ADMIN
5	DRIVER
6	FOODPARKMGR
\.


--
-- Data for Name: search_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.search_preferences (id, customer_id, territory_id, distance, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: square_unit; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.square_unit (unit_id, location_id) FROM stdin;
\.


--
-- Data for Name: square_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.square_user (merchant_id, expires_at, access_token, user_id) FROM stdin;
\.


--
-- Data for Name: territories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.territories (id, city, territory, state, country, country_id, timezone, latitude, longitude, created_at, updated_at, is_deleted) FROM stdin;
1	Natal	 Natal-RN	RN	Brazil	1	Buenos Aires	-5.77718199999999982	-35.2003229999999974	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
2	Sao Paolo	 Sao Paolo-SP	RN	Brazil	1	Brasilia	-23.5500000000000007	-46.6333330000000004	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
3	Ponta Negra	 Ponta Negra-RN	RN	Brazil	1	Buenos Aires	-6.22899400000000014	-35.0487759999999966	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
4	Austin	 Austin-TX	TX	USA	2	Central Time (US & Canada)	30.2643169999999984	-97.7382280000000065	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
5	Pflugerville	 Pflugerville-TX	TX	USA	2	Central Time (US & Canada)	30.4400000000000013	-97.6200000000000045	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
6	Round Rock	 Round Rock-TX	TX	USA	2	Central Time (US & Canada)	30.5079999999999991	-97.6779999999999973	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
7	Fort Lauderdale	 Fort Lauderdale-TX	FL	USA	2	Eastern Time (US & Canada)	26.1219999999999999	-80.1370000000000005	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
8	Miami	 Miami-FL	FL	USA	2	Eastern Time (US & Canada)	25.7620000000000005	-80.1899999999999977	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
9	Coral Gables	 Coral Gables-FL	FL	USA	2	Eastern Time (US & Canada)	25.7220000000000013	-80.2690000000000055	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
10	Denver	 Denver-CO	CO	USA	2	Mountain Time (US & Canada)	39.7460000000000022	-104.992000000000004	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
11	Aurora	 Aurora-CO	CO	USA	2	Mountain Time (US & Canada)	39.7250000000000014	-104.846999999999994	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
12	Lakewood	 Lakewood-CO	CO	USA	2	Mountain Time (US & Canada)	39.7109999999999985	-105.081000000000003	2016-09-07 04:30:00+05:30	2017-03-05 01:26:28.353788+05:30	f
13	\N	Fortaleza	\N	\N	2	\N	-56	-10	2017-04-09 07:55:58.836362+05:30	2017-04-09 07:55:58.836362+05:30	f
\.


--
-- Data for Name: unit_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unit_types (id, type) FROM stdin;
1	TRUCK
2	CART
3	RESTAURANT
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.units (id, name, number, type, customer_order_window, prep_notice, delivery, delivery_time_offset, delivery_chg_amount, delivery_radius, description, username, password, qr_code, phone, apns_id, fcm_id, gcm_id, device_type, unit_order_sys_id, territory_id, company_id, unit_mgr_id, created_at, updated_at, currency_id, currency, payment, is_deleted) FROM stdin;
2003	Pacos Tacos Truck 12	1	TRUCK	10	\N	f	\N	\N	\N	\N	mptruck64five	mptruck64five	\N	\N	\N	\N	\N	\N	\N	\N	1006	11009	2017-02-01 05:02:49.181663+05:30	2017-02-06 14:59:12.298814+05:30	1435543251393183865	BRL	SumUp	f
2097	Frank Truck #1	1	TRUCK	30	25	t	15	\N	10	\N	franktruck1	frank	\N	\N	\N	\N	APA91bF41fPOdQzdOqqrYwNYjEMSBmrfbQAwxgRrGKm2DIbYzRA3SYAfAJcwzfcYQZLR4s_hvyvfUkxEpEGTZK9az5OzCAjiRdI7YZku8e49upnJE-aZkvo	\N	\N	1	1095	11230	2017-03-29 00:42:11.61453+05:30	2017-04-28 04:07:48.184656+05:30	1435543251393183865	BRL	SumUp	f
2128	Truck 3	4	TRUCK	30	30	f	10	\N	5	\N	fogo116	fogo116	\N	\N	\N	\N	APA91bGh8hKQ32M2cdtMNY3h-l2gY2t29KlmUYTR_YGZ4xyQMiPv54erfcgcy1B9TZZTDKYUQq_UeYWSlwfeVirMRannny8R2O6Oss3rwO1YCtFiyUI3nnkf6R2gWVMHqS4HntFAJ_bd	\N	\N	3	1092	11276	2017-04-10 05:42:05.829061+05:30	2017-04-27 15:33:05.257257+05:30	1435543251393183865	BRL	SumUp	f
2002	Thaitanic Cart 1	1	CART	20	\N	f	\N	\N	\N	\N	mptruck64	mptruck64	\N	\N	\N	\N	APA91bGLPDm96TAg6C77VrwxlP1Nk11Md-hSRZGLOjS8CoECWfEFjp1Ise1_GRolqix4jydowaJ9d8OKxJMoiH3_qc0VEGNdqKiQ66Jbb_mneP-0T5qm4IK3RPZMKQlu9j2T7gOJGg0B	\N	\N	\N	1001	11008	2017-02-01 05:02:49.181663+05:30	2017-03-29 00:37:52.733603+05:30	1435543251393183865	BRL	SumUp	f
2132	Crazy Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	crazytruck1	crazy	\N	\N	\N	\N	APA91bG2DPnoMR-TkhhHcixL-8uP6Rm5YN0UCqv5rv1nHdzkt3TrkqbQDvrmp5dRGkQorWx3r_zZGDS1Yi2_muJoMY61RThXVfBJJ-MpF2pZbtyqDr89NFI	\N	\N	1	1109	11287	2017-04-12 17:32:04.700899+05:30	2017-04-27 21:42:48.43914+05:30	1435543251393183865	BRL	SumUp	f
2136	D Truck #1	1	TRUCK	30	25	t	\N	\N	10	\N	destructodentruck1	smiley66	\N	\N	\N	\N	APA91bG3q71WUOuK06XcUDiWTYK1bBJU7GSMv4VC8bxugs5Y-sRVOryb_KG-92mbwci8szGJOQTIUwMWm6Njn_BYK-aN1CDBl1CalcLdh-nWUt6N8YBbQBo	\N	\N	1	1112	11302	2017-04-25 00:45:07.450343+05:30	2017-04-27 02:24:11.879448+05:30	1435543251393183865	BRL	SumUp	f
2075	Grilla Truck #1	1	CART	20	15	t	15	\N	10	\N	grilla26	grilla26	\N	\N	\N	\N	APA91bHCWKDYBbt3JL7ajuPyrZP3ASQP1XeNn4_-EBaxSPm3HAUG6Xjb9QpQF68IoZ3AeH9KEgvcfXWfLFgbPq25HIG2m5OCh-C-IsLLoyLXCr7EqS_vcWk	\N	\N	1	1008	11174	2017-02-06 15:21:07.210394+05:30	2017-05-01 20:46:15.039601+05:30	1435543251393183865	BRL	SumUp	f
2094	Fogo Truck #1	1	TRUCK	30	25	t	15	\N	10	\N	fogotruck1	fogo	\N	\N	\N	\N	APA91bFWVXFrQz5B8wA6K8qIOqdbyC0pDtnR3Kd_4XqN3tZj0cH-FNwUzmOcq0eFT60ZnR29ocaafc2ztCQ1AiO3NRqbpLVLazbFq1QAQ6CNBlpw6xDWSgg	\N	\N	1	1092	11224	2017-03-24 21:24:11.300743+05:30	2017-05-01 20:30:09.925919+05:30	1435543251393183865	BRL	SumUp	f
2127	Truck #2	4	TRUCK	30	30	f	10	\N	5	\N	fogo46	fogo46	\N	\N	\N	\N	APA91bFOPNguXOsMnovayP1TZj0uhkaTvIloVc6tZpC2HZ2QEzdsBmjGcydh1bZlpFDqoOMLCSsiN03Q7soYJ7ddiAXDPcza4GT0fUdRnZF2JzQy_cNQ-too2MbizQYtdNCXcXNzERtb	\N	\N	3	1092	11275	2017-04-10 03:55:13.74483+05:30	2017-04-25 23:35:43.083326+05:30	1435543251393183865	BRL	SumUp	f
2125	Ponta Negra Truck2	2	TRUCK	30	20	f	15	\N	10	\N	joe56	joe56	\N	\N	\N	\N	\N	\N	\N	3	1105	11272	2017-04-08 22:00:09.629615+05:30	2017-04-11 19:55:15.751657+05:30	1435543251393183865	BRL	SumUp	f
2091	Vinay Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	vinaybhavsartruck1	cdn123	\N	\N	\N	\N	\N	\N	\N	1	1089	11218	2017-03-22 17:19:39.947588+05:30	2017-03-22 17:19:39.947588+05:30	1435543251393183865	BRL	SumUp	f
2095	nuvo Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	nuvotruck1	nuvo	\N	\N	\N	\N	\N	\N	\N	1	1093	11226	2017-03-25 18:34:06.78761+05:30	2017-03-25 19:52:23.705259+05:30	1435543251393183865	BRL	SumUp	f
2089	Chunky Truck #1	1	CART	60	30	t	30	\N	15	\N	chunkytruck1	chunkymonkey	\N	\N	\N	\N	APA91bGex9UmnMoD0h_KHfRAdBK2-QF1m-vPIQgYofG3YFPzFzvJwM5mgWog8yTCoO5sYzVX-I8wv8BCjS3mdffeSNbTHHcSwj2tsog8e6GMK0vZSHIkRqU	\N	\N	1	1088	11193	2017-02-08 12:52:22.776055+05:30	2017-04-25 17:10:48.716315+05:30	1435543251393183865	BRL	SumUp	f
2099	Dummy Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	dummytruck1	dummy	\N	\N	\N	\N	\N	\N	\N	1	1098	11235	2017-04-01 23:53:08.972411+05:30	2017-04-01 23:53:08.972411+05:30	1435543251393183865	BRL	SumUp	f
2098	Bob Truck #1	1	TRUCK	40	25	f	15	\N	10	\N	bobtruck1	bob	\N	\N	\N	\N	\N	\N	\N	3	1096	11232	2017-03-29 00:46:50.676091+05:30	2017-03-29 01:06:01.583526+05:30	1435543251393183865	BRL	SumUp	f
2102	Billy Truck #1	1	RESTAURANT	30	25	f	15	\N	10	\N	billytruck1	billy	\N	\N	\N	\N	\N	\N	\N	4	1101	11241	2017-04-03 04:34:30.650284+05:30	2017-04-03 04:38:42.608407+05:30	1435543251393183865	USD	SumUp	f
2100	dsfdsf Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	dfdsftruck1	idontknow	\N	\N	\N	\N	\N	\N	\N	1	1099	11237	2017-04-02 00:55:59.782045+05:30	2017-04-02 00:55:59.782045+05:30	1435543251393183865	BRL	SumUp	f
2135	cart 2	2	TRUCK	30	30	f	15	\N	10	\N	classy56	classy56	\N	\N	\N	\N	\N	\N	\N	3	1094	11297	2017-04-16 20:03:07.035234+05:30	2017-04-27 01:45:05.095226+05:30	1435543251393183865	BRL	SumUp	f
2103	Dennis Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	dnick66truck1	smiley66	\N	\N	\N	\N	APA91bEBbLnE4vXEcmy83D8LHr59wq8G2C8exP-UDGxy1Vyf461iBDoIO55OFAe8Eyl49z4I_hcZj73gVDMVWITfJJbdBFaQmjebDjjIOkNMGT0oJ5Ld2nU	\N	\N	1	1102	11243	2017-04-04 17:31:20.479621+05:30	2017-04-25 02:22:17.450486+05:30	1435543251393183865	BRL	SumUp	f
2137	D Truck #2	2	TRUCK	40	30	f	30	\N	5	\N	manager2	smiley66	\N	\N	\N	\N	\N	\N	\N	1	1112	11303	2017-04-25 00:59:23.374981+05:30	2017-04-25 17:09:48.997138+05:30	1435543251393183865	BRL	SumUp	f
2106	Here	1	TRUCK	30	30	f	\N	\N	\N	\N	Gen1Living	smiley66	\N	\N	\N	\N	\N	\N	\N	1	1104	11248	2017-04-04 22:37:04.576686+05:30	2017-04-04 22:37:04.576686+05:30	1435543251393183865	BRL	SumUp	f
2107	Here2	2	TRUCK	20	10	f	\N	\N	\N	\N	gen1	smiley66	\N	\N	\N	\N	\N	\N	\N	1	1104	11249	2017-04-04 22:37:42.24167+05:30	2017-04-04 22:37:42.24167+05:30	1435543251393183865	BRL	SumUp	f
2101	j Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	jon.kazariantruck1	test1234	\N	\N	\N	\N	\N	\N	\N	1	1100	11239	2017-04-02 01:41:06.020718+05:30	2017-04-02 01:41:06.020718+05:30	1435543251393183865	BRL	SumUp	f
2007	Moe Truck #1	4	TRUCK	20	15	f	\N	\N	\N	\N	moe56	moe56	\N	\N	\N	\N	\N	\N	\N	2	1005	11021	2017-02-02 13:17:24.083754+05:30	2017-04-02 01:42:44.583302+05:30	1435543251393183865	BRL	SumUp	f
2118	Sao Paolo Truck #3	4	TRUCK	30	30	f	25	\N	10	\N	sfsdf	sdffs	\N	\N	\N	\N	\N	\N	\N	2	1088	11262	2017-04-08 10:24:57.556556+05:30	2017-04-15 19:46:22.04093+05:30	1435543251393183865	BRL	SumUp	f
2070	Crazy Truck 5	5	TRUCK	20	15	f	\N	\N	\N	\N	Jack	jack	\N	\N	\N	cNXGElYdnDQ:APA91bH6L7mau4dFV_woD7vmapgsm0gIV3lE34Oqua2H7sZ9t3XoXAMVBagVA3PNPzWClL-TTvYnLa-XEzPMtNfP_uGtrMf9Avd6M2tfN8Jhzw--dhkYhETx6P_385NBUdsSCtLGHaLV	\N	\N	\N	1	1005	11169	2017-02-06 12:41:55.248113+05:30	2017-04-07 17:15:54.971128+05:30	1435543251393183865	BRL	SumUp	f
2115	test 2	4	TRUCK	30	30	f	20	\N	10	\N	asdasd	asd	\N	\N	\N	\N	\N	\N	\N	3	1005	11259	2017-04-08 10:22:48.711481+05:30	2017-04-08 10:22:48.711481+05:30	1435543251393183865	BRL	SumUp	f
2006	jack	5	TRUCK	20	15	t	15	\N	5	Crazy Jacks Truck	crazy56	crazy56	\N	\N	\N	\N	APA91bGg0iBMwhOiySq6IEeuGoQjALsuIXbPUe6oTLE74L97UFquAXwNtPkAsQmWHCtg5zl--EtPen7jDYhH8gi5A0V-KB72vv8OI9YVgOcc5rQIrycMVtYmPz6zajSARiP3HEUFMzfV	\N	\N	4	1005	11018	2017-02-01 17:16:50.747716+05:30	2017-04-07 17:24:08.076457+05:30	1435543251393183865	USD	SumUp	f
2008	Grilla Truck 1	1	TRUCK	20	15	f	\N	\N	\N	\N	grilla56	grilla56	\N	\N	\N	\N	APA91bFpsAYejc4VbU7ec8kPQ71TTztyXhkFd3txsOfn2V5rO9U65NB7szEVaI5jqk2wQ9DSxJcicKUEyL3MEIPft96au_6MjW5qrKBgxDx-LGcnUbKv388	\N	\N	1	1005	11026	2017-02-03 02:55:02.490854+05:30	2017-04-12 16:50:13.308447+05:30	1435543251393183865	BRL	SumUp	f
2131	qwerty	4	TRUCK	30	30	f	10	\N	5	\N	qwerty	qwerty	\N	\N	\N	\N	\N	\N	\N	3	1104	11280	2017-04-10 09:32:41.873633+05:30	2017-04-10 09:32:41.873633+05:30	1435543251393183865	BRL	SumUp	f
2111	sdasdasd	4	TRUCK	30	30	f	25	\N	15	\N	asd	asdasd	\N	\N	\N	\N	\N	\N	\N	1	1005	11255	2017-04-08 10:04:02.28844+05:30	2017-04-12 17:44:41.997895+05:30	1435543251393183865	BRL	SumUp	f
2001	Thaitanic Truck 1	1	TRUCK	15	\N	f	\N	\N	\N	\N	mptruck61	mptruck61	\N	\N	\N	cNXGElYdnDQ:APA91bH6L7mau4dFV_woD7vmapgsm0gIV3lE34Oqua2H7sZ9t3XoXAMVBagVA3PNPzWClL-TTvYnLa-XEzPMtNfP_uGtrMf9Avd6M2tfN8Jhzw--dhkYhETx6P_385NBUdsSCtLGHaLV	c9k1cdeqqlc:APA91bE3N9DPEPRVrylvqniUc0YkeqiDcL0bLF7wEpm0BUFDspsRMjJGenLnF07ssEmBZe90pG983xq9cQLzLzu6uWXYyhv1OZpDrUeCirxjBSzmIX-TJlO5T58PxakjRLd8LIghjnuy	\N	\N	\N	1005	11007	2017-02-01 05:02:49.181663+05:30	2017-04-11 11:41:29.633649+05:30	1435543251393183865	BRL	SumUp	f
2121	Ponta Negra Truck#2	2	TRUCK	30	30	f	15	\N	10	\N	fogo76	fogo76	\N	\N	\N	\N	\N	\N	\N	3	1088	11266	2017-04-08 21:16:18.677079+05:30	2017-04-12 09:34:26.299748+05:30	1435543251393183865	BRL	SumUp	f
2124	Mighty Truck #1	1	TRUCK	30	25	f	15	\N	10	\N	joetruck1	joe	\N	\N	\N	\N	\N	\N	\N	1	1105	11271	2017-04-08 21:52:59.321931+05:30	2017-04-11 19:54:57.73502+05:30	1435543251393183865	BRL	SumUp	f
2129	asdasdasdatests	4	TRUCK	30	30	f	30	\N	15	\N	yogesh	123	\N	\N	\N	\N	\N	\N	\N	2	1088	11277	2017-04-10 09:20:44.732805+05:30	2017-04-12 09:34:23.638533+05:30	1435543251393183865	BRL	SumUp	f
2130	tester	4	TRUCK	25	15	f	25	\N	15	\N	testera	tester11a	\N	\N	\N	\N	\N	\N	\N	2	1088	11278	2017-04-10 09:24:54.954704+05:30	2017-04-12 09:39:23.833171+05:30	1435543251393183865	BRL	SumUp	f
2116	Ponta Negra Truck #2	4	TRUCK	30	30	f	20	\N	10	\N	chunky56	chunky56	\N	\N	\N	fXS-t9CJhBM:APA91bE6zYJ007cPVdVRrMxE4ajL-Ca2ptJ14H2kr0oNX6RvJ5gPqeL91rvN9df-GNGPJviNjkEYudWMvmM2zjmxquZK1IHUgqoPp8buvc2aTsuYjSwP_Kmj4rRGeEywiTVRgu3cRXlI	\N	\N	\N	3	1088	11260	2017-04-08 10:23:07.845841+05:30	2017-04-12 09:40:09.082879+05:30	1435543251393183865	BRL	SumUp	f
2133	Paco Truck #1	1	TRUCK	30	25	t	15	\N	10	\N	tacostruck1	tacos	\N	\N	\N	\N	APA91bGex9UmnMoD0h_KHfRAdBK2-QF1m-vPIQgYofG3YFPzFzvJwM5mgWog8yTCoO5sYzVX-I8wv8BCjS3mdffeSNbTHHcSwj2tsog8e6GMK0vZSHIkRqU	\N	\N	1	1110	11294	2017-04-13 14:40:19.81029+05:30	2017-04-15 19:24:31.653443+05:30	1435543251393183865	BRL	SumUp	f
2134	rajan Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	rajan.rajan977truck1	123456	\N	\N	\N	\N	\N	\N	\N	1	1111	11296	2017-04-13 16:37:39.781341+05:30	2017-04-13 16:37:39.781341+05:30	1435543251393183865	BRL	SumUp	f
2138	D Truck #3	3	TRUCK	30	30	t	15	\N	10	\N	destructodentruck3	smiley66	\N	\N	\N	\N	\N	\N	\N	3	1112	11304	2017-04-25 17:44:38.303248+05:30	2017-04-25 19:27:36.515451+05:30	1435543251393183865	BRL	SumUp	f
2139	Jose Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	josetruck1	jose	\N	\N	\N	\N	\N	\N	\N	1	1114	11314	2017-05-10 23:12:22.201211+05:30	2017-05-10 23:12:22.201211+05:30	1435543251393183865	BRL	SumUp	f
2140	Churros Truck #1	1	TRUCK	30	30	f	\N	\N	\N	\N	churrostruck1	churros	\N	\N	\N	\N	\N	\N	\N	1	1115	11316	2017-05-11 00:29:29.544017+05:30	2017-05-11 00:29:29.544017+05:30	1435543251393183865	BRL	SumUp	f
2141	Boss Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	bosstruck1	boss	\N	\N	\N	\N	\N	\N	\N	1	1116	11318	2017-05-11 01:34:24.475976+05:30	2017-05-11 01:34:24.475976+05:30	1435543251393183865	BRL	SumUp	f
2142	Fred Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	fredtruck1	fred	\N	\N	\N	\N	\N	\N	\N	1	1117	11320	2017-05-11 02:28:46.675951+05:30	2017-05-11 02:28:46.675951+05:30	1435543251393183865	BRL	SumUp	f
2143	Ron Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	rontruck1	ron	\N	\N	\N	\N	\N	\N	\N	1	1118	11322	2017-05-11 02:36:03.952129+05:30	2017-05-11 02:36:03.952129+05:30	1435543251393183865	BRL	SumUp	f
2144	t Truck #1	1	TRUCK	30	25	f	\N	\N	\N	\N	ttruck1	pass	\N	\N	\N	\N	\N	\N	\N	1	1119	11324	2017-05-11 05:22:30.429381+05:30	2017-05-11 05:22:30.429381+05:30	1435543251393183865	BRL	SumUp	f
2096	Natal Cart #1	1	CART	30	15	t	15	\N	10	\N	mannytruck1	manny	\N	\N	\N	\N	APA91bG2DPnoMR-TkhhHcixL-8uP6Rm5YN0UCqv5rv1nHdzkt3TrkqbQDvrmp5dRGkQorWx3r_zZGDS1Yi2_muJoMY61RThXVfBJJ-MpF2pZbtyqDr89NFI	\N	\N	1	1094	11228	2017-03-27 07:52:34.955715+05:30	2017-05-11 16:45:45.138951+05:30	1435543251393183865	BRL	SumUp	f
2145	Sabor Brasil	1	RESTAURANT	30	20	f	15	\N	10	\N	luiztruck1	oioioi	\N	\N	\N	\N	\N	\N	\N	1	1120	11326	2017-05-11 21:25:00.266151+05:30	2017-05-11 21:44:15.334751+05:30	1435543251393183865	BRL	SumUp	f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, first_name, last_name, role, territory_id, country_id, phone, provider, provider_id, provider_data, fbid, fb_token, fb_login, default_language, created_at, updated_at, is_deleted) FROM stdin;
11001	mp10	61a71ecc0510731399d2ecdae912760e	Stacy	Tran	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 05:01:43.131352+05:30	2017-02-03 14:55:30.279083+05:30	f
11002	mp27	defc72a96803a619a6735cd7e7e69e1b	Jonathan	Jones	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 04:31:03.622149+05:30	2017-02-03 15:24:22.527595+05:30	f
11004	mp4@gmail.com	4866d635ea7b0ed8e2452da897143528	Julie	Grant	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 04:33:07.177813+05:30	2017-02-01 05:02:49.172208+05:30	f
11005	mp5@gmail.com	146eb1afa89654aca443976646460ef4	Bob	Smith	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 04:35:04.914807+05:30	2017-02-01 05:02:49.172208+05:30	f
11006	mp6@gmail.com	5ce4c4a0a26e6df0fdbb380d78f4fab2	Cindy	Clark	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 04:42:10.112015+05:30	2017-02-01 05:02:49.172208+05:30	f
11007	mptruck61	6cf9be93694189e06c66faa49a6cbc93	\N	\N	UNITMGR	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-30 02:24:42.540882+05:30	2017-02-01 05:02:49.172208+05:30	f
11008	mptruck64	5db0aeb457f45ddb90c35b39569c1348	\N	\N	UNITMGR	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-31 02:42:08.717913+05:30	2017-02-01 05:02:49.172208+05:30	f
11009	mptruck64five	dda2549944250c6c038797b463e7de99	\N	\N	UNITMGR	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-31 02:52:22.983667+05:30	2017-02-01 05:02:49.172208+05:30	f
11010	trucker1	2c914a017cf7354e6c6319afe0b664b2	\N	\N	UNITMGR	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-09-07 05:27:26.291924+05:30	2017-02-01 05:02:49.172208+05:30	f
11011	dn10@gmail.com	e04ddb7bae832648e9d649858ef578cb	Dennis	Nichols	ADMIN	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-10-21 05:03:15.004572+05:30	2017-02-01 05:02:49.172208+05:30	f
11012	lc11@gmail.com	23ad11f37c9dffc926f57dc0f8455dbc	Luiz	Cobello	ADMIN	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-10-23 00:12:04.179585+05:30	2017-02-01 05:02:49.172208+05:30	f
11013	mh12@gmail.com	125512e2351c28ad0bb01cc3d8db3703	Marcos	Hirano	ADMIN	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-10-23 00:11:25.721489+05:30	2017-02-01 05:02:49.172208+05:30	f
11017	jack@crazysubs.com	4ff9fc6e4e5d5f590c4f2134a8cc96d1	Jack	Crazy	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-01 16:51:51.951081+05:30	2017-02-01 16:51:51.951081+05:30	f
11018	crazy56	33b0a180f307ca68ba2c2dfa55f6ff4c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-01 17:16:50.778073+05:30	2017-02-01 17:16:50.778073+05:30	f
11020	Mo@totino.com	27c9d5187cd283f8d160ec1ed2b5ac89	Mo	Totino	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-02 12:34:17.433015+05:30	2017-02-02 12:34:17.433015+05:30	f
11021	moe56	276fbf86abd87a184df2b737328b6973	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-02 13:17:24.105698+05:30	2017-02-02 13:17:24.105698+05:30	f
11024	Bangkok@cafe.com	bangkok	Bangkok	Cafe	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-02 14:13:47.94126+05:30	2017-02-02 14:39:32.202801+05:30	f
11003	mp4	28dafd4a8cb5f33065e93cbc83862563	Marco and Inez	Pena	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2016-08-22 04:31:50.563872+05:30	2017-02-02 15:05:54.217743+05:30	f
11025	Grilla@grillacheez.com	82edd3141a6270a3ac5e93323c07a7e1	Grilla	Cheez	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-03 02:44:48.007795+05:30	2017-02-03 02:44:48.007795+05:30	f
11026	grilla56	09424725eaf9b79082cff28ec83e114c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-03 02:55:02.499941+05:30	2017-02-03 02:55:02.499941+05:30	f
11068	mg26@gmail.com	22c7b568334f78f0a122ee388557660e	mg2	spy	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-04 00:37:56.71264+05:30	2017-02-04 00:37:56.71264+05:30	f
11165	suren@aryvart.com	b6c231fc212b1a67d4965d0b1527358c	Surendiran	Parasuraman	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-06 11:14:09.338925+05:30	2017-02-06 11:14:09.338925+05:30	f
11168	grilla56@gmail.com	09424725eaf9b79082cff28ec83e114c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-06 12:31:15.7952+05:30	2017-02-06 12:31:15.7952+05:30	f
11169	Jack	4ff9fc6e4e5d5f590c4f2134a8cc96d1	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-06 12:41:55.254344+05:30	2017-02-06 12:41:55.254344+05:30	f
11174	grilla26	3ee0410d3f0f9cf2d1b2f07c2d74604d	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-06 15:21:07.21648+05:30	2017-02-06 15:21:07.21648+05:30	f
11190	testetcus@gmail.com	e10adc3949ba59abbe56e057f20f883e	Tester	Customer	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-08 07:07:49.206449+05:30	2017-02-08 07:07:49.206449+05:30	f
11192	chunky@monkey.com	90ead2a2940e7f354c310900a950043a	Chunky	Monkey	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-02-08 12:52:17.334042+05:30	2017-02-08 12:52:17.334042+05:30	f
11193	chunkytruck1	90ead2a2940e7f354c310900a950043a	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-02-08 12:52:22.781745+05:30	2017-02-08 12:52:22.781745+05:30	f
11195	bob56	90c4b084124e57b98082ce30f93e87dd	Bob	Smith	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-05 08:59:28.312808+05:30	2017-03-05 08:59:28.312808+05:30	f
11216	j56	ab75a542f5cf2bb17bf700ea393b4326	Jimmy	Chow	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-07 01:08:15.612023+05:30	2017-03-07 01:08:15.612023+05:30	f
11217	vinaybhavsar@cdnsol.com	704da6e1589cfc6fe1cd2ac59addfec8	Vinay	Bhavsar	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-22 17:19:33.173004+05:30	2017-03-22 17:19:33.173004+05:30	f
11218	vinaybhavsartruck1	704da6e1589cfc6fe1cd2ac59addfec8	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-22 17:19:39.954103+05:30	2017-03-22 17:19:39.954103+05:30	f
11219	firminoata@gmail.com	e9da82f4c252e7f1745ae88f2624fc07	Joao	Firmino	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-23 06:15:38.618878+05:30	2017-03-23 06:15:38.618878+05:30	f
11220	Jimmy@konfusion.com	c2fe677a63ffd5b7ffd8facbf327dad0	Jimmy	Chu	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-24 00:52:51.062785+05:30	2017-03-24 00:52:51.062785+05:30	f
11221	Jimmytruck1	c2fe677a63ffd5b7ffd8facbf327dad0	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-24 02:01:57.029208+05:30	2017-03-24 02:01:57.029208+05:30	f
11222	chutruck1	cbcefaf71b4677cb8bcc006e0aeaa34a	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-24 02:30:11.570319+05:30	2017-03-24 02:30:11.570319+05:30	f
11223	Fogo@thaitanicxpress.com	705eb2cad4537d7ace7fc73bb273f50d	Fogo	Ho	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-24 21:23:41.496447+05:30	2017-03-24 21:23:41.496447+05:30	f
11224	fogotruck1	705eb2cad4537d7ace7fc73bb273f50d	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-24 21:24:11.306417+05:30	2017-03-24 21:24:11.306417+05:30	f
11225	nuvo@me.com	4bd71661de7274e452bc735e1b9bb7ed	nuvo	goody	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-25 18:34:00.221987+05:30	2017-03-25 18:34:00.221987+05:30	f
11226	nuvotruck1	4bd71661de7274e452bc735e1b9bb7ed	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-25 18:34:06.793619+05:30	2017-03-25 18:34:06.793619+05:30	f
11227	Manny@classycuban.com	8fe78ac0eaabf2f474b0de3a968e165e	Manny	Cuba	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-27 07:52:27.156454+05:30	2017-03-27 07:52:27.156454+05:30	f
11228	mannytruck1	8fe78ac0eaabf2f474b0de3a968e165e	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-27 07:52:34.961865+05:30	2017-03-27 07:52:34.961865+05:30	f
11229	Frank@bbq.com	26253c50741faa9c2e2b836773c69fe6	Frank	Hill	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-29 00:42:04.676928+05:30	2017-03-29 00:42:04.676928+05:30	f
11230	franktruck1	26253c50741faa9c2e2b836773c69fe6	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-29 00:42:11.624981+05:30	2017-03-29 00:42:11.624981+05:30	f
11231	Bob@bbq.com	9f9d51bc70ef21ca5c14f307980a29d8	Bob	Jones	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-29 00:46:44.00305+05:30	2017-03-29 00:46:44.00305+05:30	f
11232	bobtruck1	9f9d51bc70ef21ca5c14f307980a29d8	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-03-29 00:46:50.683263+05:30	2017-03-29 00:46:50.683263+05:30	f
11233	Jimmy@MyFood.com	c2fe677a63ffd5b7ffd8facbf327dad0	Jimmy	Chow	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-31 23:19:39.128683+05:30	2017-03-31 23:19:39.128683+05:30	f
11234	Dummy@me.com	275876e34cf609db118f3d84b799a790	Dummy	Dumb	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-01 23:53:01.697481+05:30	2017-04-01 23:53:01.697481+05:30	f
11235	dummytruck1	275876e34cf609db118f3d84b799a790	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-01 23:53:08.986062+05:30	2017-04-01 23:53:08.986062+05:30	f
11236	dfdsf@gmail.com	a1fa59e79bba1a38bb0684d3298c9ddd	dsfdsf	dsfdf	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-02 00:55:53.606803+05:30	2017-04-02 00:55:53.606803+05:30	f
11237	dfdsftruck1	a1fa59e79bba1a38bb0684d3298c9ddd	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-02 00:55:59.79044+05:30	2017-04-02 00:55:59.79044+05:30	f
11238	jon.kazarian@gmail.com	16d7a4fca7442dda3ad93c9a726597e4	j	k	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-02 01:40:59.253743+05:30	2017-04-02 01:40:59.253743+05:30	f
11239	jon.kazariantruck1	16d7a4fca7442dda3ad93c9a726597e4	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-02 01:41:06.027822+05:30	2017-04-02 01:41:06.027822+05:30	f
11240	Billy@me.com	89c246298be2b6113fb10ba80f3c6956	Billy	Bob	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-03 04:34:22.597168+05:30	2017-04-03 04:34:22.597168+05:30	f
11241	billytruck1	89c246298be2b6113fb10ba80f3c6956	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-03 04:34:30.660808+05:30	2017-04-03 04:34:30.660808+05:30	f
11242	dnick66@gmail.com	416a88b9efa03e0f809958793624cea5	Dennis	Nichols	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-04 17:31:13.741651+05:30	2017-04-04 17:31:13.741651+05:30	f
11243	dnick66truck1	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-04 17:31:20.506246+05:30	2017-04-04 17:31:20.506246+05:30	f
11244	Dennis@streetfoodEZ.com	416a88b9efa03e0f809958793624cea5	Dennis	Nichols	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-04 17:45:19.781387+05:30	2017-04-04 17:45:19.781387+05:30	f
11245	dennistruck1	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-04 17:45:26.401626+05:30	2017-04-04 17:45:26.401626+05:30	f
11246	Gen1Living@gmail.com	416a88b9efa03e0f809958793624cea5	Dennis	Nichols	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-04 22:03:29.250527+05:30	2017-04-04 22:03:29.250527+05:30	f
11247	gen1livingtruck1	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-04 22:03:36.725433+05:30	2017-04-04 22:03:36.725433+05:30	f
11248	Gen1Living	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-04 22:37:04.584469+05:30	2017-04-04 22:37:04.584469+05:30	f
11249	gen1	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-04 22:37:42.249866+05:30	2017-04-04 22:37:42.249866+05:30	f
11250	root	aa95959e46a8f9c9580ad338a5c0542b	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-05 15:34:45.91599+05:30	2017-04-05 15:34:45.91599+05:30	f
11251	matt.guiger@gmail.com	ce86d7d02a229acfaca4b63f01a1171b	Matt	Guiger	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-05 19:44:22.988427+05:30	2017-04-05 19:44:22.988427+05:30	f
11252	chunkytruck2	90ead2a2940e7f354c310900a950043a	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-07 17:29:50.670266+05:30	2017-04-07 17:29:50.670266+05:30	f
11253	usernameqwwqwqw	1a1dc91c907325c69271ddf0c944bc72	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 09:26:54.01191+05:30	2017-04-08 09:26:54.01191+05:30	f
11254	asdsad	a8f5f167f44f4964e6c998dee827110c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:03:08.231996+05:30	2017-04-08 10:03:08.231996+05:30	f
11255	asd	a8f5f167f44f4964e6c998dee827110c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:04:02.296302+05:30	2017-04-08 10:04:02.296302+05:30	f
11256	yog	cef468eeda569cc1b16b45fd53200b9c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:04:49.133773+05:30	2017-04-08 10:04:49.133773+05:30	f
11257	sdfsdf	979d472a84804b9f647bc185a877a8b5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:12:15.84034+05:30	2017-04-08 10:12:15.84034+05:30	f
11258	retert	e3e84538a1b02b1cc11bf71fe3169958	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:13:11.916678+05:30	2017-04-08 10:13:11.916678+05:30	f
11259	asdasd	7815696ecbf1c96e6894b779456d330e	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:22:48.718835+05:30	2017-04-08 10:22:48.718835+05:30	f
11261	qweqw	006d2143154327a64d86a264aea225f3	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:23:24.23281+05:30	2017-04-08 10:23:24.23281+05:30	f
11263	ashishsebastian@cdnsol.com	704da6e1589cfc6fe1cd2ac59addfec8	allwyn	alvin	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-08 15:59:29.066162+05:30	2017-04-08 15:59:29.066162+05:30	f
11260	chunky56	2ea461d364cd78ffc364ceedbb12da91	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:23:07.853728+05:30	2017-04-08 10:23:07.853728+05:30	f
11264	fogo56	7639294f3d74108e5c0d029ffa05200e	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:13:54.335992+05:30	2017-04-08 21:13:54.335992+05:30	f
11265	fogo26	7a24aff8b46ffd92b002f6e1054c67ba	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:14:39.917619+05:30	2017-04-08 21:14:39.917619+05:30	f
11266	fogo76	d571ebb8956cf5e642a983f6caa797ca	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:16:18.687364+05:30	2017-04-08 21:16:18.687364+05:30	f
11268	manny56	a809b284f8106a91d89df25e18f2c668	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:46:49.111114+05:30	2017-04-08 21:46:49.111114+05:30	f
11269	manny26	d841d99d6c33f479181431373ae5bb71	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:48:36.70971+05:30	2017-04-08 21:48:36.70971+05:30	f
11270	Joe@mightjoes.com	8ff32489f92f33416694be8fdc2d4c22	Mighty	Joe	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-08 21:52:51.569562+05:30	2017-04-08 21:52:51.569562+05:30	f
11271	joetruck1	8ff32489f92f33416694be8fdc2d4c22	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:52:59.351554+05:30	2017-04-08 21:52:59.351554+05:30	f
11272	joe56	0a920d52b15f92c35393a0d4480f0767	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 22:00:09.638072+05:30	2017-04-08 22:00:09.638072+05:30	f
11273	tango56	b72deb0db6864258c12eeeae3ee2895f	tango56	tango56	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-09 05:05:01.728961+05:30	2017-04-09 05:05:01.728961+05:30	f
11274	fogo16	f79c422cd62e5006292cb49cbc5f693d	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 03:52:49.775635+05:30	2017-04-10 03:52:49.775635+05:30	f
11275	fogo46	f32fa5f81b6a0d4cdc9662d74bb122f9	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 03:55:13.761133+05:30	2017-04-10 03:55:13.761133+05:30	f
11267	fogo106	686036a8d37e73b887b437eae0bee3c7	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 21:45:25.144058+05:30	2017-04-10 05:39:45.955109+05:30	f
11276	fogo116	1da69897d917a8f348baff61b9daf3ec	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 05:42:05.84375+05:30	2017-04-10 05:42:05.84375+05:30	f
11277	yogesh	202cb962ac59075b964b07152d234b70	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 09:20:44.73999+05:30	2017-04-10 09:20:44.73999+05:30	f
11279	test	d5d8982b86cf8b0c34727c6eea13c053	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 09:26:42.461772+05:30	2017-04-10 09:26:42.461772+05:30	f
11280	qwerty	d8578edf8458ce06fbc5bb76a58c5ca4	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 09:32:41.882991+05:30	2017-04-10 09:32:41.882991+05:30	f
11281	raskstn@gmail.com	751420e2457e6ccc7971358d5d8a8215	raskin	stans	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-10 17:10:43.095535+05:30	2017-04-10 17:10:43.095535+05:30	f
11282	testmngr@tester.com	cc03e747a6afbbcbf8be7668acfebee5	testmngr	testmngr	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-10 19:05:27.210568+05:30	2017-04-10 19:05:27.210568+05:30	f
11283	sam@grant.vom	56fafa8964024efa410773781a5f9e93	sam	Garnant	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-10 19:07:26.48264+05:30	2017-04-10 19:07:26.48264+05:30	f
11284	test@tester.com	704da6e1589cfc6fe1cd2ac59addfec8	stanins	bartheion	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-10 19:13:53.449113+05:30	2017-04-10 19:13:53.449113+05:30	f
11285	test5@sfez.com	289d9c456f886cc8876392260e103ff2	stanins	bartheion	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-10 19:15:19.277613+05:30	2017-04-10 19:15:19.277613+05:30	f
11262	sfsdfas	115ad9fa3a50d87327ac757c61ff8528	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-08 10:24:57.563275+05:30	2017-04-08 10:24:57.563275+05:30	f
11278	testera	07862e6794a39c150aef26ee61538797	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-10 09:24:54.971092+05:30	2017-04-10 09:24:54.971092+05:30	f
11286	Crazy@crazysubs.com	297aae72cc4d0d068f46a9158469e34d	Crazy	One	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-12 17:31:57.013755+05:30	2017-04-12 17:31:57.013755+05:30	f
11287	crazytruck1	297aae72cc4d0d068f46a9158469e34d	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-12 17:32:04.711554+05:30	2017-04-12 17:32:04.711554+05:30	f
11288	tester@qr.com	19f6d71f70c2c2eb05e7579dfd234e8b	testerqr	qrcode	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-12 18:55:25.762646+05:30	2017-04-12 18:55:25.762646+05:30	f
11293	tacos@pacostacos.com	dacedf41210444fe8547f5b1cf085a6c	Paco	Rodriguez	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-13 14:40:13.108285+05:30	2017-04-13 14:40:13.108285+05:30	f
11294	tacostruck1	dacedf41210444fe8547f5b1cf085a6c	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-13 14:40:19.816691+05:30	2017-04-13 14:40:19.816691+05:30	f
11295	rajan.rajan977@gmail.com	e10adc3949ba59abbe56e057f20f883e	rajan	ramani	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-13 16:37:32.709035+05:30	2017-04-13 16:37:32.709035+05:30	f
11296	rajan.rajan977truck1	e10adc3949ba59abbe56e057f20f883e	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-13 16:37:39.789052+05:30	2017-04-13 16:37:39.789052+05:30	f
11297	classy56	a26bf6439c7b17fab1c6cd0ae43b7512	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-16 20:03:07.043751+05:30	2017-04-16 20:03:07.043751+05:30	f
11298	m56	1500036860c8afd328309fa3af15e933	Marcy	Jones	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-16 20:24:44.284436+05:30	2017-04-16 20:24:44.284436+05:30	f
11299	d56	ad71b715717f7e4757565373c1a88e1f	Dirk	Nowitzki	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-17 00:47:03.953835+05:30	2017-04-17 00:47:03.953835+05:30	f
11300	health@gen1living.com	416a88b9efa03e0f809958793624cea5	d	n	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-24 22:30:57.093372+05:30	2017-04-24 22:30:57.093372+05:30	f
11301	destructoden@gmail.com	416a88b9efa03e0f809958793624cea5	D	N	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-25 00:44:59.113433+05:30	2017-04-25 00:44:59.113433+05:30	f
11302	destructodentruck1	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-25 00:45:07.486618+05:30	2017-04-25 00:45:07.486618+05:30	f
11303	manager2	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-25 00:59:23.383457+05:30	2017-04-25 00:59:23.383457+05:30	f
11304	destructodentruck3	416a88b9efa03e0f809958793624cea5	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-04-25 17:44:38.315145+05:30	2017-04-25 17:44:38.315145+05:30	f
11305	Luiz.cambao@gmail.com	80e408ff350752abc908fb59bdd94fe8	Luiz	Claudio	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-27 21:28:32.282696+05:30	2017-04-27 21:28:32.282696+05:30	f
11306	lui_cla@hotmail.com	170f9a8f689fc69157ad6d3a62ecd92f	luiz	Claudio	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-04-30 19:54:27.607111+05:30	2017-04-30 19:54:27.607111+05:30	f
11307	ramonswiz@gmail.com	6a557ed1005dddd940595b8fc6ed47b2	ramon	siwzki	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 18:47:50.158416+05:30	2017-05-01 18:47:50.158416+05:30	f
11308	regist@gmail.com	5c769a1e38d1af34a22a4fdf3e334409	registertest	test	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 18:51:57.102972+05:30	2017-05-01 18:51:57.102972+05:30	f
11309	samtag@gmail.com	56fafa8964024efa410773781a5f9e93	samule	tagore	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 19:05:44.954441+05:30	2017-05-01 19:05:44.954441+05:30	f
11310	louepark@gmail.com	e759345b7ed1cedf9c5bf757ec0189b5	louis	parker	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 19:27:42.925882+05:30	2017-05-01 19:27:42.925882+05:30	f
11311	solm@gmail.com	d0b8291c599616ebebd69629aa5fc077	standley	solomon	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 20:42:37.59943+05:30	2017-05-01 20:42:37.59943+05:30	f
11312	silvia@gmail.com	ecb22d57339b946f66817e43583e51ce	silvia	drozen	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-01 21:02:06.524032+05:30	2017-05-01 21:02:06.524032+05:30	f
11313	Jose@empanada.com	662eaa47199461d01a623884080934ab	Jose	Empanada	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-10 23:12:14.962606+05:30	2017-05-10 23:12:14.962606+05:30	f
11314	josetruck1	662eaa47199461d01a623884080934ab	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-10 23:12:22.22021+05:30	2017-05-10 23:12:22.22021+05:30	f
11315	Churros@me.com	42cb478d1eb3855929cc3187c10aebec	Churros	Factory	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 00:17:44.490878+05:30	2017-05-11 00:17:44.490878+05:30	f
11316	churrostruck1	42cb478d1eb3855929cc3187c10aebec	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 00:29:29.553986+05:30	2017-05-11 00:29:29.553986+05:30	f
11317	Boss@fanzone.com	ceb8447cc4ab78d2ec34cd9f11e4bed2	Boss	Man	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 01:34:17.256299+05:30	2017-05-11 01:34:17.256299+05:30	f
11318	bosstruck1	ceb8447cc4ab78d2ec34cd9f11e4bed2	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 01:34:24.484097+05:30	2017-05-11 01:34:24.484097+05:30	f
11319	fred@fritanga.com	570a90bfbf8c7eab5dc5d4e26832d5b1	Fred	Fritanga	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 02:28:39.690794+05:30	2017-05-11 02:28:39.690794+05:30	f
11320	fredtruck1	570a90bfbf8c7eab5dc5d4e26832d5b1	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 02:28:46.683897+05:30	2017-05-11 02:28:46.683897+05:30	f
11321	Ron@ticketmaster.com	45798f269709550d6f6e1d2cf4b7d485	Ron	Ticket	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 02:35:56.747692+05:30	2017-05-11 02:35:56.747692+05:30	f
11322	rontruck1	45798f269709550d6f6e1d2cf4b7d485	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 02:36:03.969185+05:30	2017-05-11 02:36:03.969185+05:30	f
11323	t@b.cd	1a1dc91c907325c69271ddf0c944bc72	t	b	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 05:22:21.599849+05:30	2017-05-11 05:22:21.599849+05:30	f
11324	ttruck1	1a1dc91c907325c69271ddf0c944bc72	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 05:22:30.435867+05:30	2017-05-11 05:22:30.435867+05:30	f
11325	luiz@saborbrasil.com.br	170f9a8f689fc69157ad6d3a62ecd92f	Luiz	Claudio	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-11 21:24:53.539657+05:30	2017-05-11 21:24:53.539657+05:30	f
11326	luiztruck1	5e9b9edbe4c007c65c56c686ea22c594	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-11 21:25:00.272585+05:30	2017-05-11 21:25:00.272585+05:30	f
11327	luiz@saborbrasileiro.com.br	170f9a8f689fc69157ad6d3a62ecd92f	Luiz	Gomes	OWNER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-05-12 02:58:17.229644+05:30	2017-05-12 02:58:17.229644+05:30	f
11328	saborbrasil	aec60231d83fe6cf81444bc536596887	\N	\N	UNITMGR	\N	\N	\N	\N	\N	\N	\N	\N	\N	en	2017-05-12 03:04:01.401642+05:30	2017-05-12 03:04:01.401642+05:30	f
11194	s56	73ebb0e2299c89dc70a54abbde5c0a7c	Stacy	Brown	CUSTOMER	\N	\N	\N	local	local	{}	\N	\N	\N	en	2017-03-05 08:59:11.870072+05:30	2017-03-05 08:59:11.870072+05:30	f
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 4, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: checkin_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.checkin_history_id_seq', 1, false);


--
-- Name: checkins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.checkins_id_seq', 120, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 1121, true);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: sfez_rw
--

SELECT pg_catalog.setval('public.contracts_id_seq', 3, true);


--
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.customers_id_seq', 9027, true);


--
-- Name: delivery_addresses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.delivery_addresses_id_seq', 17, true);


--
-- Name: drivers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_id_seq', 38, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 1, false);


--
-- Name: food_park_management_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_park_management_id_seq', 1, false);


--
-- Name: food_parks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.food_parks_id_seq', 30020, true);


--
-- Name: gen_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.gen_state_id_seq', 1, false);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, false);


--
-- Name: loyalty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_id_seq', 1, false);


--
-- Name: loyalty_rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_rewards_id_seq', 4, true);


--
-- Name: loyalty_used_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_used_id_seq', 1, false);


--
-- Name: offers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offers_id_seq', 5, true);


--
-- Name: order_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_history_id_seq', 1120, true);


--
-- Name: order_state_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_state_id_seq', 1, false);


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.requests_id_seq', 8, true);


--
-- Name: review_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_approvals_id_seq', 2, true);


--
-- Name: review_states_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.review_states_id_seq', 5, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 13, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 7, true);


--
-- Name: search_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.search_preferences_id_seq', 1, false);


--
-- Name: territories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.territories_id_seq', 13, true);


--
-- Name: unit_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unit_types_id_seq', 4, true);


--
-- Name: units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.units_id_seq', 2146, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 11328, true);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: checkin_history checkin_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history
    ADD CONSTRAINT checkin_history_pkey PRIMARY KEY (id);


--
-- Name: checkins checkins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_pkey PRIMARY KEY (id);


--
-- Name: companies companies_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_name_key UNIQUE (name);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: sfez_rw
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: delivery_addresses delivery_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_addresses
    ADD CONSTRAINT delivery_addresses_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (id);


--
-- Name: event_guests event_guests_guest_event_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_guests
    ADD CONSTRAINT event_guests_guest_event_key UNIQUE (guest, event);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (customer_id, unit_id, company_id);


--
-- Name: food_park_management food_park_management_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_park_management
    ADD CONSTRAINT food_park_management_pkey PRIMARY KEY (id);


--
-- Name: food_parks food_parks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_parks
    ADD CONSTRAINT food_parks_pkey PRIMARY KEY (id);


--
-- Name: gen_state gen_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gen_state
    ADD CONSTRAINT gen_state_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: loyalty loyalty_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty
    ADD CONSTRAINT loyalty_pkey PRIMARY KEY (id);


--
-- Name: loyalty_rewards loyalty_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_pkey PRIMARY KEY (id);


--
-- Name: loyalty_used loyalty_used_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_used
    ADD CONSTRAINT loyalty_used_pkey PRIMARY KEY (id);


--
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (id);


--
-- Name: order_history order_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_pkey PRIMARY KEY (id);


--
-- Name: order_state order_state_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_state
    ADD CONSTRAINT order_state_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: review_approvals review_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_approvals
    ADD CONSTRAINT review_approvals_pkey PRIMARY KEY (id);


--
-- Name: review_states review_states_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_states
    ADD CONSTRAINT review_states_name_key UNIQUE (name);


--
-- Name: review_states review_states_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_states
    ADD CONSTRAINT review_states_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: roles roles_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_type_key UNIQUE (type);


--
-- Name: search_preferences search_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_preferences
    ADD CONSTRAINT search_preferences_pkey PRIMARY KEY (id);


--
-- Name: territories territories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_pkey PRIMARY KEY (id);


--
-- Name: unit_types unit_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_types
    ADD CONSTRAINT unit_types_pkey PRIMARY KEY (id);


--
-- Name: unit_types unit_types_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unit_types
    ADD CONSTRAINT unit_types_type_key UNIQUE (type);


--
-- Name: units units_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_name_key UNIQUE (name);


--
-- Name: units units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: admins admins_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: checkin_history checkin_history_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history
    ADD CONSTRAINT checkin_history_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: checkin_history checkin_history_food_park_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history
    ADD CONSTRAINT checkin_history_food_park_id_fkey FOREIGN KEY (food_park_id) REFERENCES public.food_parks(id);


--
-- Name: checkin_history checkin_history_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history
    ADD CONSTRAINT checkin_history_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: checkin_history checkin_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkin_history
    ADD CONSTRAINT checkin_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: checkins checkins_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: checkins checkins_food_park_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_food_park_id_fkey FOREIGN KEY (food_park_id) REFERENCES public.food_parks(id);


--
-- Name: checkins checkins_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkins
    ADD CONSTRAINT checkins_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: companies companies_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: companies companies_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: customers customers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: delivery_addresses delivery_addresses_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_addresses
    ADD CONSTRAINT delivery_addresses_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: drivers drivers_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: drivers drivers_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: event_guests event_guests_event_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_guests
    ADD CONSTRAINT event_guests_event_fkey FOREIGN KEY (event) REFERENCES public.events(id);


--
-- Name: event_guests event_guests_guest_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_guests
    ADD CONSTRAINT event_guests_guest_fkey FOREIGN KEY (guest) REFERENCES public.users(id);


--
-- Name: events events_manager_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_manager_fkey FOREIGN KEY (manager) REFERENCES public.users(id);


--
-- Name: favorites favorites_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: favorites favorites_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: favorites favorites_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: food_park_management food_park_management_food_park_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_park_management
    ADD CONSTRAINT food_park_management_food_park_id_fkey FOREIGN KEY (food_park_id) REFERENCES public.food_parks(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: food_park_management food_park_management_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_park_management
    ADD CONSTRAINT food_park_management_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: food_parks food_parks_foodpark_mgr_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_parks
    ADD CONSTRAINT food_parks_foodpark_mgr_fkey FOREIGN KEY (foodpark_mgr) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: food_parks food_parks_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.food_parks
    ADD CONSTRAINT food_parks_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.territories(id);


--
-- Name: locations locations_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.territories(id);


--
-- Name: loyalty loyalty_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty
    ADD CONSTRAINT loyalty_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: loyalty loyalty_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty
    ADD CONSTRAINT loyalty_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: loyalty_rewards loyalty_rewards_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_rewards
    ADD CONSTRAINT loyalty_rewards_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: loyalty_used loyalty_used_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_used
    ADD CONSTRAINT loyalty_used_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: loyalty_used loyalty_used_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_used
    ADD CONSTRAINT loyalty_used_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: order_history order_history_checkin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_checkin_id_fkey FOREIGN KEY (checkin_id) REFERENCES public.checkins(id);


--
-- Name: order_history order_history_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: order_history order_history_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: order_history order_history_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.delivery_addresses(id);


--
-- Name: order_history order_history_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(id);


--
-- Name: order_history order_history_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_history
    ADD CONSTRAINT order_history_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: order_state order_state_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_state
    ADD CONSTRAINT order_state_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order_history(id);


--
-- Name: requests requests_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: review_approvals review_approvals_reviewer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_approvals
    ADD CONSTRAINT review_approvals_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES public.admins(id);


--
-- Name: reviews reviews_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: reviews reviews_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: reviews reviews_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_status_fkey FOREIGN KEY (status) REFERENCES public.review_states(name);


--
-- Name: reviews reviews_unit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES public.units(id);


--
-- Name: search_preferences search_preferences_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_preferences
    ADD CONSTRAINT search_preferences_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- Name: search_preferences search_preferences_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.search_preferences
    ADD CONSTRAINT search_preferences_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.territories(id);


--
-- Name: territories territories_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.territories
    ADD CONSTRAINT territories_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id);


--
-- Name: units units_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id);


--
-- Name: units units_territory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_territory_id_fkey FOREIGN KEY (territory_id) REFERENCES public.territories(id);


--
-- Name: units units_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_type_fkey FOREIGN KEY (type) REFERENCES public.unit_types(type);


--
-- Name: units units_unit_mgr_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT units_unit_mgr_id_fkey FOREIGN KEY (unit_mgr_id) REFERENCES public.users(id);


--
-- Name: users users_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_fkey FOREIGN KEY (role) REFERENCES public.roles(type);


--
-- Name: FUNCTION calc_earth_dist(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.calc_earth_dist(lat1 numeric, lng1 numeric, lat2 numeric, lng2 numeric) TO sfez_rw;


--
-- Name: TABLE admins; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.admins TO sfez_rw;


--
-- Name: SEQUENCE admins_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.admins_id_seq TO sfez_rw;


--
-- Name: TABLE checkin_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.checkin_history TO sfez_rw;


--
-- Name: SEQUENCE checkin_history_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.checkin_history_id_seq TO sfez_rw;


--
-- Name: TABLE checkins; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.checkins TO sfez_rw;


--
-- Name: SEQUENCE checkins_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.checkins_id_seq TO sfez_rw;


--
-- Name: TABLE companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.companies TO sfez_rw;


--
-- Name: SEQUENCE companies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.companies_id_seq TO sfez_rw;


--
-- Name: TABLE countries; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.countries TO sfez_rw;


--
-- Name: SEQUENCE countries_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.countries_id_seq TO sfez_rw;


--
-- Name: TABLE customers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.customers TO sfez_rw;


--
-- Name: SEQUENCE customers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.customers_id_seq TO sfez_rw;


--
-- Name: TABLE delivery_addresses; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.delivery_addresses TO sfez_rw;


--
-- Name: SEQUENCE delivery_addresses_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.delivery_addresses_id_seq TO sfez_rw;


--
-- Name: TABLE drivers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.drivers TO sfez_rw;


--
-- Name: TABLE drivers_foodpark; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.drivers_foodpark TO sfez_rw;


--
-- Name: SEQUENCE drivers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.drivers_id_seq TO sfez_rw;


--
-- Name: TABLE event_guests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.event_guests TO sfez_rw;


--
-- Name: TABLE events; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.events TO sfez_rw;


--
-- Name: SEQUENCE events_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.events_id_seq TO sfez_rw;


--
-- Name: TABLE favorites; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.favorites TO sfez_rw;


--
-- Name: TABLE food_park_management; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.food_park_management TO sfez_rw;


--
-- Name: SEQUENCE food_park_management_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.food_park_management_id_seq TO sfez_rw;


--
-- Name: TABLE food_parks; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.food_parks TO sfez_rw;


--
-- Name: SEQUENCE food_parks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.food_parks_id_seq TO sfez_rw;


--
-- Name: SEQUENCE gen_state_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.gen_state_id_seq TO sfez_rw;


--
-- Name: TABLE locations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.locations TO sfez_rw;


--
-- Name: SEQUENCE locations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.locations_id_seq TO sfez_rw;


--
-- Name: TABLE loyalty; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.loyalty TO sfez_rw;


--
-- Name: SEQUENCE loyalty_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.loyalty_id_seq TO sfez_rw;


--
-- Name: TABLE loyalty_rewards; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.loyalty_rewards TO sfez_rw;


--
-- Name: SEQUENCE loyalty_rewards_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.loyalty_rewards_id_seq TO sfez_rw;


--
-- Name: TABLE loyalty_used; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.loyalty_used TO sfez_rw;


--
-- Name: SEQUENCE loyalty_used_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.loyalty_used_id_seq TO sfez_rw;


--
-- Name: TABLE order_history; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.order_history TO sfez_rw;


--
-- Name: SEQUENCE order_history_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_history_id_seq TO sfez_rw;


--
-- Name: TABLE order_state; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.order_state TO sfez_rw;


--
-- Name: SEQUENCE order_state_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.order_state_id_seq TO sfez_rw;


--
-- Name: TABLE review_approvals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.review_approvals TO sfez_rw;


--
-- Name: SEQUENCE review_approvals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.review_approvals_id_seq TO sfez_rw;


--
-- Name: TABLE review_states; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.review_states TO sfez_rw;


--
-- Name: SEQUENCE review_states_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.review_states_id_seq TO sfez_rw;


--
-- Name: TABLE reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.reviews TO sfez_rw;


--
-- Name: SEQUENCE reviews_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.reviews_id_seq TO sfez_rw;


--
-- Name: TABLE roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.roles TO sfez_rw;


--
-- Name: SEQUENCE roles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.roles_id_seq TO sfez_rw;


--
-- Name: TABLE search_preferences; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.search_preferences TO sfez_rw;


--
-- Name: SEQUENCE search_preferences_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.search_preferences_id_seq TO sfez_rw;


--
-- Name: TABLE square_unit; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.square_unit TO sfez_rw;


--
-- Name: TABLE square_user; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.square_user TO sfez_rw;


--
-- Name: TABLE territories; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.territories TO sfez_rw;


--
-- Name: SEQUENCE territories_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.territories_id_seq TO sfez_rw;


--
-- Name: TABLE unit_types; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.unit_types TO sfez_rw;


--
-- Name: SEQUENCE unit_types_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.unit_types_id_seq TO sfez_rw;


--
-- Name: TABLE units; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.units TO sfez_rw;


--
-- Name: SEQUENCE units_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.units_id_seq TO sfez_rw;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.users TO sfez_rw;


--
-- Name: SEQUENCE users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.users_id_seq TO sfez_rw;


--
-- PostgreSQL database dump complete
--

