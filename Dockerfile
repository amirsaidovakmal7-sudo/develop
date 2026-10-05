FROM python:3.14-slim

WORKDIR /myproject

COPY requirements.txt ./project
RUN pip install -r requirements.txt

COPY . .

ENV SITE_DB_PATH=/myproject/project/db.sqlite3
RUN mkdir -p /myproject/project/app/static/media

EXPOSE 8000

CMD ["python", "project/manage.py", "runserver", "0.0.0.0:8000"]
