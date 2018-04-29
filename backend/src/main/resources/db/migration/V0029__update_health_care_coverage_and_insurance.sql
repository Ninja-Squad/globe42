UPDATE person
SET health_care_coverage = 'PUMA' WHERE health_care_coverage = 'CMU';

UPDATE person
SET health_care_coverage = 'AGR' WHERE health_care_coverage = 'MSA';

UPDATE person
SET health_care_coverage = 'SSI' WHERE health_care_coverage = 'RSI';

UPDATE person
SET health_care_coverage = 'OTHER' WHERE health_care_coverage = 'SPECIAL';

UPDATE person
SET health_insurance = 'UNKNOWN' WHERE health_insurance IS NULL OR health_insurance = '';

UPDATE person
SET health_insurance = 'MUTUELLE' WHERE health_insurance != 'UNKNOWN' AND health_insurance != 'CMUC';

ALTER TABLE person
  ALTER health_insurance SET NOT NULL;