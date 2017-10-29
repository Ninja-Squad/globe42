CREATE TABLE spent_time (
  id               BIGINT PRIMARY KEY,
  minutes          INT NULL,
  task_id          BIGINT,
  creator_id       BIGINT,
  creation_instant TIMESTAMPTZ
);

ALTER TABLE spent_time
  ADD CONSTRAINT task_fk1 FOREIGN KEY (task_id) REFERENCES task (id);
ALTER TABLE spent_time
  ADD CONSTRAINT task_fk2 FOREIGN KEY (creator_id) REFERENCES guser (id);

CREATE SEQUENCE spent_time_seq START WITH 1000;

ALTER TABLE task
  ADD COLUMN total_spent_time_in_minutes INT;

UPDATE task
SET total_spent_time_in_minutes = 0;

ALTER TABLE task
  ALTER total_spent_time_in_minutes SET NOT NULL;
