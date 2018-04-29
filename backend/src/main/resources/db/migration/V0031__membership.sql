CREATE TABLE membership (
  id           BIGINT PRIMARY KEY,
  year         INT     NOT NULL,
  person_id    BIGINT  NOT NULL,
  payment_date DATE    NOT NULL,
  payment_mode VARCHAR NOT NULL,
  card_number  VARCHAR
);

ALTER TABLE membership
  ADD CONSTRAINT membership_fk1 FOREIGN KEY (person_id) REFERENCES person (id);

CREATE UNIQUE INDEX membership_idx1
  ON membership (person_id, year);

CREATE SEQUENCE membership_seq
  START WITH 1000;

INSERT INTO membership (id, year, person_id, payment_date, payment_mode)
  select nextval('membership_seq'), 2018, person.id, to_date('2018-01-31', 'YYYY-MM-DD'), 'UNKNOWN'
  from person
  where person.adherent = true and person.deleted = false;

ALTER TABLE person
  DROP COLUMN adherent;
