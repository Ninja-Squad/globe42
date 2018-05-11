CREATE TABLE family (
  id               BIGINT PRIMARY KEY,
  parent_in_france BOOLEAN NOT NULL,
  parent_abroad    BOOLEAN NOT NULL,
  spouse_location  VARCHAR
);

CREATE SEQUENCE family_seq
  START WITH 1000;

CREATE TABLE child (
  id         BIGINT PRIMARY KEY,
  first_name VARCHAR,
  birth_date DATE,
  location   VARCHAR NOT NULL,
  family_id  BIGINT  NOT NULL
);

ALTER TABLE child
  ADD CONSTRAINT child_fk1 FOREIGN KEY (family_id) REFERENCES family (id);

CREATE SEQUENCE child_seq
  START WITH 1000;

ALTER TABLE person
  ADD COLUMN family_id BIGINT;

ALTER TABLE person
  ADD CONSTRAINT person_fk5 FOREIGN KEY (family_id) REFERENCES family (id);

CREATE FUNCTION migrate_families()
  RETURNS INTEGER AS $$

DECLARE
  row               RECORD;
  created_family_id BIGINT;
BEGIN

  FOR row IN SELECT
               p.id                as person_id,
               ffs.id              as fid,
               ffs.parents_present as fparent,
               ffs.spouse_present  as fspouse,
               ffs.child_count     as fchild,
               afs.id              as aid,
               afs.parents_present as aparent,
               afs.spouse_present  as aspouse,
               afs.child_count     as achild
             FROM person p
               LEFT JOIN family_situation ffs on p.french_family_situation_id = ffs.id
               LEFT JOIN family_situation afs on p.abroad_family_situation_id = afs.id

  LOOP
    IF (row.fid is not null or row.aid is not null)
    THEN
      created_family_id := nextval('family_seq');

      INSERT INTO family (id, parent_in_france, parent_abroad, spouse_location)
      VALUES (created_family_id,
              coalesce(row.fparent, FALSE),
              coalesce(row.aparent, FALSE),
              CASE WHEN row.fspouse = TRUE
                THEN 'FRANCE'
              WHEN row.aspouse = TRUE
                THEN 'ABROAD'
              ELSE null END);

      UPDATE person
      SET family_id = created_family_id
      WHERE person.id = row.person_id;

      FOR i IN 1..coalesce(row.fchild, 0) LOOP
        INSERT INTO child (id, location, family_id) VALUES (nextval('child_seq'), 'FRANCE', created_family_id);
      END LOOP;

      FOR i IN 1..coalesce(row.achild, 0) LOOP
        INSERT INTO child (id, location, family_id) VALUES (nextval('child_seq'), 'ABROAD', created_family_id);
      END LOOP;
    END IF;
  END LOOP;

  RETURN 1;
END;
$$
LANGUAGE plpgsql;

select migrate_families();

drop function migrate_families();

ALTER TABLE person
  DROP COLUMN french_family_situation_id;
ALTER TABLE person
  DROP COLUMN abroad_family_situation_id;
DROP TABLE family_situation;
DROP SEQUENCE family_situation_seq;
