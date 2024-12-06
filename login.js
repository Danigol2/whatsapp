const formularioLogin = document.getElementById('formularioLogin');
const mensajeError = document.getElementById('mensajeError');

formularioLogin.addEventListener('submit', function(evento) {
    evento.preventDefault(); 

    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    const opciones = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'insomnia/10.1.0',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ocXlnbGFudmF1bmJ4Ym1rdm9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NzMwMzAsImV4cCI6MjA0NzE0OTAzMH0.qn15UZVxNbxfJrMo8t2TZ8owipTI__eq8KYqXydB0jQ'
        },
        body: JSON.stringify({
            email: correo,
            password: contrasena
        })
    };

    fetch('https://mhqyglanvaunbxbmkvof.supabase.co/auth/v1/token?grant_type=password', opciones)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.access_token) {
                sessionStorage.setItem('userId', datos.user.id);
                console.log(sessionStorage.getItem('userId'));
                sessionStorage.setItem('token', datos.access_token);
                window.location.href = 'main.html';
            } else {
                mensajeError.style.display = 'block';
                mensajeError.textContent = 'Correo o contraseña incorrectos.';
            }
        })
        .catch(error => {
            console.error(error);
            mensajeError.style.display = 'block';
            mensajeError.textContent = 'Ocurrió un error al iniciar sesión.';
        });
});