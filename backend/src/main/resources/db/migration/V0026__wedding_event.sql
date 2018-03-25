CREATE TABLE wedding_event (
  id               BIGINT PRIMARY KEY,
  event_date       DATE NOT NULL,
  type             VARCHAR NOT NULL,
  person_id        BIGINT
);

ALTER TABLE wedding_event ADD CONSTRAINT wedding_event_fk1 FOREIGN KEY (person_id) REFERENCES person (id);

CREATE SEQUENCE wedding_event_seq START WITH 1000;
