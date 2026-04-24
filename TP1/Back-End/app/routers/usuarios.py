from fastapi import APIRouter
from database import mydb

router = APIRouter()

@router.get("/lista")
def obtener_lista(action: str, usuario: str = None):
    
    if action != "BUSCAR":
        return {"respuesta": "ERROR", "mje": "Acción no válida"}

    cursor = mydb.cursor(dictionary=True) 

    if usuario:
        # Búsqueda con LIKE
        sql = "SELECT id, usuario, bloqueado, apellido, nombre FROM usuarios_utn WHERE usuario LIKE %s"
        cursor.execute(sql, (f"%{usuario}%",))
    else:
        # Traer todos
        sql = "SELECT id, usuario, bloqueado, apellido, nombre FROM usuarios_utn"
        cursor.execute(sql)

    resultados = cursor.fetchall()
    return resultados

@router.get("/bloquear")
def cambiar_estado(idUser: int, estado: str):
    # Validamos que el estado sea correcto por seguridad
    if estado not in ["Y", "N"]:
        return {"respuesta": "ERROR", "mje": "Estado inválido"}

    try:
        cursor = mydb.cursor()
        
        # Actualizamos el campo 'bloqueado' en la base de datos
        sql = "UPDATE usuarios_utn SET bloqueado = %s WHERE id = %s"
        cursor.execute(sql, (estado, idUser))
        
        
        #  commit() para que los cambios se guarden en MySQL.
        mydb.commit() 
        
        # Mensaje personalizado según la acción
        mensaje = "Bloqueo Exitoso" if estado == "Y" else "Desbloqueo Exitoso"
        return {"respuesta": "OK", "mje": mensaje}
        
    except Exception as e:
        #  capturar la excepción y devolverla en el JSON
        return {"respuesta": "ERROR", "mje": str(e)}