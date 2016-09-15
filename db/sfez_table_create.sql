--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.1

-- Started on 2016-09-14 18:24:29 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12623)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2501 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


CREATE TABLE admins (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    photo text,
    super_admin boolean DEFAULT false,
    city text,
    state text,
    country text,
    user_id integer,
    created timestamp without time zone DEFAULT now()
);
ALTER TABLE admins OWNER TO postgres;
CREATE SEQUENCE admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE admins_id_seq OWNER TO postgres;
ALTER SEQUENCE admins_id_seq OWNED BY admins.id;

CREATE TABLE companies (
    id integer NOT NULL,
    name text NOT NULL,
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
    user_id integer,
    created timestamp without time zone DEFAULT now()
);
ALTER TABLE companies OWNER TO postgres;
CREATE SEQUENCE companies_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE companies_id_seq OWNER TO postgres;
ALTER SEQUENCE companies_id_seq OWNED BY companies.id;


CREATE TABLE customers (
    id integer NOT NULL,
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
    user_id integer,
    created timestamp without time zone DEFAULT now()
);
ALTER TABLE customers OWNER TO postgres;
CREATE SEQUENCE customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE customers_id_seq OWNER TO postgres;
ALTER SEQUENCE customers_id_seq OWNED BY customers.id;


CREATE TABLE review_approvals (
    id integer NOT NULL,
    review_id integer,
    admin_id integer,
    status text,
    created timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);
ALTER TABLE review_approvals OWNER TO postgres;
CREATE SEQUENCE review_approvals_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE review_approvals_id_seq OWNER TO postgres;
ALTER SEQUENCE review_approvals_id_seq OWNED BY review_approvals.id;


CREATE TABLE reviews (
    id integer NOT NULL,
    comment text,
    rating numeric,
    answers jsonb,
    user_id integer,
    company_id integer,
    unit_id integer,
    status text,
    created timestamp without time zone DEFAULT now()
);
ALTER TABLE reviews OWNER TO postgres;
CREATE SEQUENCE reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE reviews_id_seq OWNER TO postgres;
ALTER SEQUENCE reviews_id_seq OWNED BY reviews.id;

CREATE TABLE roles (
    id integer NOT NULL,
    type text NOT NULL
);
ALTER TABLE roles OWNER TO postgres;
CREATE SEQUENCE roles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE roles_id_seq OWNER TO postgres;
ALTER SEQUENCE roles_id_seq OWNED BY roles.id;


CREATE TABLE units (
    id integer NOT NULL,
    name text NOT NULL,
    number integer NOT NULL,
    description text,
    username text,
    password text,
    qrcode text,
    unit_order_sys_id integer,
    company_id integer,
    unit_mgr_id integer
);
ALTER TABLE units OWNER TO postgres;
CREATE SEQUENCE units_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE units_id_seq OWNER TO postgres;
ALTER SEQUENCE units_id_seq OWNED BY units.id;


CREATE TABLE users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text,
    provider text,
    provider_id text,
    provider_data text,
    created timestamp without time zone DEFAULT now()
);
ALTER TABLE users OWNER TO postgres;
CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE users_id_seq OWNER TO postgres;
ALTER SEQUENCE users_id_seq OWNED BY users.id;

ALTER TABLE ONLY admins ALTER COLUMN id SET DEFAULT nextval('admins_id_seq'::regclass);
ALTER TABLE ONLY companies ALTER COLUMN id SET DEFAULT nextval('companies_id_seq'::regclass);
ALTER TABLE ONLY customers ALTER COLUMN id SET DEFAULT nextval('customers_id_seq'::regclass);
ALTER TABLE ONLY knex_migrations ALTER COLUMN id SET DEFAULT nextval('knex_migrations_id_seq'::regclass);
ALTER TABLE ONLY review_approvals ALTER COLUMN id SET DEFAULT nextval('review_approvals_id_seq'::regclass);
ALTER TABLE ONLY reviews ALTER COLUMN id SET DEFAULT nextval('reviews_id_seq'::regclass);
ALTER TABLE ONLY roles ALTER COLUMN id SET DEFAULT nextval('roles_id_seq'::regclass);
ALTER TABLE ONLY units ALTER COLUMN id SET DEFAULT nextval('units_id_seq'::regclass);
ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);

COPY admins (id, name, description, photo, super_admin, city, state, country, user_id, created) FROM stdin;
\.
SELECT pg_catalog.setval('admins_id_seq', 1, false);

COPY companies (id, name, order_sys_id, base_slug, default_cat, description, email, facebook, twitter, photo, featured_dish, hours, schedule, city, state, country, taxband, user_id, created) FROM stdin;
1001	Pacos Tacos	1293770040725734215	pacos-1472261511383	1325748109401129298	Fresh street food tacos	Julieg@hotmail.com	www.facebook.com/pacostacos	@pacostacos	\N	\N	11am-8pm	M-F	\N	\N	\N	11004	45	2016-08-26 21:31:52.102331
1002	Thaitanic	1293768990807556920	thaitanic-1471829851769	1322127087452029500	Authentic Thai	Bobsmith@hotmail.com	www.facebook.com/thaitanic	@thaitan	\N	\N	3pm-5pm	TWTF	\N	\N	\N	11005	21	2016-08-21 21:37:32.594516
1003	Grilla Cheese	1293768990807556920	grillacheese-1471829851769	1322127087452029500	Thick slabs of grilled cheese on Texas toast	Cindy@gmail.com	wwww.facebook.com/grillacheese	@griller	\N	\N	11am-3pm	MTWTFSS	\N	\N	\N	11006	21	2016-08-21 21:37:32.594516
\.
SELECT pg_catalog.setval('companies_id_seq', 1004, true);

COPY customers (id, name, order_sys_id, description, facebook, twitter, photo, power_reviewer, city, state, country, user_id, created) FROM stdin;
9001	Stacy T	\N	Taco expert. I love tacos.	www.facebook.com/stacytfakeaccount	\N	\N	f	\N	\N	\N	11001	2016-08-21 23:31:43.151356
9002	Jonathan Jones	\N	Serial food eater	www.facebook.com/jonjonesfakeaccount	\N	\N	f	\N	\N	\N	11002	2016-08-21 23:31:43.151356
9003	Marco and Inez	\N	Food bloggers. Follow us on mifood.blog.com	www.facebook.com/mifoodfakeaccont	\N	\N	t	\N	\N	\N	11003	2016-08-21 23:31:43.151356\.
SELECT pg_catalog.setval('customers_id_seq', 9004, true);


COPY review_approvals (id, review_id, admin_id, status, created, created_at, updated_at) FROM stdin;
1	3	\N	\N	2016-09-07 19:31:05.195922	2016-09-07 19:31:05.195922	2016-09-07 19:31:05.195922
2	4	\N	\N	2016-09-07 19:33:13.598095	2016-09-07 19:33:13.598095	2016-09-07 19:33:13.598095
3	5	\N	\N	2016-09-07 19:36:06.711809	2016-09-07 19:36:06.711809	2016-09-07 19:36:06.711809
4	6	\N	\N	2016-09-07 19:37:07.687663	2016-09-07 19:37:07.687663	2016-09-07 19:37:07.687663
5	7	\N	\N	2016-09-07 19:38:49.741905	2016-09-07 19:38:49.741905	2016-09-07 19:38:49.741905
6	8	\N	\N	2016-09-09 17:00:41.496519	2016-09-09 17:00:41.496519	2016-09-09 17:00:41.496519
7	9	\N	\N	2016-09-09 17:01:02.500207	2016-09-09 17:01:02.500207	2016-09-09 17:01:02.500207
8	10	\N	\N	2016-09-09 17:01:31.812907	2016-09-09 17:01:31.812907	2016-09-09 17:01:31.812907
\.
SELECT pg_catalog.setval('review_approvals_id_seq', 8, true);

COPY reviews (id, comment, rating, answers, user_id, company_id, unit_id, status, created) FROM stdin;
4	Very clean and the customer service is excellent.	4.8	{"answer": 4, "question": "Food good?"}	9002	1003	1	\N	2016-09-07 19:33:13.598095
5	Broad selection of quality food and creative menu.	4.9	{"answer": 4, "question": "Food good?"}	9003	1002	2001	\N	2016-09-07 19:36:06.711809
6	Thaitanic has the best cart in the city.	4.7	{"answer": 4, "question": "Food good?"}	9003	1002	2002	\N	2016-09-07 19:37:07.687663
7	BIG portions prepared exactly how you request and unreasonably low prices!!!  Love tacos!	4.6	{"answer": 4, "question": "Food good?"}	9001	1001	2003	\N	2016-09-07 19:38:49.741905
\.
SELECT pg_catalog.setval('reviews_id_seq', 8, true);

COPY roles (id, type) FROM stdin;
1	CUSTOMER
2	OWNER
4	ADMIN
3	UNITMGR
\.
SELECT pg_catalog.setval('roles_id_seq', 5, true);

COPY units (id, name, number, description, username, password, qrcode, unit_order_sys_id, company_id, unit_mgr_id) FROM stdin;
2001	Thaitanic Truck 1	1	Truck	mptruck61	mptruck61	\N	\N	1002	11007
2002	Thaitanic Cart 1	1	Cart	mptruck64	mptruck64	\N	\N	1002	11008
2003	Pacos Tacos Truck 1	1	Truck	mptruck64five	mptruck64five	\N	\N	1001	11009
2004	Grilla Cheese Truck 1	1	Truck	mptruck64five	mptruck64five	\N	\N	1003	11010
\.
SELECT pg_catalog.setval('units_id_seq', 2004, true);



COPY users (id, username, password, role, provider, provider_id, provider_data, created) FROM stdin;
11001	mp12	5a4636076012403dd394fa20f49fcd9c	CUSTOMER	local	local	local	2016-08-21 23:31:43.131352
11002	mp2	defc72a96803a619a6735cd7e7e69e1b	CUSTOMER	local	local	local	2016-08-21 23:01:03.622149
11003	mp3	28dafd4a8cb5f33065e93cbc83862563	CUSTOMER	local	local	local	2016-08-21 23:01:50.563872
11004	mp4	4866d635ea7b0ed8e2452da897143528	OWNER	local	local	local	2016-08-21 23:03:07.177813
11005	mp5	146eb1afa89654aca443976646460ef4	OWNER	local	local	local	2016-08-21 23:05:04.914807
11006	mp6	5ce4c4a0a26e6df0fdbb380d78f4fab2	OWNER	local	local	local	2016-08-21 23:12:10.112015
11007	mptruck61	6cf9be93694189e06c66faa49a6cbc93	UNITMGR	local	local	local	2016-08-29 20:54:42.540882
11008	mptruck64	5db0aeb457f45ddb90c35b39569c1348	UNITMGR	local	local	local	2016-08-30 21:12:08.717913
11009	mptruck64five	dda2549944250c6c038797b463e7de99	UNITMGR	local	local	local	2016-08-30 21:22:22.983667
11010	trucker1	2c914a017cf7354e6c6319afe0b664b2	UNITMGR	local	local	local	2016-09-06 23:57:26.291924
\.
SELECT pg_catalog.setval('users_id_seq', 11011, true);

ALTER TABLE ONLY admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);
ALTER TABLE ONLY companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);
ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);
ALTER TABLE ONLY review_approvals
    ADD CONSTRAINT review_approvals_pkey PRIMARY KEY (id);
ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_type_key UNIQUE (type);
ALTER TABLE ONLY units
    ADD CONSTRAINT units_name_key UNIQUE (name);
ALTER TABLE ONLY units
    ADD CONSTRAINT units_pkey PRIMARY KEY (id);
ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY admins
    ADD CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY companies
    ADD CONSTRAINT companies_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY customers
    ADD CONSTRAINT customers_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE ONLY review_approvals
    ADD CONSTRAINT review_approvals_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES admins(id);
ALTER TABLE ONLY review_approvals
    ADD CONSTRAINT review_approvals_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);
ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_unit_id_fkey FOREIGN KEY (unit_id) REFERENCES units(id);
ALTER TABLE ONLY reviews
    ADD CONSTRAINT reviews_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE ONLY units
    ADD CONSTRAINT units_company_id_fkey FOREIGN KEY (company_id) REFERENCES companies(id);
ALTER TABLE ONLY units
    ADD CONSTRAINT units_unit_mgr_id_fkey FOREIGN KEY (unit_mgr_id) REFERENCES users(id);
ALTER TABLE ONLY users
    ADD CONSTRAINT user_role_fkey FOREIGN KEY (role) REFERENCES roles(type) ON DELETE CASCADE;


GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;

REVOKE ALL ON TABLE admins FROM PUBLIC;
GRANT ALL ON TABLE admins TO postgres;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE admins TO sfez_read_write;

REVOKE ALL ON SEQUENCE admins_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE admins_id_seq TO postgres;
GRANT ALL ON SEQUENCE admins_id_seq TO sfez_read_write;

REVOKE ALL ON TABLE companies FROM PUBLIC;
GRANT ALL ON TABLE companies TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,UPDATE ON TABLE companies TO sfez_read_write;


REVOKE ALL ON SEQUENCE companies_id_seq FROM PUBLIC;
REVOKE ALL ON SEQUENCE companies_id_seq FROM postgres;
GRANT ALL ON SEQUENCE companies_id_seq TO postgres;
GRANT ALL ON SEQUENCE companies_id_seq TO sfez_read_write;


--
-- TOC entry 2508 (class 0 OID 0)
-- Dependencies: 186
-- Name: customers; Type: ACL; Schema: public; Owner: postgres
--

REVOKE ALL ON TABLE customers FROM PUBLIC;
GRANT ALL ON TABLE customers TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,UPDATE ON TABLE customers TO sfez_read_write;


REVOKE ALL ON SEQUENCE customers_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE customers_id_seq TO postgres;
GRANT ALL ON SEQUENCE customers_id_seq TO sfez_read_write;


REVOKE ALL ON TABLE review_approvals FROM PUBLIC;
GRANT ALL ON TABLE review_approvals TO postgres;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE review_approvals TO sfez_read_write;

REVOKE ALL ON SEQUENCE review_approvals_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE review_approvals_id_seq TO postgres;
GRANT ALL ON SEQUENCE review_approvals_id_seq TO sfez_read_write;

REVOKE ALL ON TABLE reviews FROM PUBLIC;
GRANT ALL ON TABLE reviews TO postgres;
GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE reviews TO sfez_read_write;


REVOKE ALL ON SEQUENCE reviews_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE reviews_id_seq TO postgres;
GRANT ALL ON SEQUENCE reviews_id_seq TO sfez_read_write;


REVOKE ALL ON TABLE roles FROM PUBLIC;
GRANT ALL ON TABLE roles TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,UPDATE ON TABLE roles TO sfez_read_write;



REVOKE ALL ON SEQUENCE roles_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE roles_id_seq TO postgres;
GRANT ALL ON SEQUENCE roles_id_seq TO sfez_read_write;


REVOKE ALL ON TABLE units FROM PUBLIC;
GRANT ALL ON TABLE units TO postgres;
GRANT SELECT,INSERT,DELETE,TRIGGER,UPDATE ON TABLE units TO sfez_read_write;

REVOKE ALL ON SEQUENCE units_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE units_id_seq TO postgres;
GRANT ALL ON SEQUENCE units_id_seq TO sfez_read_write;


GRANT ALL ON TABLE users TO postgres;
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,UPDATE ON TABLE users TO sfez_read_write;

REVOKE ALL ON SEQUENCE users_id_seq FROM PUBLIC;
GRANT ALL ON SEQUENCE users_id_seq TO postgres;
GRANT ALL ON SEQUENCE users_id_seq TO sfez_read_write;
