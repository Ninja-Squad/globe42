ALTER TABLE person
  ADD COLUMN visa VARCHAR;
ALTER TABLE person
  ADD COLUMN residence_permit VARCHAR;
ALTER TABLE person
  ADD COLUMN residence_permit_deposit_date DATE;
ALTER TABLE person
  ADD COLUMN residence_permit_renewal_date DATE;


UPDATE person set visa = 'UNKNOWN' WHERE visa IS NULL;
UPDATE person set residence_permit = 'UNKNOWN' WHERE residence_permit IS NULL;


ALTER TABLE person ALTER visa SET NOT NULL;
ALTER TABLE person ALTER residence_permit SET NOT NULL;
