CREATE TABLE participation (
  id               BIGINT PRIMARY KEY,
  activity_type    VARCHAR,
  person_id        BIGINT
);

ALTER TABLE participation ADD CONSTRAINT participation_fk1 FOREIGN KEY (person_id) REFERENCES person (id);
ALTER TABLE participation ADD CONSTRAINT participation_un1 UNIQUE (person_id, activity_type);

CREATE SEQUENCE participation_seq START WITH 1000;
