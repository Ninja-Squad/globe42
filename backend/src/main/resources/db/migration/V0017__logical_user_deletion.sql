ALTER TABLE guser
  ADD COLUMN deleted BOOLEAN;

UPDATE guser
SET deleted = FALSE;

ALTER TABLE guser
  ALTER deleted SET NOT NULL;
ALTER TABLE spent_time
  ALTER creator_id SET NOT NULL;
ALTER TABLE task
  ALTER creator_id SET NOT NULL;
ALTER TABLE note
  ALTER creator_id SET NOT NULL;
