create user kcats with password 'stackbackwards';
create database kcatsdb owner kcats;
\c kcatsdb;
create table json (id integer not null,date timestamp,data jsonb,primary key (id) );
grant all privileges on json to kcats;
