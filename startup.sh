python3 -m venv ./venv
source venv/bin/activate
python3 -m pip install -r requirements.txt
chmod u+x manage.py
chmod u+x startup.sh
chmod u+x run.sh
python3 ./manage.py makemigrations  
python3 ./manage.py migrate
python3 ./manage.py loaddata data.json