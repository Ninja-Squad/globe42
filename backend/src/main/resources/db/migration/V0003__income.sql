CREATE TABLE income_source_type (
  id   BIGINT PRIMARY KEY,
  type VARCHAR NOT NULL UNIQUE
);

CREATE SEQUENCE income_source_type_seq START WITH 1000;

CREATE TABLE income_source (
  id                 BIGINT PRIMARY KEY,
  type_id            BIGINT NOT NULL,
  name               VARCHAR NOT NULL,
  max_monthly_amount NUMERIC(10, 2)
);

ALTER TABLE income_source
  ADD CONSTRAINT income_source_fk1 FOREIGN KEY (type_id) REFERENCES income_source_type (id);

CREATE SEQUENCE income_source_seq START WITH 1000;

CREATE TABLE income (
  id             BIGINT PRIMARY KEY,
  person_id      BIGINT         NOT NULL,
  source_id      BIGINT         NOT NULL,
  monthly_amount NUMERIC(10, 2) NOT NULL
);

ALTER TABLE income
  ADD CONSTRAINT income_fk1 FOREIGN KEY (person_id) REFERENCES person (id);
ALTER TABLE income
  ADD CONSTRAINT income_fk2 FOREIGN KEY (source_id) REFERENCES income_source (id);

CREATE SEQUENCE income_seq START WITH 1000;
