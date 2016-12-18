CREATE TABLE EST_SUIVI_PAR (
  id SERIAL UNIQUE NOT NULL,
  id_reseau SERIAL unique not null,
  PRIMARY KEY (id, id_reseau)
);

CREATE TABLE FREQUENTATION (
  id INT,
  id_activite INT,
  date_effective TIMESTAMP,
  rendez_vous TIMESTAMP,
  absence bool,
  PRIMARY KEY (id, id_activite)
);

CREATE TABLE EST_INSCRIT_DANS (
  id SERIAL unique not null,
  id_activite INT,
  date_debut TIMESTAMP,
  date_fin TIMESTAMP,
  PRIMARY KEY (id, id_activite)
);

CREATE TABLE STATUT (
  id SERIAL unique not null,
  code_statut INT,
  libelle_statut VARCHAR(42),
  PRIMARY KEY (id)
);

CREATE TABLE NATIONALITE (
  id SERIAL unique not null,
  code_nationalite VARCHAR(2),
  libelle_nationalite VARCHAR(42),
  PRIMARY KEY (id)
);

CREATE TABLE SITUATION_FAMILIALE (
  id SERIAL unique not null,
  code_situation INT,
  libelle_situation VARCHAR(42),
  PRIMARY KEY (id)
);

CREATE TABLE QUARTIER (
  id SERIAL unique not null,
  id_quartier INT,
  nom_quartier VARCHAR(42),
  type_quartier VARCHAR(42),
  nom_ville VARCHAR(42),
  PRIMARY KEY (id)
);

CREATE TABLE RESEAU_PRO (
  id_reseau SERIAL unique not null,
  type_pro VARCHAR(42),
  nom VARCHAR(42),
  contact VARCHAR(42),
  PRIMARY KEY (id_reseau)
);

CREATE TABLE ACTIVITE (
  id_activite SERIAL unique not null,
  type_activite VARCHAR(42),
  nom VARCHAR(42),
  PRIMARY KEY (id_activite)
);

CREATE TABLE RESSOURCE (
  id INT,
  type_ressource VARCHAR(42),
  nom VARCHAR(42),
  montant REAL,
  PRIMARY KEY (id)
);

CREATE TABLE COUVERTURE_MEDICALE (
  id SERIAL UNIQUE NOT NULL,
  date_debut_validité TIMESTAMP,
  date_mise_en_place TIMESTAMP,
  date_renouvellement TIMESTAMP,
  date_fin_validite TIMESTAMP,
  type_couverture VARCHAR(42),
  complementaire VARCHAR(42),
  PRIMARY KEY (id)
);

CREATE TABLE SITUATION_FISCALE (
  id INT,
  date_mise_en_place TIMESTAMP,
  type_situation_fiscale TIMESTAMP,
  a_jour BOOL,
  PRIMARY KEY (id)
);

CREATE TABLE CARTE_SEJOUR (
  id_carte SERIAL unique not null,
  type_carte VARCHAR(42),
  nom VARCHAR(42),
  PRIMARY KEY (id_carte)
);

CREATE TABLE ETAT_DEMARCHE (
  id INT,
  id_carte INT,
  id_demarche INT,
  etat VARCHAR(42),
  date TIMESTAMP,
  PRIMARY KEY (id, id_carte)
);

CREATE TABLE DEPENSE_LOGEMENT (
  id INT,
  type_depense VARCHAR(42),
  montant REAL,
  PRIMARY KEY (id)
);

CREATE TABLE UTILISATEUR (
  id SERIAL UNIQUE NOT NULL,
  pseudo VARCHAR(42),
  date_naissance TIMESTAMP,
  sexe bool,
  telephone VARCHAR(42),
  email VARCHAR(42),
  adresse VARCHAR(42),
  adherent BOOL,
  date_entree_en_france TIMESTAMP,
  type_logement VARCHAR(42),
  surface_logement INT,
  type_ressource VARCHAR(42),
  id_nationalite int,
  id_situation int,
  id_quartier int,
  id_statut int,
  id_conjoint int,
  FOREIGN KEY (id_nationalite) references NATIONALITE(id),
  FOREIGN KEY (id_situation) references SITUATION_FAMILIALE(id),
  FOREIGN KEY (id_quartier) references QUARTIER(id),
  FOREIGN KEY (id_statut) references STATUT(id),
  FOREIGN KEY (id_conjoint) references UTILISATEUR(id),
  PRIMARY KEY (id)
);

CREATE TABLE A_PARENT (
  id_utilisateur int,
  id_parent int,
  FOREIGN KEY (id_utilisateur) references UTILISATEUR(id),
  FOREIGN KEY (id_parent) references UTILISATEUR(id),
  PRIMARY KEY (id_utilisateur, id_parent) 
);

ALTER TABLE EST_SUIVI_PAR ADD FOREIGN KEY (id_reseau) REFERENCES RESEAU_PRO (id_reseau);
ALTER TABLE EST_SUIVI_PAR ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE FREQUENTATION ADD FOREIGN KEY (id_activite) REFERENCES ACTIVITE (id_activite);
ALTER TABLE FREQUENTATION ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE EST_INSCRIT_DANS ADD FOREIGN KEY (id_activite) REFERENCES ACTIVITE (id_activite);
ALTER TABLE EST_INSCRIT_DANS ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE STATUT ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE NATIONALITE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE SITUATION_FAMILIALE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE QUARTIER ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE RESSOURCE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE COUVERTURE_MEDICALE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE SITUATION_FISCALE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE ETAT_DEMARCHE ADD FOREIGN KEY (id_carte) REFERENCES CARTE_SEJOUR (id_carte);
ALTER TABLE ETAT_DEMARCHE ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);
ALTER TABLE DEPENSE_LOGEMENT ADD FOREIGN KEY (id) REFERENCES UTILISATEUR (id);

