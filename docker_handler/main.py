from fastapi import FastAPI, requests
import docker
import utils

app = FastAPI()
docker_client = docker.from_env()  # Initialise le client Docker

@app.post("/create_new_client")
def create_new_client(username):
    status = utils.create_compose(username)
    if status["status"] == "success":
        return {"status": "success", "message": f"Client {username} créé avec succès."}
    else:
        return {"status": "error", "message": f"Erreur lors de la création du client : {status['message']}"}
