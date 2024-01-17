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
  active BOOLEAN NOT NULL,
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
INSERT INTO roles (roleid, rolename, data) VALUES
(
  31,
  'Unauthenticated',
  '{}'
),
(
  63,
  'Consumer',
  '{}'
),
(
  127,
  'Creator',
  '{}'
),
(
  255,
  'Administrator',
  '{}'
)
;
INSERT INTO users (username, joindate, roleid, data) VALUES
(
  'paipo',
  NOW(),
  255,
  '{"Country": "US"}'
)
;
INSERT INTO pass (userid, locker) VALUES
(
  1,
  crypt('gnidraob', gen_salt('bf'))
)
;
