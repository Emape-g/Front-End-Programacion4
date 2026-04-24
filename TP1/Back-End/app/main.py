from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos los routers 
from routers import auth, usuarios

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 
app.include_router(auth.router)
app.include_router(usuarios.router)

@app.get("/")
def inicio():
    return {"mensaje": "Servidor funcionando"}