import axios from './auth-interceptor.js';

const API_BASE_URL = 'http://localhost:8000'; // Adjust to your backend URL

class MyShop {
    constructor() {
        this.shop = null;
        this.userId = null;
        this.init();
    }

    async init() {
        try {
            // Get user info from token or session (assuming token contains user id)
            const userData = localStorage.getItem("user");
            if (!userData) {
                console.error('No auth user data found');
                return;
            }
            const user = JSON.parse(userData);
            // User ID is stored in user.user_id
            this.userId = user.user_id;

            await this.loadShop();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing MyShop:', error);
        }
    }

    async loadShop() {
        try {
            const response = await axios.get(`${API_BASE_URL}/shops?skip=0&limit=100`);
            if (!response || response.status !== 200) {
                throw new Error('Failed to fetch shops');
            }
            const shops = response.data;
            // Find shop for current user
            this.shop = shops.find(shop => shop.id_user === this.userId);
            console.log('Found shop for user:', this.shop); // Added for debugging
            if (this.shop) {
                window.currentShopId = this.shop.id_shop;
                window.currentShopName = this.shop.shop_name;
                // Call fetchProducts after shop is loaded
                if (window.fetchProducts) {
                    window.fetchProducts();
                }
            }
            this.renderShop();
        } catch (error) {
            console.error('Error loading shop:', error);
        }
    }

    renderShop() {
        const container = document.getElementById('shopContainer');
        console.log('Rendering shop, container found:', !!container, 'shop exists:', !!this.shop);
        if (!container) return;

        if (this.shop) {
            // Display shop details in read-only mode with edit button
            container.innerHTML = `
            <div class="container_shop">
            <div class="container_icon">
                ${this.shop.logo_url ? `<img src="${this.shop.logo_url}" alt="Logo de la tienda" style="max-width: 100px; max-height: 100px;">` : 'No disponible'}</p>
            </div>
            <h2>${this.shop.shop_name}</h2>
            </div>
                <div id="shopDisplay">
                    <p><strong>Descripción:</strong> ${this.shop.description || ''}</p>
                    <p><strong>Dirección:</strong> ${this.shop.shop_address || ''}</p>
                    <button id="editShopBtn">Editar</button>
                </div>
                <div id="shopFormContainer" style="display:none;">
                    <form id="shopForm">
                        <label for="shop_name">Nombre de la tienda:</label>
                        <input type="text" id="shop_name" name="shop_name" value="${this.shop.shop_name}" required>

                        <label for="description">Descripción:</label>
                        <textarea id="description" name="description" required>${this.shop.description || ''}</textarea>

                        <label for="shop_address">Dirección:</label>
                        <input type="text" id="shop_address" name="shop_address" value="${this.shop.shop_address || ''}">

                        <label for="logo_url">URL del logo:</label>
                        <input type="url" id="logo_url" name="logo_url" value="${this.shop.logo_url || ''}">

                        <button type="submit">Actualizar Tienda</button>
                        <button type="button" id="cancelEditBtn">Cancelar</button>
                    </form>
                </div>
            `;

            // Add event listeners for edit and cancel buttons
            document.getElementById('editShopBtn').addEventListener('click', () => {
                document.getElementById('shopDisplay').style.display = 'none';
                document.getElementById('shopFormContainer').style.display = 'block';
            });

            document.getElementById('cancelEditBtn').addEventListener('click', () => {
                document.getElementById('shopFormContainer').style.display = 'none';
                document.getElementById('shopDisplay').style.display = 'block';
            });

        } else {
            // Show form to create shop
            container.innerHTML = `
                <h3>Crear Tienda</h3>
                <form id="shopForm">
                    <label for="shop_name">Nombre de la tienda:</label>
                    <input type="text" id="shop_name" name="shop_name" required>

                    <label for="description">Descripción:</label>
                    <textarea id="description" name="description" required></textarea>

                    <label for="shop_address">Dirección:</label>
                    <input type="text" id="shop_address" name="shop_address">

                    <label for="logo_url">URL del logo:</label>
                    <input type="url" id="logo_url" name="logo_url">

                    <button type="submit">Crear Tienda</button>
                </form>
            `;
        }
    }

    setupEventListeners() {
        document.addEventListener('submit', async (event) => {
            if (event.target && event.target.id === 'shopForm') {
                event.preventDefault();
                await this.handleFormSubmit(event.target);
            }
        });
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);
        // Validate required fields length
        const shop_name = formData.get('shop_name')?.trim();
        const description = formData.get('description')?.trim();
        if (!shop_name || shop_name.length < 2) {
            alert('El nombre de la tienda debe tener al menos 2 caracteres.');
            return;
        }
        if (!description) {
            alert('La descripción es obligatoria.');
            return;
        }
        // Optional fields
        let shop_address = formData.get('shop_address')?.trim();
        if (shop_address && shop_address.length < 2) {
            alert('La dirección debe tener al menos 2 caracteres si se proporciona.');
            return;
        }
        let logo_url = formData.get('logo_url')?.trim();
        if (logo_url && logo_url.length > 255) {
            alert('La URL del logo no puede exceder 255 caracteres.');
            return;
        }
        // Prepare data object
        const shopData = {
            id_user: Number(this.userId) || 0,
            shop_name: shop_name,
            description: description,
            shop_address: shop_address || null,
            logo_url: logo_url || null,
            is_active: true
        };

        console.log('Sending shop data:', shopData);

        try {
            let response;
            if (this.shop) {
                // Update existing shop
                response = await axios.put(`${API_BASE_URL}/shops/${this.shop.id_shop}`, shopData);
            } else {
                // Create new shop
                response = await axios.post(`${API_BASE_URL}/shops/`, shopData);
            }

            if (!response || (response.status !== 200 && response.status !== 201)) {
                alert('No se pudo guardar la tienda');
                return;
            }

            this.shop = response.data;
            window.currentShopId = this.shop.id_shop;
            window.currentShopName = this.shop.shop_name;
            alert('Tienda guardada exitosamente');
            this.renderShop();
            // Call fetchProducts after shop is created/updated
            if (window.fetchProducts) {
                window.fetchProducts();
            }
        } catch (error) {
            console.error('Error saving shop:', error);
            alert('Error al guardar la tienda');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyShop();
});
