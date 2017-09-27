CREATE TABLE charge_category (
  id   BIGINT PRIMARY KEY,
  name VARCHAR NOT NULL UNIQUE
);

CREATE SEQUENCE charge_category_seq START WITH 1000;

CREATE TABLE charge_type (
  id                 BIGINT PRIMARY KEY,
  category_id        BIGINT NOT NULL,
  name               VARCHAR NOT NULL,
  max_monthly_amount NUMERIC(10, 2)
);

ALTER TABLE charge_type
  ADD CONSTRAINT charge_type_fk1 FOREIGN KEY (category_id) REFERENCES charge_category (id);

CREATE SEQUENCE charge_type_seq START WITH 1000;

CREATE TABLE charge (
  id             BIGINT PRIMARY KEY,
  person_id      BIGINT         NOT NULL,
  type_id        BIGINT         NOT NULL,
  monthly_amount NUMERIC(10, 2) NOT NULL
);

ALTER TABLE charge
  ADD CONSTRAINT charge_fk1 FOREIGN KEY (person_id) REFERENCES person (id);
ALTER TABLE charge
  ADD CONSTRAINT charge_fk2 FOREIGN KEY (type_id) REFERENCES charge_type (id);

CREATE SEQUENCE charge_seq START WITH 1000;
