CREATE TABLE postal_city (
  id           BIGINT PRIMARY KEY,
  postal_code  VARCHAR NOT NULL,
  city         VARCHAR NOT NULL
);

CREATE SEQUENCE postal_city_seq START WITH 1000;

create INDEX postal_city_idx1 on postal_city(postal_code varchar_pattern_ops);
create INDEX postal_city_idx2 on postal_city(upper(city) varchar_pattern_ops);