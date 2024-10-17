// Importa axios
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/'; // Cambia esto si es necesario

// Función para obtener todos los usuarios
export const obtenerUsuarios = async () => {
    try {
        const response = await axios.get(`${API_URL}users/`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario
export const crearUsuario = async (usuario) => {
    try {
        const response = await axios.post(`${API_URL}users/`, usuario);
        return response.data;
    } catch (error) {
        console.error('Error al crear usuario:', error);
        throw error;
    }
};

// Puedes agregar funciones similares para Vehiculo, Alerta, HistorialAlerta, Via...
