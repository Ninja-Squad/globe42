CREATE TABLE network_member (
  id               BIGINT PRIMARY KEY,
  type             VARCHAR NOT NULL,
  text             VARCHAR NOT NULL,
  person_id        BIGINT
);

ALTER TABLE network_member ADD CONSTRAINT network_member_fk1 FOREIGN KEY (person_id) REFERENCES person (id);

CREATE SEQUENCE network_member_seq START WITH 1000;
