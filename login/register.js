document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById('register-form');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const telefono = document.getElementById('telefono'); 
    const password = document.getElementById('password');

    const registerUser = async (event) => {
        event.preventDefault();
        const nombre = username.value; 
        const correo = email.value;
        const telefonoValue = telefono.value; 
        const contraseña = password.value;

        const userData = {
            nombre: nombre,
            correo: correo,
            numero_telefono: telefonoValue,
            contraseña: contraseña
        };

        try {
            const response = await fetch('http://localhost:8000/api/users/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Error en el registro del usuario: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            console.log('Usuario registrado:', result);
            alert("Registro completado con éxito");
        } catch (error) {
            console.error('Error:', error);
            alert("Hubo un error en el registro.");
        }
    };

    formRegister.addEventListener('submit', registerUser);
});
