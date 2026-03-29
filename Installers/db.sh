#!/bin/bash
origin="$(realpath $0)"
db_name=$1

sudo -u postgres psql -d $db_name -c "CREATE TABLE activities (
    entryid integer PRIMARY KEY,
    duration double precision,
    burnrate double precision,
    comment character varying(150),
    timeof timestamp without time zone,
    userid integer NOT NULL
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE activities OWNER TO $db_name"

sudo -u postgres psql -d $db_name -c "CREATE TABLE consumptions (
    entryid integer PRIMARY KEY,
    gram double precision,
    kcal double precision,
    comment character varying(150),
    timeof timestamp without time zone,
    userid integer NOT NULL
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE consumptions OWNER TO $db_name"

sudo -u postgres psql -d $db_name -c "CREATE TABLE informations (
    informationid integer PRIMARY KEY,
    bodytype integer,
    age integer,
    weight double precision,
    height double precision,
    updatedate timestamp without time zone,
    userid integer NOT NULL
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE informations OWNER TO $db_name"

sudo -u postgres psql -d $db_name -c "CREATE TABLE settings (
    settingid integer PRIMARY KEY,
    unit integer,
    theme integer
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE settings OWNER TO $db_name"

sudo -u postgres psql -d $db_name -c "CREATE TABLE tokens (
    tokenid character varying(50) PRIMARY KEY,
    creationdate timestamp without time zone,
    expiration_date timestamp without time zone,
    userid integer NOT NULL
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE tokens OWNER TO $db_name"

sudo -u postgres psql -d $db_name -c "CREATE TABLE users (
    userid integer PRIMARY KEY,
    nickname character varying(50),
    email character varying(100),
    password character varying(250),
    settingid integer NOT NULL
);"
sudo -u postgres psql -d $db_name -c "ALTER TABLE users OWNER TO $db_name"




sudo -u postgres psql -d $db_name -c "ALTER TABLE ONLY activities
    ADD CONSTRAINT activities_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);"
    
sudo -u postgres psql -d $db_name -c "ALTER TABLE ONLY consumptions
    ADD CONSTRAINT consumptions_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);"
    
sudo -u postgres psql -d $db_name -c "ALTER TABLE ONLY informations
    ADD CONSTRAINT informations_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);"
    
sudo -u postgres psql -d $db_name -c "ALTER TABLE ONLY tokens
    ADD CONSTRAINT tokens_userid_fkey FOREIGN KEY (userid) REFERENCES users(userid);"
    
sudo -u postgres psql -d $db_name -c "
ALTER TABLE ONLY users
    ADD CONSTRAINT users_settingid_fkey FOREIGN KEY (settingid) REFERENCES settings(settingid);"

sudo rm -- $origin
