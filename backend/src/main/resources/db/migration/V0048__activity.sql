CREATE TABLE activity
(
    id   BIGINT PRIMARY KEY,
    type VARCHAR NOT NULL,
    date DATE    NOT NULL
);

CREATE SEQUENCE activity_seq START WITH 1000;

CREATE TABLE activity_participant
(
    activity_id BIGINT NOT NULL,
    person_id   BIGINT NOT NULL
);

ALTER TABLE activity_participant
    ADD CONSTRAINT activity_participant_fk1 FOREIGN KEY (activity_id) REFERENCES activity (id);
ALTER TABLE activity_participant
    ADD CONSTRAINT activity_participant_fk2 FOREIGN KEY (person_id) REFERENCES person (id);
