#! /bin/sh

# psql must be in $PATH



psql -U postgres  -c "DROP DATABASE sfezdb;"
psql -U postgres postgres -c "DROP ROLE sfez_rw;"

psql -U postgres  -c "CREATE USER sfez_rw WITH PASSWORD 'sfez';"

psql -U postgres  -c "CREATE DATABASE sfezdb WITH OWNER = postgres ENCODING = 'UTF8' TABLESPACE = pg_default \
LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8' CONNECTION LIMIT = -1;"

psql -U postgres  -c "GRANT CONNECT ON DATABASE sfezdb TO sfez_rw;"

psql -U postgres  -d sfezdb -f sfez_create_tables.sql

## TEST DATA INSERTION
## Uncomment psql line below

# psql sfezdb < sfez_create_test_data.dmp
