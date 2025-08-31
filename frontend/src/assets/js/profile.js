// Simulación de SPA básica
const viewContainer = document.getElementById("view-container");
const settingsSection = document.getElementById("settings-section");

// Import axios for API calls
import axios from "axios";
import { endpointUsers } from "./main.js";

// Function to load user profile data
async function loadUserProfile() {
    try {
        console.log("Loading user profile...");
        const response = await axios.get(`${endpointUsers}/me/profile`);
        const user = response.data;

        console.log("API Response:", response);
        console.log("User data:", user);

        // Update profile name
        const profileName = document.getElementById("profile-name-display");
        if (profileName) {
            console.log("Updating profile name to:", user.full_name);
            profileName.textContent = user.full_name;
        }

        // Update email
        const userEmail = document.getElementById("user-email-display");
        if (userEmail) {
            console.log("Updating email to:", user.email);
            userEmail.innerHTML = `<strong>Correo:</strong> ${user.email}`;
        }

        // Update address
        const userAddress = document.getElementById("user-address-display");
        if (userAddress && user.user_address) {
            console.log("Updating address to:", user.user_address);
            userAddress.innerHTML = `<strong>Dirección:</strong> ${user.user_address}`;
        }

        // Update description with registration date
        const userDescription = document.getElementById("user-description-display");
        if (userDescription && user.created_at) {
            const createdDate = new Date(user.created_at).getFullYear();
            console.log("Updating description with year:", createdDate);
            userDescription.innerHTML = `<strong>Descripción:</strong> Usuario registrado desde ${createdDate}`;
        }

        console.log("User profile loaded successfully:", user);
    } catch (error) {
        console.error("Error loading user profile:", error);
        console.error("Error details:", error.response);
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem("user");
            window.location.href = "./auth.html";
        } else {
            alert("Error al cargar el perfil del usuario");
        }
    }
}

// Load user profile on page load
document.addEventListener("DOMContentLoaded", loadUserProfile);

// Store original values for cancel functionality
let originalValues = {};

// Function to enable editing for a field
function enableEditing(field) {
    let displayElement, inputElement, editBtn, saveBtn, cancelBtn;

    if (field === 'name') {
        displayElement = document.getElementById("profile-name-display");
        inputElement = document.getElementById("profile-name-input");
        editBtn = document.querySelector(`.edit-btn[data-field="${field}"]`);
        saveBtn = document.querySelector(`.save-btn[data-field="${field}"]`);
        cancelBtn = document.querySelector(`.cancel-btn[data-field="${field}"]`);
        originalValues[field] = displayElement.textContent;
    } else {
        displayElement = document.getElementById(`user-${field}-display`);
        inputElement = document.getElementById(`user-${field}-input`);
        editBtn = document.querySelector(`.edit-btn[data-field="${field}"]`);
        saveBtn = document.querySelector(`.save-btn[data-field="${field}"]`);
        cancelBtn = document.querySelector(`.cancel-btn[data-field="${field}"]`);

        // Store original value
        if (field === 'email') {
            originalValues[field] = displayElement.textContent.replace('<strong>Correo:</strong> ', '');
        } else if (field === 'address') {
            originalValues[field] = displayElement.textContent.replace('<strong>Dirección:</strong> ', '');
        } else if (field === 'description') {
            originalValues[field] = displayElement.textContent.replace('<strong>Descripción:</strong> ', '');
        }
    }

    // Hide display and edit button, show input and action buttons
    displayElement.style.display = 'none';
    editBtn.style.display = 'none';
    inputElement.style.display = 'inline-block';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';

    // Set input value
    inputElement.value = originalValues[field];
    inputElement.focus();
}

// Function to cancel editing for a field
function cancelEditing(field) {
    let displayElement, inputElement, editBtn, saveBtn, cancelBtn;

    if (field === 'name') {
        displayElement = document.getElementById("profile-name-display");
        inputElement = document.getElementById("profile-name-input");
        editBtn = document.querySelector(`.edit-btn[data-field="${field}"]`);
        saveBtn = document.querySelector(`.save-btn[data-field="${field}"]`);
        cancelBtn = document.querySelector(`.cancel-btn[data-field="${field}"]`);
    } else {
        displayElement = document.getElementById(`user-${field}-display`);
        inputElement = document.getElementById(`user-${field}-input`);
        editBtn = document.querySelector(`.edit-btn[data-field="${field}"]`);
        saveBtn = document.querySelector(`.save-btn[data-field="${field}"]`);
        cancelBtn = document.querySelector(`.cancel-btn[data-field="${field}"]`);
    }

    // Show display and edit button, hide input and action buttons
    displayElement.style.display = 'inline';
    editBtn.style.display = 'inline-block';
    inputElement.style.display = 'none';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Function to save changes for a field
async function saveChanges(field) {
    let inputElement, newValue;

    if (field === 'name') {
        inputElement = document.getElementById("profile-name-input");
        newValue = inputElement.value.trim();
    } else {
        inputElement = document.getElementById(`user-${field}-input`);
        newValue = inputElement.value.trim();
    }

    if (!newValue) {
        alert('El campo no puede estar vacío');
        return;
    }

    try {
        // Get current user data to get user_id
        const profileResponse = await axios.get(`${endpointUsers}/me/profile`);
        const userId = profileResponse.data.id_user;

        // Prepare update data
        let updateData = {};
        if (field === 'name') {
            updateData.full_name = newValue;
        } else if (field === 'email') {
            updateData.email = newValue;
        } else if (field === 'address') {
            updateData.user_address = newValue;
        } else if (field === 'description') {
            // Description is not a direct field in the user model, so we'll skip it for now
            // You might need to add a description field to the user model
            alert('La descripción no se puede actualizar desde aquí');
            cancelEditing(field);
            return;
        }

        // Update user data
        await axios.put(`${endpointUsers}/${userId}`, updateData);

        // Reload profile to show updated data
        await loadUserProfile();

        // Hide editing controls
        cancelEditing(field);

        alert('Cambios guardados exitosamente');
    } catch (error) {
        console.error('Error updating user:', error);
        if (error.response && error.response.status === 400) {
            alert('Error en los datos proporcionados');
        } else {
            alert('Error al guardar los cambios');
        }
    }
}

// Add event listeners for edit buttons
document.addEventListener('click', function(e) {
    if (e.target.closest('.edit-btn')) {
        const field = e.target.closest('.edit-btn').getAttribute('data-field');
        enableEditing(field);
    }

    if (e.target.closest('.cancel-btn')) {
        const field = e.target.closest('.cancel-btn').getAttribute('data-field');
        cancelEditing(field);
    }

    if (e.target.closest('.save-btn')) {
        const field = e.target.closest('.save-btn').getAttribute('data-field');
        saveChanges(field);
    }
});

// Import cart utilities
import { getOrders } from './cart.js';

// Función para generar el HTML de los pedidos
function generateOrdersHTML() {
    const orders = getOrders();

    if (orders.length === 0) {
        return `
            <h4>Tus Pedidos</h4>
            <div class="no-orders">
                <p>Aún no has realizado ningún pedido.</p>
                <a href="./dashboard.html" class="btn-primary">Ir a comprar</a>
            </div>
        `;
    }

    let ordersHTML = '<h4>Tus Pedidos</h4><div class="orders-container">';

    orders.forEach(order => {
        const orderDate = new Date(order.order_date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        ordersHTML += `
            <div class="order-card">
                <h5>Pedido #${order.id_order}</h5>
                <p><strong>Fecha:</strong> ${orderDate}</p>
                <p><strong>Método de pago:</strong> ${order.payment_method}</p>
                <p><strong>Estado:</strong> ${order.status}</p>
                <p><strong>Total:</strong> $${order.total.toLocaleString()}</p>
                <div class="order-items">
                    <h6>Productos:</h6>
                    <ul>
        `;

        order.items.forEach(item => {
            ordersHTML += `<li>${item.name_product} (x${item.quantity}) - $${(item.price * item.quantity).toLocaleString()}</li>`;
        });

        ordersHTML += `
                    </ul>
                </div>
            </div>
        `;
    });

    ordersHTML += '</div>';
    return ordersHTML;
}

// Vistas disponibles (sin el bloque de configuración, solo contenido dinámico)
const views = {
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
            // Si es pedidos → mostramos configuración + vista (generar dinámicamente)
            if (view === "pedidos") {
                settingsSection.style.display = "block";
                viewContainer.innerHTML = generateOrdersHTML();
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