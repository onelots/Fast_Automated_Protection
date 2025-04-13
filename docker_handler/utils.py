import subprocess
import os

def create_compose(name):
    try:
        if not os.path.exists("clients"):
            os.makedirs("clients")
        if not os.path.exists(f"clients/{name}"):
            os.makedirs(f"clients/{name}")

        copy_base_folder("backend_client/*", f"clients/{name}")

        compose_path = f"clients/{name}/docker-compose.yml"
        variables = (name)
        with open(compose_path, "w") as f:
            f.write(
f"""
version: '3.8'

services:
  database_user_{variables[0]}:
    build:
      dockerfile: Dockerfile
    container_name: postgres_database_{variables[0]}
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    networks:
      clients_network:
    volumes:
      - postgres_data_{variables[0]}:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: always

  backend_user:
    build:
      dockerfile: Dockerfile
    container_name: panel_client_{variables[0]}
    environment:
      PYTHONUNBUFFERED: 1
    networks:
      clients_network:
    ports:
      - "8001:8000"
    depends_on:
      - database_user_{variables[0]}
    restart: always""")


        subprocess.run(
            ["docker-compose", "-f", compose_path, "up", "-d"],
            check=True,
            capture_output=True
        )

        return {"status": "success", "message": "Containers démarrés"}

    except subprocess.CalledProcessError as e:
        return {"status": "error", "message": f"Erreur lors du démarrage de Docker : {e.stderr.decode()}"}


def copy_base_folder(src, destination):
    os.makedirs(destination, exist_ok=True)

    for item in os.listdir(src):
        src_path = os.path.join(src, item)
        dst_path = os.path.join(destination, item)

        if os.path.isdir(src_path):
            copy_base_folder(src_path, dst_path)
        else:
            with open(src_path, 'rb') as f_src, open(dst_path, 'wb') as f_dst:
                f_dst.write(f_src.read())