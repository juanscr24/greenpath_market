
import axios from 'axios'
import { endpointProducts } from './main';
import { addToCart } from './cart.js';

const cardSection = document.getElementById('card-section');
const categorySection = document.getElementById('category-section');

let allProducts = [];

// Función para crear una carta desde un producto
function createCard(product) {
    return `
        <article class="card">
            <img src="${product.image_url}" alt="${product.name_product}" class="card-img">
            <div class="overlay"></div>
            <div class="content">
                <h2>${product.shop_name}</h2>
                <div class="price">
                <h3>${product.stock} L</h3> <!-- Mostrar el stock (por ejemplo, en litros) -->
                <h3>$${product.price.toLocaleString()}</h3> <!-- Mostrar el precio -->
            </div>
            <p>vendido por: <strong>${product.shop_name}</strong></p>
            </div>
                <a href="#" class="swipe-btn add-to-cart-btn" data-product-id="${product.id_product}">
                <span>Agrega al carrito</span>
            <div class="arrows"><span>›</span><span>›</span></div>
        </a>
        </article>
    `;
}

// Renderizar productos en la sección de productos
function renderProducts(products) {
    cardSection.innerHTML = '';
    if (products.length > 0) {
        products.forEach(product => {
            cardSection.innerHTML += createCard(product);
        });
        setupAddToCartListeners(products);
    } else {
        cardSection.innerHTML = '<p>No hay productos disponibles.</p>';
    }
}

// Obtener productos desde el backend
axios.get(endpointProducts)
    .then(response => {
        allProducts = response.data;
        renderProducts(allProducts);
        setupCategoryListeners();
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
        cardSection.innerHTML = '<p>Error al cargar los productos.</p>';
    });


// Función para configurar los event listeners de agregar al carrito
function setupAddToCartListeners(products) {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const product = products.find(p => p.id_product === productId);

            if (product) {
                addToCart(product);
                // Mostrar notificación amigable sin redirigir
                showNotification(`Producto "${product.name_product}" agregado al carrito`, 'success');
            }
        });
    });
}

// Agregar event listeners a las categorías para filtrar productos
function setupCategoryListeners() {
    const categoryItems = categorySection.querySelectorAll('.category-item');
    const categoryLabels = [
        'TODAS',
        'FRUTAS Y VERDURAS',
        'GRANOS Y CEREALES',
        'LACTEOS Y DERIVADOS',
        'RES, POLLO Y PESCADO'
    ];
    const currentCategoryLabel = document.getElementById('current-category-label');

    categoryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index === 0) {
                // Mostrar todos los productos si se clickea "TODAS"
                renderProducts(allProducts);
                currentCategoryLabel.textContent = '';
            } else {
                // Mapear índice a id_category (asumiendo orden fijo)
                const categoryId = index;
                const filteredProducts = allProducts.filter(p => p.id_category === categoryId);
                renderProducts(filteredProducts);
                currentCategoryLabel.textContent = `: ${categoryLabels[index]}`;
            }
        });
    });
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Estilos básicos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : '#2196f3'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Agregar estilos de animación CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
