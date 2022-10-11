FROM python:3.10.1

RUN pip3 install django

WORKDIR /usr/src/app
COPY . .

RUN pip install -r requirements.txt

CMD ["python", "manage.py", "runserver", "0.0.0.0:5000"]

EXPOSE 5000