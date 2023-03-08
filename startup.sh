#!/bin/bash
# This script is used to start the application

if [[ "$(uname)" == "Linux" ]]; then
    # Ubuntu
    sudo apt update
    sudo apt install -y python3-pip python3
    sudo pip3 install virtualenv
elif [[ "$(uname)" == "Darwin" ]]; then
    # Mac OS
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    brew install python3
    pip3 install virtualenv
else 
    echo "OS not supported"
    exit 1
fi

sudo virtualenv venv
source venv/bin/activate
sudo pip3 install -r requirements.txt

chmod u+x manage.py
chmod u+x startup.sh