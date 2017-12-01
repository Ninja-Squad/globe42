ALTER TABLE person
  ADD COLUMN deleted BOOLEAN;

UPDATE person
SET deleted = FALSE;

ALTER TABLE person
  ALTER deleted SET NOT NULL;
