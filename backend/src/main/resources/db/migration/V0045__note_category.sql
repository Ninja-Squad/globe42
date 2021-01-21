ALTER TABLE note
    ADD COLUMN category VARCHAR;

UPDATE note SET category = 'APPOINTMENT';

ALTER TABLE note
    ALTER category SET NOT NULL;
