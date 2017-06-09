CREATE TABLE person (
  id             BIGINT PRIMARY KEY,
  first_name     VARCHAR,
  last_name      VARCHAR,
  nick_name       VARCHAR NOT NULL UNIQUE,
  gender         VARCHAR,
  birth_date     DATE,
  email          VARCHAR,
  phone_number   VARCHAR,
  address        VARCHAR,
  postal_code    VARCHAR(5),
  city           VARCHAR,
  adherent       BOOLEAN NOT NULL,
  entry_date     DATE,
  mediation_code VARCHAR
);

CREATE SEQUENCE person_seq START WITH 1000;
