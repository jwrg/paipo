CREATE USER kcats WITH PASSWORD 'stackbackwards';
CREATE DATABASE kcatsdb OWNER kcats;
\c kcatsdb;
CREATE TABLE json (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP,
  data JSONB
);
GRANT ALL PRIVILEGES ON json TO kcats;
GRANT USAGE, SELECT ON SEQUENCE json_id_seq TO kcats;
