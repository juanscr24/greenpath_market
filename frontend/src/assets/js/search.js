
import axios from "./auth-interceptor.js";
import { endpointSearch } from "./main";
import { addToCart } from "./cart.js";

console.log('Módulo de búsqueda cargado correctamente');

// Función principal de búsqueda
async function buscar() {
    console.log('Función buscar() ejecutada');
    
    const searchInput = document.getElementById('searchInput');
    const query = searchInput ? searchInput.value : '';  // Tomar el valor del input
    
    console.log('Query de búsqueda:', query);
    
    if (!query) {
        console.log('Query vacío, mostrando alerta');
        alert('Por favor ingrese algo para buscar.');
        return;
    }

    const endpoint = `${endpointSearch}${encodeURIComponent(query)}`; // Construir URL con el query
    console.log('Endpoint de búsqueda:', endpoint);

    try {
        console.log('Realizando petición a la API...');
        const response = await axios.get(endpoint);
        console.log('Respuesta recibida:', response.data);
        mostrarResultados(response.data);
    } catch (error) {
        console.error('Hubo un problema con la petición:', error);
        const resultadosDiv = document.getElementById('resultados');
        if (resultadosDiv) {
            resultadosDiv.innerHTML = '<p>Error al realizar la búsqueda. Intente nuevamente.</p>';
        }
    }
}

// Función para mostrar resultados en tarjetas idénticas al dashboard
function mostrarResultados(data) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '';  // Limpiar resultados previos

    // Verificar que data sea un array y que tenga elementos
    if (!Array.isArray(data) || data.length === 0) {
        resultadosDiv.innerHTML = '<p class="no-results">No se encontraron resultados para tu búsqueda.</p>';
        return;
    }

    // Crear título de resultados
    const titulo = document.createElement('h2');
    titulo.textContent = `Resultados de búsqueda (${data.length} productos encontrados)`;
    titulo.className = 'search-results-title';
    resultadosDiv.appendChild(titulo);

    // Crear contenedor de tarjetas (usando la misma sección que el dashboard)
    const cardSection = document.createElement('section');
    cardSection.id = 'card-section';
    cardSection.className = 'search-results-grid';

    // Crear tarjeta idéntica para cada producto
    data.forEach(producto => {
        const card = document.createElement('article');
        card.className = 'card';

        // Imagen del producto
        const img = document.createElement('img');
        img.src = producto.image_url || '../assets/img/leche.jpg';
        img.alt = producto.name_product;
        img.className = 'card-img';

        // Degradado
        const overlay = document.createElement('div');
        overlay.className = 'overlay';

        // Contenido
        const content = document.createElement('div');
        content.className = 'content';

        // Nombre del producto
        const nombre = document.createElement('h2');
        nombre.textContent = producto.name_product;

        // Precio y cantidad (usando el mismo formato que las tarjetas existentes)
        const priceDiv = document.createElement('div');
        priceDiv.className = 'price';

        const cantidad = document.createElement('h3');
        cantidad.textContent = `${producto.stock} disponibles`;

        const precio = document.createElement('h3');
        precio.textContent = `$${producto.price.toLocaleString()}`;

        priceDiv.appendChild(cantidad);
        priceDiv.appendChild(precio);

        // Tienda (usando el mismo formato que "vendido por: Carulla")
        const tienda = document.createElement('p');
        tienda.innerHTML = `vendido por: <strong>${producto.shop_name}</strong>`;

        // Botón de agregar al carrito (idéntico al de las tarjetas existentes)
        const btn = document.createElement('a');
        btn.href = '#';
        btn.className = 'swipe-btn add-to-cart-btn';
        btn.setAttribute('data-product-id', producto.id_product);

        const btnText = document.createElement('span');
        btnText.textContent = 'Agrega al carrito';

        const arrows = document.createElement('div');
        arrows.className = 'arrows';

        const arrow1 = document.createElement('span');
        arrow1.textContent = '›';
        const arrow2 = document.createElement('span');
        arrow2.textContent = '›';

        arrows.appendChild(arrow1);
        arrows.appendChild(arrow2);
        btn.appendChild(btnText);
        btn.appendChild(arrows);

        // Ensamblar la tarjeta exactamente igual que las existentes
        content.appendChild(nombre);
        content.appendChild(priceDiv);
        content.appendChild(tienda);
        content.appendChild(btn);

        card.appendChild(img);
        card.appendChild(overlay);
        card.appendChild(content);

        cardSection.appendChild(card);
    });

    resultadosDiv.appendChild(cardSection);

    // Agregar event listeners a los botones de agregar al carrito
    setupAddToCartListeners(data);
}

// Función para configurar los event listeners de agregar al carrito
function setupAddToCartListeners(products) {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(btn.getAttribute('data-product-id'));
            const product = products.find(p => p.id_product === productId);

            if (product) {
                addToCart(product);
                alert(`Producto "${product.name_product}" agregado al carrito`);
                // Redirigir al carrito
                window.location.href = './shopping_car.html';
            }
        });
    });
}

// Event listeners para la búsqueda
function setupSearchListeners() {
    console.log('Configurando event listeners de búsqueda...');
    
    // Buscar al hacer clic en el botón de búsqueda
    const searchButton = document.querySelector('.container-search .btn');
    console.log('Botón de búsqueda encontrado:', searchButton);
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            console.log('Botón de búsqueda clickeado');
            buscar();
        });
    }

    // Buscar al presionar Enter en el input
    const searchInput = document.getElementById('searchInput');
    console.log('Input de búsqueda encontrado:', searchInput);
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                console.log('Enter presionado en input de búsqueda');
                buscar();
            }
        });
    }

    // También agregar evento al ícono dentro del botón por si acaso
    const searchIcon = document.querySelector('.container-search .btn i');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            console.log('Ícono de búsqueda clickeado');
            buscar();
        });
    }
}

// Inicializar los event listeners cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    setupSearchListeners();
});

// Hacer la función buscar disponible globalmente para el onclick
window.buscar = buscar;

// Exportar funciones para uso externo si es necesario
export { buscar, mostrarResultados, setupSearchListeners };

