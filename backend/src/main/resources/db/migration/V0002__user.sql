create table GUSER (
  ID BIGINT PRIMARY KEY,
  login VARCHAR UNIQUE,
  password VARCHAR
);

create sequence GUSER_SEQ start with 1000;
