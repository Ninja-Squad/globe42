ALTER TABLE wedding_event
  ADD COLUMN location VARCHAR NOT NULL;

ALTER TABLE wedding_event
  ALTER person_id SET NOT NULL;
