const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    // Si no hay usuario logueado → redirige al login
    window.location.href = "/src/views/login.html";
} else {
    console.log("Usuario autenticado:", user);
}
