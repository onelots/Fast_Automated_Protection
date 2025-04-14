from fastapi import FastAPI
import docker
from starlette.responses import JSONResponse
import utils
from pydantic import BaseModel

class ClientRequest(BaseModel):
    username: str
    email: str
    password: str

app = FastAPI()
docker_client = docker.from_env()

@app.post("/create_new_client")
def create_new_client(request: ClientRequest):
    username = request.username.lower()
    email = request.email.lower()
    password_hash = request.password
    print(f"Hash reçu (type {type(request.password)}): {request.password}")
    utils.export_infos(username, email, password_hash)
    status = utils.create_compose(username)
    if status["status"] == "success":
        return JSONResponse(
        content={"status": "success", "message": f"Client {username} créé avec succès."},
        status_code=200
        )
    else:
        return JSONResponse(
        content={"status": "error", "message": f"Erreur lors de la création du client : {status['message']}"},
        status_code=500
        )
