FROM python:3.11-slim

WORKDIR /app

COPY . .

RUN apt-get update && \
    apt-get install -y libglib2.0-0 libgl1 && \
    rm -rf /var/lib/apt/lists/*

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 10000

CMD ["uvicorn","main:app","--host","0.0.0.0","--port","10000"]