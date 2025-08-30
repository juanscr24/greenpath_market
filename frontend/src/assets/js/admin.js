// admin.js - JavaScript for admin.html to manage shops

import { endpointShops, endpointDeleteShop, endpointUpdateShop } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    loadShops();
});

function getAuthHeaders() {
    const userData = localStorage.getItem("user");
    if (userData) {
        const user = JSON.parse(userData);
        if (user.access_token) {
            return {
                'Authorization': `Bearer ${user.access_token}`,
                'Content-Type': 'application/json'
            };
        }
    }
    return { 'Content-Type': 'application/json' };
}

async function loadShops() {
    try {
        const response = await fetch(endpointShops, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Error fetching shops');
        const shops = await response.json();
        displayShops(shops);
    } catch (error) {
        console.error('Failed to load shops:', error);
        alert('Error loading shops. Please try again later.');
    }
}

function displayShops(shops) {
    const container = document.getElementById('shopsContainer');
    if (!container) return;
    container.innerHTML = '';

    shops.forEach(shop => {
        const shopDiv = document.createElement('div');
        shopDiv.className = 'shop-card';
        const logoHtml = shop.logo_url ? `<img src="${shop.logo_url}" alt="Logo" class="shop-logo">` : '';
        shopDiv.innerHTML = `
            ${logoHtml}
            <h3>${shop.shop_name}</h3>
            <p>${shop.description}</p>
            <p><strong>Address:</strong> ${shop.shop_address || 'N/A'}</p>
            <button class="edit-btn" data-id="${shop.id_shop}">Editar</button>
            <button class="delete-btn" data-id="${shop.id_shop}">Borrar</button>
        `;
        container.appendChild(shopDiv);
    });

    // Attach event listeners for edit and delete buttons
    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteShop);
    });
    container.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEditShop);
    });
}

async function handleDeleteShop(event) {
    const shopId = event.target.getAttribute('data-id');
    if (!shopId) return;
    if (!confirm('¿Está seguro que desea borrar esta tienda?')) return;

    try {
        const response = await fetch(endpointDeleteShop(shopId), {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (response.status === 204) {
            alert('Tienda borrada exitosamente');
            loadShops();
        } else {
            let errorMessage = 'Error borrando la tienda';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (jsonError) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Failed to delete shop:', error);
        alert('Error borrando la tienda: ' + (error.message || error));
    }
}

function handleEditShop(event) {
    const shopId = event.target.getAttribute('data-id');
    if (!shopId) return;
    // For simplicity, prompt for new shop name and description
    const newName = prompt('Ingrese el nuevo nombre de la tienda:');
    if (newName === null) return; // Cancelled
    const newDescription = prompt('Ingrese la nueva descripción de la tienda:');
    if (newDescription === null) return; // Cancelled

    updateShop(shopId, { shop_name: newName, description: newDescription });
}

async function updateShop(shopId, data) {
    try {
        const response = await fetch(endpointUpdateShop(shopId), {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            let errorMessage = 'Error actualizando la tienda';
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch (jsonError) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }
            throw new Error(errorMessage);
        }
        alert('Tienda actualizada exitosamente');
        loadShops();
    } catch (error) {
        console.error('Failed to update shop:', error);
        alert('Error actualizando la tienda: ' + (error.message || error));
    }
}
