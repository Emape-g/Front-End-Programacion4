// Cuando cargue la página, traemos todos los usuarios
document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();

    // Le damos vida al botón de buscar
    document.getElementById("btnBuscar").addEventListener("click", () => {
        const textoBusqueda = document.getElementById("buscarUsuario").value;
        cargarUsuarios(textoBusqueda);
    });
});

function cargarUsuarios(filtro = "") {
    // Apuntamos a tu FastAPI
    let url = `http://localhost:8000/lista?action=BUSCAR`;
    if (filtro !== "") {
        url += `&usuario=${filtro}`;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("cuerpoTabla");
            tbody.innerHTML = ""; // Limpiamos la tabla por si había datos viejos

            // Si la base de datos está vacía o la búsqueda no dio resultados
            if (data.length === 0) {
                tbody.innerHTML = "<tr><td colspan='7'>No se encontraron resultados.</td></tr>";
                return;
            }

            // Recorremos el JSON que nos mandó Python y creamos las filas
            data.forEach(user => {
                const tr = document.createElement("tr");
                
                // Aplicamos las clases CSS para los colores según el estado
                if (user.bloqueado === "Y") {
                    tr.classList.add("fila-bloqueada");
                } else {
                    tr.classList.add("fila-activa");
                }

                // Armamos las columnas con los datos y los botones
                tr.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.usuario}</td>
                    <td>${user.bloqueado}</td>
                    <td>${user.apellido}</td>
                    <td>${user.nombre}</td>
                    <td><button onclick="cambiarEstado(${user.id}, 'Y')">Bloquear</button></td>
                    <td><button onclick="cambiarEstado(${user.id}, 'N')">Desbloquear</button></td>
                `;
                
                tbody.appendChild(tr);
            });
        })
        .catch(error => console.error("Error al cargar la grilla:", error));
}

function cambiarEstado(id, estado) {
    // Llamamos a la ruta de bloquear/desbloquear que armamos en FastAPI
    const url = `http://localhost:8000/bloquear?idUser=${id}&estado=${estado}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.respuesta === "OK") {
                alert(data.mje);
                
                // Refrescamos la tabla para que se actualice el color
                const textoBusqueda = document.getElementById("buscarUsuario").value;
                cargarUsuarios(textoBusqueda);
            } else {
                alert("Error: " + data.mje);
            }
        })
        .catch(error => {
            console.error("Error al intentar cambiar el estado:", error);
            alert("Error de conexión con el servidor.");
        });
}
