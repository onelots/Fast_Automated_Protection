FROM python:3.12
COPY . /app
WORKDIR /app
COPY requirements.txt /app
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install -y ca-certificates curl && install -m 0755 -d /etc/apt/keyrings && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc && chmod a+r /etc/apt/keyrings/docker.asc && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null && apt-get update

# Installer Docker CLI + Compose plugin
RUN apt-get update && apt-get install -y \
    docker-ce-cli \
    containerd.io \
    docker-compose-plugin \
    && apt-get clean

CMD ["uvicorn", "main:app", "--host", "192.168.100.4", "--port", "8000", "--reload"]
EXPOSE 8000
