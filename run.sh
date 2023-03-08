#!/bin/bash

if [[ "$(uname)" == "Linux" ]]; then
    # Ubuntu
    ./manage.py makemigrations
    ./manage.py migrate
    ./manage.py loaddata data.json
    ./manage.py runserver
elif [[ "$(uname)" == "Darwin" ]]; then
    # Mac OS
    python3 ./manage.py makemigrations  
    python3 ./manage.py migrate
    python3 ./manage.py loaddata data.json
    python3 ./manage.py runserver
else 
    echo "OS not supported"
    exit 1
fi