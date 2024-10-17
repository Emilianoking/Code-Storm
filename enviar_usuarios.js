// No importa axios, ya que lo usaremos directamente del objeto global
const API_URL = 'http://127.0.0.1:8000/api/'; // Cambia esto si es necesario

// Función para obtener todos los usuarios
export const obtenerUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}users/`); // Axios está disponible globalmente
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario
export const crearUsuario = async (usuario) => {
    try {
        const response = await axios.post(`${API_URL}users/`, usuario); // Axios está disponible globalmente
        return response.data;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Función para mostrar usuarios
async function mostrarUsuarios() {
    const tablaUsuarios = document.getElementById('tabla-usuarios').querySelector('tbody'); // Selecciona el tbody
    try {
        const usuarios = await obtenerUsuarios();
        console.log('Usuarios obtenidos:', usuarios); // Verifica la respuesta

        // Limpia la tabla antes de agregar nuevos usuarios
        tablaUsuarios.innerHTML = ''; 

        // Agrega cada usuario a la tabla
        usuarios.forEach(usuario => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.correo}</td>
                <td>${usuario.numero_telefono}</td>
            `;
            tablaUsuarios.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al mostrar usuarios:', error);
    }
}

// Función para registrar un nuevo usuario
async function registrarUsuario() {
    const nuevoUsuario = {
        nombre: 'Juan Pérez',
        correo: 'juan.perez@example.com',
        numero_telefono: '123456789',
        contraseña: 'securepassword',
    };

    try {
        const usuarioCreado = await crearUsuario(nuevoUsuario);
        console.log('Usuario creado:', usuarioCreado);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
    }
}

// Llama a esta función para mostrar usuarios
mostrarUsuarios();
