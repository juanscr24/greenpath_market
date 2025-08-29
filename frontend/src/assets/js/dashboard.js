
import axios from 'axios'
import { endpointProducts } from './main';

const cardSection = document.getElementById('card-section');

// Función para crear una carta desde un producto
function createCard(product) {
    return `
        <article class="card">
            <img src="${product.image_url}" alt="${product.name_product}" class="card-img">
            <div class="overlay"></div>
            <div class="content">
                <h2>${product.name_product}</h2>
                <div class="price">
                <h3>${product.stock} L</h3> <!-- Mostrar el stock (por ejemplo, en litros) -->
                <h3>$${product.price.toLocaleString()}</h3> <!-- Mostrar el precio -->
            </div>
            <p>vendido por: <strong>Carulla</strong></p>
            </div>
                <a href="#" class="swipe-btn">
                <span>Agrega al carrito</span>
            <div class="arrows"><span>›</span><span>›</span></div>
        </a>
        </article>
    `;
}

// Obtener productos desde el backend
axios.get(endpointProducts)
    .then(response => {
        const products = response.data;

        // Solo renderizar si hay productos
        if (products.length > 0) {
            // Limpiar la sección primero
            cardSection.innerHTML = '';

            // Agregar cada carta
            products.forEach(product => {
                cardSection.innerHTML += createCard(product);
            });
        } else {
            cardSection.innerHTML = '<p>No hay productos disponibles.</p>';
        }
    })
    .catch(error => {
        console.error('Error al cargar los productos:', error);
        cardSection.innerHTML = '<p>Error al cargar los productos.</p>';
    });