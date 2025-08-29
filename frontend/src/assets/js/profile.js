// Simulación de SPA básica
const viewContainer = document.getElementById("view-container");

// Vistas disponibles
const views = {
    pedidos: "<h4>Tus Pedidos</h4><p>Aquí aparecerán los pedidos realizados por el usuario.</p>",
    ayuda: "<h4>Centro de Ayuda</h4><p>Encuentra respuestas a las preguntas más frecuentes.</p>",
    metodo: "<h4>Método de Pago</h4><p>Administra tus tarjetas y métodos de pago registrados.</p>",
    logout: "<h4>Sesión cerrada</h4><p>Has cerrado sesión exitosamente.</p>"
};

// Manejo de clicks en los botones
document.querySelectorAll(".menu button").forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        if (view && views[view]) {
            viewContainer.innerHTML = views[view];
        }

        if (view === "logout") {
            // aquí podrías redirigir al login real
            console.log("Sesión cerrada.");
        }
    });
});

// LogOut function 
const $btnLogout = document.getElementById("logout-btn");

if ($btnLogout) {
    $btnLogout.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./auth.html";
    });
}