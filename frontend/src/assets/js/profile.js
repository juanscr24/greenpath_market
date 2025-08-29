// Simulación de SPA básica
const viewContainer = document.getElementById("view-container");
const settingsSection = document.getElementById("settings-section");

// Vistas disponibles (sin el bloque de configuración, solo contenido dinámico)
const views = {
    pedidos: `
    <h4>Tus Pedidos</h4>
    <div class="orders-container">
        <div class="order-card">
            <h5>Arroz Orgánico</h5>
            <p><strong>Cantidad:</strong> 2 sacos</p>
            <p><strong>Precio:</strong> $80.000</p>
            <p><strong>Entregado el:</strong> 15 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Café Campesino</h5>
            <p><strong>Cantidad:</strong> 1 libra</p>
            <p><strong>Precio:</strong> $25.000</p>
            <p><strong>Entregado el:</strong> 16 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Miel de Abeja</h5>
            <p><strong>Cantidad:</strong> 3 frascos</p>
            <p><strong>Precio:</strong> $60.000</p>
            <p><strong>Entregado el:</strong> 18 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Plátano Verde</h5>
            <p><strong>Cantidad:</strong> 20 unidades</p>
            <p><strong>Precio:</strong> $35.000</p>
            <p><strong>Entregado el:</strong> 19 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Frijol Cargamanto</h5>
            <p><strong>Cantidad:</strong> 5 kilos</p>
            <p><strong>Precio:</strong> $90.000</p>
            <p><strong>Entregado el:</strong> 20 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Queso Campesino</h5>
            <p><strong>Cantidad:</strong> 2 bloques</p>
            <p><strong>Precio:</strong> $50.000</p>
            <p><strong>Entregado el:</strong> 21 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Leche Fresca</h5>
            <p><strong>Cantidad:</strong> 10 litros</p>
            <p><strong>Precio:</strong> $45.000</p>
            <p><strong>Entregado el:</strong> 22 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Mazorca Dulce</h5>
            <p><strong>Cantidad:</strong> 12 unidades</p>
            <p><strong>Precio:</strong> $20.000</p>
            <p><strong>Entregado el:</strong> 23 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Aguacate Hass</h5>
            <p><strong>Cantidad:</strong> 8 unidades</p>
            <p><strong>Precio:</strong> $32.000</p>
            <p><strong>Entregado el:</strong> 24 de Septiembre 2025</p>
        </div>
        <div class="order-card">
            <h5>Papa Criolla</h5>
            <p><strong>Cantidad:</strong> 5 kilos</p>
            <p><strong>Precio:</strong> $28.000</p>
            <p><strong>Entregado el:</strong> 25 de Septiembre 2025</p>
        </div>
    </div>`,

    ayuda: `
    <h4>Centro de Ayuda</h4>
    <p>¿Necesitas soporte? Contáctanos por cualquiera de nuestras redes sociales:</p>
    <div class="help-links">
        <a href="mailto:recursos.humanos@greenpath.com" target="_blank" class="help-item">
            <img src="https://img.icons8.com/?size=100&id=P7UIlhbpWzZm&format=png&color=000000" alt="Gmail">
            <span>Gmail</span>
        </a>
        <a href="https://wa.me/573001112233" target="_blank" class="help-item">
            <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" alt="WhatsApp">
            <span>WhatsApp</span>
        </a>
        <a href="https://instagram.com/tuusuario" target="_blank" class="help-item">
            <img src="https://img.icons8.com/?size=100&id=Xy10Jcu1L2Su&format=png&color=000000" alt="Instagram">
            <span>Instagram</span>
        </a>
        <a href="https://t.me/tuusuario" target="_blank" class="help-item">
            <img src="https://img.icons8.com/?size=100&id=63306&format=png&color=000000" alt="Telegram">
            <span>Telegram</span>
        </a>
    </div>`,
    metodo: `
    <h4>Método de Pago</h4>
    <div class="payment-methods">
        <div class="payment-card">
            <img src="../assets/img/pasarelas-pago/visa-logo.png" alt="Visa">
        </div>
        <div class="payment-card">
            <img src="../assets/img/pasarelas-pago/mastercard.png" alt="MasterCard">
        </div>
        <div class="payment-card">
            <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal">
        </div>
        <div class="payment-card">
            <img src="../assets/img/pasarelas-pago/american-express.png" alt="American Express">
        </div>
        <div class="payment-card">
            <img src="../assets/img/pasarelas-pago/nequi.png" alt="Nequi">
        </div>
    </div>`,
    logout: "<h4>Sesión cerrada</h4><p>Has cerrado sesión exitosamente.</p>"
};

// Manejo de clicks en los botones
document.querySelectorAll(".menu button").forEach(btn => {
    btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");

        if (view && views[view]) {
            // Si es pedidos → mostramos configuración + vista
            if (view === "pedidos") {
                settingsSection.style.display = "block";
                viewContainer.innerHTML = views[view];
            } 
            // Si es ayuda o método → ocultamos configuración
            else if (view === "ayuda" || view === "metodo") {
                settingsSection.style.display = "none";
                viewContainer.innerHTML = views[view];
            } 
            // Logout
            else if (view === "logout") {
                settingsSection.style.display = "none";
                viewContainer.innerHTML = views[view];
                console.log("Sesión cerrada.");
            }
        }
    });
});

// LogOut function (no se toca)
const $btnLogout = document.getElementById("logout-btn");

if ($btnLogout) {
    $btnLogout.addEventListener("click", () => {
        localStorage.removeItem("user");
        window.location.href = "./auth.html";
    });
}