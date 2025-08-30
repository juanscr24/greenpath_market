// Guardián global para verificar autenticación en todas las vistas
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de autenticación
    const currentPath = window.location.pathname;
    if (currentPath.includes('auth.html')) {
        return; // No aplicar guard en la página de auth
    }

    // Verificar si el usuario está autenticado
    const userData = localStorage.getItem("user");
    
    if (!userData) {
        // Usuario no autenticado, redirigir a auth.html
        console.log("Usuario no autenticado. Redirigiendo a página de autenticación...");
        
        // Usar ruta relativa para evitar problemas con la base URL
        const basePath = window.location.origin;
        window.location.href = `${basePath}/src/views/auth.html`;
        return;
    }

    try {
        const user = JSON.parse(userData);
        if (!user || !user.access_token) {
            // Token inválido o ausente
            console.log("Token de acceso inválido. Redirigiendo...");
            localStorage.removeItem("user");
            
            const basePath = window.location.origin;
            window.location.href = `${basePath}/src/views/auth.html`;
        }
    } catch (error) {
        console.error("Error al parsear datos de usuario:", error);
        localStorage.removeItem("user");
        
        const basePath = window.location.origin;
        window.location.href = `${basePath}/src/views/auth.html`;
    }
});

console.log("Guard global cargado - Verificando autenticación...");
