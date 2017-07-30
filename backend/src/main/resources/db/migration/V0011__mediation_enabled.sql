ALTER TABLE person
  ALTER first_name SET NOT NULL;
ALTER TABLE person
  ALTER mediation_code DROP NOT NULL;
ALTER TABLE person
  ALTER gender SET NOT NULL;

ALTER TABLE person
  ADD COLUMN mediation_enabled BOOLEAN;

UPDATE person SET mediation_enabled = TRUE;

ALTER TABLE person
  ALTER mediation_enabled SET NOT NULL;
