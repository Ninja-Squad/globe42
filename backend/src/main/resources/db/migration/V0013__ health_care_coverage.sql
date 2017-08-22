ALTER TABLE person
  ADD COLUMN health_care_coverage VARCHAR;

UPDATE person set health_care_coverage = 'UNKNOWN' WHERE health_care_coverage IS NULL;

ALTER TABLE person ALTER health_care_coverage SET NOT NULL;