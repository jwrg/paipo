CREATE USER paipo WITH PASSWORD 'boardbackwards';
CREATE DATABASE paipodb OWNER paipo;
\c paipodb;
CREATE TABLE json (
  id SERIAL PRIMARY KEY,
  date TIMESTAMP,
  data JSONB
);
GRANT ALL PRIVILEGES ON json TO paipo;
GRANT USAGE, SELECT ON SEQUENCE json_id_seq TO paipo;
