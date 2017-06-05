-- creates the globe42 user and database
-- this script must be executed by an admin user. It can typically be executed from the root of the project using
-- psql -h localhost -U postgres -f backend/database/database.sql

create user globe42 password 'globe42';
create database globe42 owner globe42
  encoding 'UTF8'
  lc_collate 'fr_FR.UTF-8'
  lc_ctype 'fr_FR.UTF-8'
  template=template0;

create database globe42_test owner globe42
encoding 'UTF8'
lc_collate 'fr_FR.UTF-8'
lc_ctype 'fr_FR.UTF-8'
template=template0;
