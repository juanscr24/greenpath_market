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
                ${this.shop.logo_url ? `<img src="${this.shop.logo_url}" alt="Logo de la tienda">` : 'No disponible'}</p>
            </div>
            <h2>${this.shop.shop_name}</h2>
            </div>
                <div id="shopDisplay">
                    <p><strong>Descripción:</strong> ${this.shop.description || ''}</p>
                    <p><strong>Dirección:</strong> ${this.shop.shop_address || ''}</p>
                    <button id="editShopBtn">Editar</button>
                </div>
                <div id="shopFormContainer" style="display:none;">
                    <form id="shopForm" enctype="multipart/form-data">
                        <label for="shop_name">Nombre de la tienda:</label>
                        <input type="text" id="shop_name" name="shop_name" value="${this.shop.shop_name}" required>

                        <label for="description">Descripción:</label>
                        <textarea id="description" name="description" required>${this.shop.description || ''}</textarea>

                        <label for="shop_address">Dirección:</label>
                        <input type="text" id="shop_address" name="shop_address" value="${this.shop.shop_address || ''}">

                        <label for="logo">Logo de la tienda (opcional - deja vacío para mantener el actual):</label>
                        <input type="file" id="logo" name="logo" accept="image/*">

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
                <form id="shopForm" enctype="multipart/form-data">
                    <label for="shop_name">Nombre de la tienda:</label>
                    <input type="text" id="shop_name" name="shop_name" required>

                    <label for="description">Descripción:</label>
                    <textarea id="description" name="description" required></textarea>

                    <label for="shop_address">Dirección:</label>
                    <input type="text" id="shop_address" name="shop_address">

                    <label for="logo">Logo de la tienda:</label>
                    <input type="file" id="logo" name="logo" accept="image/*" required>

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

        try {
            let response;
            const logo_file = formData.get('logo');

            if (this.shop) {
                // Update existing shop
                if (logo_file) {
                    // Update with new logo file
                    const uploadFormData = new FormData();
                    uploadFormData.append('id_user', Number(this.userId) || 0);
                    uploadFormData.append('shop_name', shop_name);
                    uploadFormData.append('description', description);
                    uploadFormData.append('shop_address', shop_address || '');
                    uploadFormData.append('is_active', true);
                    uploadFormData.append('logo', logo_file);

                    response = await axios.put(`${API_BASE_URL}/shops/upload/${this.shop.id_shop}`, uploadFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                } else {
                    // Update without changing logo
                    const shopData = {
                        id_user: Number(this.userId) || 0,
                        shop_name: shop_name,
                        description: description,
                        shop_address: shop_address || null,
                        logo_url: this.shop.logo_url, // Keep existing logo
                        is_active: true
                    };
                    response = await axios.put(`${API_BASE_URL}/shops/${this.shop.id_shop}`, shopData);
                }
            } else {
                // Create new shop with file upload
                if (!logo_file) {
                    alert('Por favor selecciona un archivo de imagen para el logo.');
                    return;
                }

                // Create FormData for file upload
                const uploadFormData = new FormData();
                uploadFormData.append('id_user', Number(this.userId) || 0);
                uploadFormData.append('shop_name', shop_name);
                uploadFormData.append('description', description);
                uploadFormData.append('shop_address', shop_address || '');
                uploadFormData.append('is_active', true);
                uploadFormData.append('logo', logo_file);

                response = await axios.post(`${API_BASE_URL}/shops/upload`, uploadFormData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
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
            alert(error.response?.data?.detail || 'Error al guardar la tienda');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MyShop();
});
