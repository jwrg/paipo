CREATE USER paipo WITH PASSWORD 'boardbackwards';
CREATE DATABASE paipodb OWNER paipo;
\c paipodb;
CREATE EXTENSION pgcrypto;
CREATE TABLE roles (
  roleid SMALLINT PRIMARY KEY,
  rolename TEXT NOT NULL,
  data JSONB
);
CREATE TABLE users (
  userid BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  joindate TIMESTAMP NOT NULL,
  roleid SMALLINT REFERENCES roles (roleid),
  data JSONB
);
CREATE TABLE pass (
  userid BIGINT PRIMARY KEY REFERENCES users (userid),
  locker TEXT NOT NULL
);
CREATE TABLE json (
  id BIGSERIAL PRIMARY KEY,
  userid BIGINT REFERENCES users (userid),
  date TIMESTAMP NOT NULL,
  data JSONB
);
GRANT ALL PRIVILEGES ON json, users, pass, roles TO paipo;
GRANT USAGE, SELECT ON SEQUENCE json_id_seq, users_userid_seq TO paipo;
