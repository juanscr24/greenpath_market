// admin.js - JavaScript for admin.html to manage shops

import { endpointShops, endpointDeleteShop, endpointUpdateShop } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    loadShops();

    // Modal event listeners
    const modal = document.getElementById('editModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.querySelector('.cancel-btn');
    const editForm = document.getElementById('editForm');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', handleFormSubmit);
    }

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
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

    // Find the shop data from the current shops list
    const shop = getCurrentShopData(shopId);
    if (!shop) return;

    // Populate the form with current data
    document.getElementById('editShopName').value = shop.shop_name || '';
    document.getElementById('editDescription').value = shop.description || '';
    document.getElementById('editAddress').value = shop.shop_address || '';

    // Store the shop ID for the form submission
    document.getElementById('editForm').setAttribute('data-shop-id', shopId);

    // Show the modal
    document.getElementById('editModal').style.display = 'block';
}

function getCurrentShopData(shopId) {
    // This is a simple way to get the current shop data
    // In a real app, you might want to store the shops data globally
    const shopCards = document.querySelectorAll('.shop-card');
    for (let card of shopCards) {
        const editBtn = card.querySelector('.edit-btn');
        if (editBtn && editBtn.getAttribute('data-id') === shopId) {
            const h3 = card.querySelector('h3');
            const pTags = card.querySelectorAll('p');
            return {
                shop_name: h3 ? h3.textContent : '',
                description: pTags[0] ? pTags[0].textContent : '',
                shop_address: pTags[1] ? pTags[1].textContent.replace('Address: ', '') : ''
            };
        }
    }
    return null;
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const shopId = form.getAttribute('data-shop-id');
    if (!shopId) return;

    const formData = new FormData(form);
    const data = {
        shop_name: formData.get('shop_name') || document.getElementById('editShopName').value,
        description: formData.get('description') || document.getElementById('editDescription').value,
        shop_address: formData.get('shop_address') || document.getElementById('editAddress').value
    };

    // Close the modal
    document.getElementById('editModal').style.display = 'none';

    // Update the shop
    await updateShop(shopId, data);
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
