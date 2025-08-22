const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    // Si hay usuario logueado → redirige al dashboard
    window.location.href = "/src/views/dashboard.html";
} else {
    console.log("Usuario autenticado:", user);
}
