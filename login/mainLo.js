document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('login-form');
    const loginUser = async (event) => {
        event.preventDefault();
        const loginEmailElement = document.getElementById('login-email');
        const loginPasswordElement = document.getElementById('login-password');

        if (!loginEmailElement || !loginPasswordElement) {
            console.error("Los elementos de inicio de sesión no se encontraron en el DOM.");
            return;
        }

        const loginEmail = loginEmailElement.value;
        const loginPassword = loginPasswordElement.value;

        const loginData = {
            correo: loginEmail,       // Cambiado a 'correo'
            contraseña: loginPassword  // Cambiado a 'contraseña'
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || 'Error en el inicio de sesión'}`);
                throw new Error(`Error en el inicio de sesión: ${JSON.stringify(errorData)}`);
            }

            const result = await response.json();
            console.log('Inicio de sesión exitoso:', result);
            alert("Inicio de sesión completado con éxito");
            localStorage.setItem('access_token', result.access);
            window.location.href = "profile.html";

        } catch (error) {
            console.error('Error:', error);
            alert("Hubo un error en el inicio de sesión.");
        }
    };

    formLogin.addEventListener('submit', loginUser);
});