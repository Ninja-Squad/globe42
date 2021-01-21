ALTER TABLE person
    ADD COLUMN school_level VARCHAR;

UPDATE person SET school_level = 'UNKNOWN';

ALTER TABLE person
    ALTER school_level SET NOT NULL;
