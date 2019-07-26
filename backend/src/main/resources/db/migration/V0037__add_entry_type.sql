ALTER TABLE person
  ADD COLUMN entry_type VARCHAR;
UPDATE person SET entry_type = 'UNKNOWN';
ALTER TABLE person
  ALTER entry_type SET NOT NULL;
