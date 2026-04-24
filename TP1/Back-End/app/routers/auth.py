from fastapi import APIRouter
from database import mydb # Importamos tu conexión a la BD

# Creamos el router
router = APIRouter()

@router.get("/login")
def login(usuario: str, clave: str):
    cursor = mydb.cursor()
    
    # Preparamos la consulta segura
    sql = "SELECT * FROM usuarios_utn WHERE usuario = %s AND clave = %s"
    cursor.execute(sql, (usuario, clave))
    
    # Traemos el resultado
    resultado = cursor.fetchone()
    
    if resultado:
        return {"respuesta": "OK", "mje": f"Ingreso Valido. Usuario {usuario}"}
    else:
        return {"respuesta": "ERROR", "mje": "Ingreso Invalido, usuario y/o clave incorrecta"}