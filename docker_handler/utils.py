import subprocess
import os

def create_compose(name):
    try:
        copy_base_folder("/backend_client/", f"clients/{name}")
        compose_path = f"clients/{name}/docker-compose.yml"
        with open(compose_path, "w") as f:
            f.write(
f"""
services:
  database_user_{name}:
    build:
      context: database
      dockerfile: Dockerfile
    container_name: postgres_database_{name}
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    networks:
      clients_network:
    volumes:
      - postgres_data_{name}:/var/lib/postgresql/data
    restart: always

  backend_user:
    build:
      context: panel
      dockerfile: Dockerfile
    container_name: panel_client_{name}
    environment:
      PYTHONUNBUFFERED: 1
    networks:
      clients_network:
    depends_on:
      - database_user_{name}
    restart: always

volumes:
  postgres_data_{name}:
    name: postgres_data_{name} 

networks:
  clients_network:
    external: true
    name: fast_automated_protection_clients_network""")


        subprocess.run(
            ["docker", "compose", "-f", compose_path, "up", "--build", "-d"],
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


def export_infos(username, email, password):
    try:
        check_client_folder(username)
        info_file = f"clients/{username}/infos.txt"
        with open(info_file, 'a') as f:
            f.write(username + "\n")
            f.write(email + "\n")
            f.write(password + "\n")

    except Exception as e:
        print(f"Erreur lors de l'écriture du pseudo : {e}")


def check_client_folder(name):
    if not os.path.exists("clients"):
        os.makedirs("clients")
    if not os.path.exists(f"clients/{name}"):
        os.makedirs(f"clients/{name}")