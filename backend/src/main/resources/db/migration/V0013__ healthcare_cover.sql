ALTER TABLE person
  ADD COLUMN healthcare_cover VARCHAR;

UPDATE person set healthcare_cover = 'UNKNOWN' WHERE healthcare_cover IS NULL;

ALTER TABLE person ALTER healthcare_cover SET NOT NULL;