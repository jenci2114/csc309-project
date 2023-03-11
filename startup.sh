python3 -m virtualenv venv
source venv/bin/activate
pip3 install -r requirements.txt
chmod u+x manage.py
chmod u+x startup.sh
chmod u+x run.sh
python3 ./manage.py makemigrations  
python3 ./manage.py migrate
python3 ./manage.py loaddata data.json