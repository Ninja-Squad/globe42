create table GUSER (
  ID BIGINT PRIMARY KEY,
  login VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL
);

create sequence GUSER_SEQ start with 1000;
