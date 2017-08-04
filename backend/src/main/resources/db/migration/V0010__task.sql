CREATE TABLE task (
  id                  BIGINT PRIMARY KEY,
  description         VARCHAR NOT NULL,
  title               VARCHAR NOT NULL,
  status              VARCHAR NOT NULL,
  due_date            DATE,
  creator_id          BIGINT,
  assignee_id         BIGINT,
  concerned_person_id BIGINT,
  archival_instant    TIMESTAMPTZ
);

ALTER TABLE task ADD CONSTRAINT task_fk1 FOREIGN KEY (creator_id) REFERENCES guser (id);
ALTER TABLE task ADD CONSTRAINT task_fk2 FOREIGN KEY (assignee_id) REFERENCES guser (id);
ALTER TABLE task ADD CONSTRAINT task_fk3 FOREIGN KEY (concerned_person_id) REFERENCES person (id);

CREATE SEQUENCE task_seq START WITH 1000;

CREATE INDEX task_idx1
  ON task (status, assignee_id);
CREATE INDEX task_idx2
  ON task (status, concerned_person_id);
