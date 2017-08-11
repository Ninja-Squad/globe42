CREATE TABLE note (
  id               BIGINT PRIMARY KEY,
  text             VARCHAR,
  creator_id       BIGINT,
  creation_instant TIMESTAMPTZ NOT NULL
);

ALTER TABLE note ADD CONSTRAINT note_fk1 FOREIGN KEY (creator_id) REFERENCES guser (id);

CREATE SEQUENCE note_seq START WITH 1000;

CREATE TABLE person_note (
  person_id BIGINT,
  note_id   BIGINT,
  PRIMARY KEY (person_id, note_id)
);

ALTER TABLE person_note ADD CONSTRAINT person_note_fk1 FOREIGN KEY (person_id) REFERENCES person (id);
ALTER TABLE person_note ADD CONSTRAINT person_note_fk2 FOREIGN KEY (note_id) REFERENCES note (id);
