// Función para cerrar sesión y limpiar el token JWT
function logout() {
    localStorage.removeItem("user");
    window.location.href = "/src/views/auth.html";
}

// Agregar evento al botón de logout si existe
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

export default logout;
