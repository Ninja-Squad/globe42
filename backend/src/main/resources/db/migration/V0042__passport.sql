ALTER TABLE person
    ADD COLUMN passport_status VARCHAR;
ALTER TABLE person
    ADD COLUMN passport_number VARCHAR;
ALTER TABLE person
    ADD COLUMN passport_validity_start_date DATE;
ALTER TABLE person
    ADD COLUMN passport_validity_end_date DATE;

UPDATE person SET passport_status = 'UNKNOWN';

ALTER TABLE person
    ALTER passport_status SET NOT NULL;
