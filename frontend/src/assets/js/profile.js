import axios from "./auth-interceptor.js";
import { endpointUsers } from "./main.js";
import logout from "./logout.js";

// Simulación de SPA básica
const viewContainer = document.getElementById("view-container");

// Vistas disponibles
const views = {
    perfil: async () => {
        try {
            // Obtener perfil del usuario autenticado usando el token JWT
            const userData = JSON.parse(localStorage.getItem("user"));
            if (!userData || !userData.access_token) {
                throw new Error("Usuario no autenticado");
            }
            
            const response = await axios.get(`${endpointUsers}/me/profile`);
            const userProfile = response.data;
            
            return `
                <h4>Tu Perfil</h4>
                <div class="profile-info">
                    <p><strong>Nombre:</strong> ${userProfile.full_name}</p>
                    <p><strong>Email:</strong> ${userProfile.email}</p>
                    <p><strong>Teléfono:</strong> ${userProfile.phone}</p>
                    <p><strong>Dirección:</strong> ${userProfile.user_address || 'No especificada'}</p>
                    <p><strong>Rol:</strong> ${getRoleName(userProfile.id_rol)}</p>
                </div>
            `;
        } catch (error) {
            console.error("Error obteniendo perfil:", error);
            return "<h4>Error</h4><p>No se pudo cargar el perfil. Intenta nuevamente.</p>";
        }
    },
    pedidos: "<h4>Tus Pedidos</h4><p>Aquí aparecerán los pedidos realizados por el usuario.</p>",
    ayuda: "<h4>Centro de Ayuda</h4><p>Encuentra respuestas a las preguntas más frecuentes.</p>",
    metodo: "<h4>Método de Pago</h4><p>Administra tus tarjetas y métodos de pago registrados.</p>",
    logout: "<h4>Sesión cerrada</h4><p>Has cerrado sesión exitosamente.</p>"
};

// Función para obtener nombre del rol
function getRoleName(roleId) {
    const roles = {
        1: "Cliente",
        2: "Vendedor", 
        3: "Administrador"
    };
    return roles[roleId] || "Desconocido";
}

// Cargar perfil por defecto al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    viewContainer.innerHTML = await views.perfil();
});

// Manejo de clicks en los botones
document.querySelectorAll(".menu button").forEach(btn => {
    btn.addEventListener("click", async () => {
        const view = btn.getAttribute("data-view");
        if (view && views[view]) {
            if (typeof views[view] === 'function') {
                viewContainer.innerHTML = await views[view]();
            } else {
                viewContainer.innerHTML = views[view];
            }
        }

        if (view === "logout") {
            logout();
        }
    });
});
