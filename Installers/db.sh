#!/bin/bash

db_name=$1

sudo -u postgres psql -d $db_name -c ""

