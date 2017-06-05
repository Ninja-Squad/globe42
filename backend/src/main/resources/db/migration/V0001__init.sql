create table PERSON (
  ID BIGINT PRIMARY KEY,
  first_name VARCHAR,
  last_name VARCHAR,
  sur_name VARCHAR NOT NULL UNIQUE,
  gender VARCHAR,
  birth_date DATE,
  email VARCHAR,
  phone_number VARCHAR,
  address VARCHAR,
  postal_code VARCHAR(5),
  city VARCHAR,
  adherent BOOLEAN NOT NULL,
  entry_date DATE,
  mediation_code VARCHAR
);

create sequence PERSON_SEQ start with 1000;
