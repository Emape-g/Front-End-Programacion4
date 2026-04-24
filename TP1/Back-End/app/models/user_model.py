from pydantic import BaseModel
class DBModel(BaseModel):
    id : int
    usuario: str
    clave :str
    apellido :str
    nombre : str
    bloqueado : str
    