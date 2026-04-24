// Capturamos el formulario
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(event) {
    // Evitamos que la página se recargue al hacer click en el botón
    event.preventDefault();

    // Obtenemos los valores de los inputs
    const usuario = document.getElementById('usuario').value;
    const clave = document.getElementById('clave').value;

    // Armamos la URL apuntando a FastAPI (por defecto corre en el puerto 8000)
    // Usamos el método GET pasando los parámetros por la URL como pide el TP
    const url = `http://localhost:8000/login?usuario=${usuario}&clave=${clave}`;

    // Hacemos la petición al backend
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Respuesta del servidor:", data);

          
            if (data.respuesta === "OK") {
                alert(data.mje); 
                // Redireccionamos a la página de la grilla (que crearemos luego)
                window.location.href = "../listar/lista.html" 
            } else {
                // Si hay error, mostramos el mensaje por pantalla al usuario
                alert(data.mje);
            }
        })
        .catch(error => {
            console.error('Error al conectar con el backend:', error);
            alert("Error de conexión con el servidor.");
        });
});