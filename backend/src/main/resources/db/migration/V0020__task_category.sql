CREATE TABLE task_category (
  id   BIGINT PRIMARY KEY,
  name VARCHAR
);

INSERT INTO task_category (id, name) VALUES (1, 'Administratif');
INSERT INTO task_category (id, name) VALUES (2, 'Accueil');
INSERT INTO task_category (id, name) VALUES (3, 'Base de données');
INSERT INTO task_category (id, name) VALUES (4, 'Cours');
INSERT INTO task_category (id, name) VALUES (5, 'Demande de subventions');
INSERT INTO task_category (id, name) VALUES (6, 'Divers');
INSERT INTO task_category (id, name) VALUES (7, 'Maintenance informatique');
INSERT INTO task_category (id, name) VALUES (8, 'Médiation santé');
INSERT INTO task_category (id, name) VALUES (9, 'Médiation sociale');
INSERT INTO task_category (id, name) VALUES (10, 'Ménage');
INSERT INTO task_category (id, name) VALUES (11, 'Projets');
INSERT INTO task_category (id, name) VALUES (12, 'Repas');
INSERT INTO task_category (id, name) VALUES (13, 'Ressources Humaines');

CREATE SEQUENCE task_category_seq START WITH 1000;

ALTER TABLE task
  ADD COLUMN category_id INT;

UPDATE task
  SET category_id = 6;

ALTER TABLE task
  ALTER category_id SET NOT NULL;

ALTER TABLE task
  ADD CONSTRAINT task_fk4 FOREIGN KEY (category_id) REFERENCES task_category (id);
