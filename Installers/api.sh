#!/bin/bash

db_name=$1
db_password=$1

sudo apt install git && sudo apt install npm && sudo apt install nodejs
sudo git clone https://github.com/AxelBilla/CaloricFool.git
cd CaloricFool
sudo npm install
cd models/db/
mkdir .env
cd .env
printf "{\"name\": \"$db_name\", \"password\": \"$db_password\"}" >> db.env.json

