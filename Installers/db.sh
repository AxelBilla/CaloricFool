#!/bin/bash
origin="$(realpath $0)"
db_name=$1

sudo -u postgres psql -d $db_name -c ""

sudo rm -- $origin
