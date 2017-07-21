CREATE TABLE family_situation (
  id              BIGINT PRIMARY KEY,
  parents_present BOOLEAN NOT NULL,
  spouse_present  BOOLEAN NOT NULL,
  child_count     INT,
  sibling_count   INT
);

CREATE SEQUENCE family_situation_seq START WITH 1000;


ALTER TABLE person
  ADD COLUMN housing VARCHAR;
ALTER TABLE person
  ADD COLUMN housing_space INT;
ALTER TABLE person
  ADD COLUMN fiscal_status VARCHAR;
ALTER TABLE person
  ADD COLUMN fiscal_status_date DATE;
ALTER TABLE person
  ADD COLUMN fiscal_status_up_to_date BOOLEAN;
ALTER TABLE person
  ADD COLUMN french_family_situation_id BIGINT;
ALTER TABLE person
  ADD COLUMN abroad_family_situation_id BIGINT;

ALTER TABLE person
  ADD CONSTRAINT person_fk1 FOREIGN KEY (french_family_situation_id) REFERENCES family_situation (id);
ALTER TABLE person
  ADD CONSTRAINT person_fk2 FOREIGN KEY (abroad_family_situation_id) REFERENCES family_situation (id);

UPDATE person set fiscal_status_up_to_date = FALSE;

ALTER TABLE person ALTER fiscal_status_up_to_date SET NOT NULL