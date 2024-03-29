FROM python:3.11

ENV PYTHONUNBUFFERED=1

WORKDIR /code

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 80

CMD ["python3","mysite/manage.py","runserver","172.20.96.1:80"]