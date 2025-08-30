import axios from "./auth-interceptor.js";
import { endpointProducts } from "./main.js";

const $showFormBtn = document.getElementById('show-form-btn');
const $formContainer = document.getElementById('form-container');
const $productList = document.getElementById('product-list');

let editingId = null;

// Renderizar el formulario dentro de form-container
function renderForm(product = {}) {
  $formContainer.innerHTML = `
    <input type="text" id="name_product" placeholder="Nombre del producto" value="${product.name_product || ''}" required>
    <input type="number" id="stock" placeholder="Cantidad del producto" value="${product.stock || ''}" min="0" required>
    <input type="number" step="0.01" id="price" placeholder="Valor unitario" value="${product.price || ''}" min="0" required>
    <input type="text" id="product_description" placeholder="Descripción (opcional)" value="${product.product_description || ''}">
    <input type="file" id="image_file" accept="image/*" ${editingId ? 'disabled' : ''}>
    <input type="number" id="id_category" placeholder="ID de categoría" value="${product.id_category || ''}" required>
    <button id="submitBtn">${editingId ? 'Actualizar' : 'Agregar'}</button>
    <button id="cancelBtn" style="display: ${editingId ? 'inline' : 'none'};">Cancelar</button>
  `;

  document.getElementById('submitBtn').onclick = submitForm;
  document.getElementById('cancelBtn').onclick = () => {
    editingId = null;
    $formContainer.innerHTML = '';
    $showFormBtn.style.display = 'inline-block';
  };
}

// Mostrar el formulario al hacer clic en el botón
$showFormBtn.addEventListener('click', () => {
  renderForm();
  $showFormBtn.style.display = 'none';
});

// Obtener y mostrar productos en el ul#product-list
async function fetchProducts() {
  const res = await axios.get( endpointProducts);
  let products = res.data;
  // Filter products by current shop
  if (window.currentShopId) {
    products = products.filter(p => p.id_shop === window.currentShopId);
  }
  renderList(products);
}

function renderList(products) {
  $productList.innerHTML = '';

  products.forEach((p) => {
    const article = document.createElement('article');
    article.classList.add('card');

    article.innerHTML = `
      <img src="${p.image_url || ''}" alt="${p.name_product}" class="card-img">
      <div class="overlay"></div>
      <div class="content">
        <h2>${p.name_product}</h2>
        <div class="price">
          <h3>${p.stock} L</h3>
          <h3>$${p.price.toLocaleString()}</h3>
        </div>
        <p>vendido por: <strong>${window.currentShopName || 'Mi Tienda'}</strong></p>
      </div>
      <div class="buttons">
        <button data-id="${p.id_product}" class="editBtn">Editar</button>
        <button data-id="${p.id_product}" class="deleteBtn">Eliminar</button>
      </div>
    `;

    // Asignar eventos a botones
    article.querySelector('.editBtn').onclick = () => editProduct(p.id_product);
    article.querySelector('.deleteBtn').onclick = () => deleteProduct(p.id_product);

    $productList.appendChild(article);
  });
}

async function submitForm() {
  const name_product = document.getElementById('name_product').value.trim();
  const stock = parseInt(document.getElementById('stock').value);
  const price = parseFloat(document.getElementById('price').value);
  const product_description = document.getElementById('product_description').value.trim();
  const image_file = document.getElementById('image_file').files[0];
  const id_category = parseInt(document.getElementById('id_category').value);

  if (!name_product || isNaN(stock) || stock < 0 || isNaN(price) || price < 0 || isNaN(id_category)) {
    alert('Por favor, completa correctamente todos los campos requeridos.');
    return;
  }

  // Get shop id from window or localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = userData.user_id;
  const id_shop = window.currentShopId || userId;

  try {
    if (editingId) {
      // For update, use JSON to /products/{id}
      const productData = {
        name_product,
        stock,
        price,
        product_description,
        id_shop,
        product_star_rate: 0,
        id_category,
      };
      const res = await axios.put(`${endpointProducts}/${editingId}`, productData);
      editingId = null;
    } else {
      if (image_file) {
        // Use FormData for file upload to /products/upload
        const formData = new FormData();
        formData.append('id_shop', id_shop);
        formData.append('name_product', name_product);
        formData.append('product_description', product_description || '');
        formData.append('price', price);
        formData.append('stock', stock);
        formData.append('product_star_rate', 0);
        formData.append('id_category', id_category);
        formData.append('image', image_file);

        const res = await axios.post(`${endpointProducts}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        // No file, use JSON to /products/
        const productData = {
          name_product,
          stock,
          price,
          product_description,
          id_shop,
          image_url: '',
          product_star_rate: 0,
          id_category,
        };
        const res = await axios.post(endpointProducts, productData);
      }
    }

    // Limpiar y esconder formulario
    $formContainer.innerHTML = '';
    $showFormBtn.style.display = 'inline-block';

    fetchProducts();
  } catch (error) {
    alert(error.response?.data?.detail || error.message);
  }
}

async function editProduct(id) {
  try {
    const res = await axios.get(`${endpointProducts}/${id}`);
    const product = res.data;
    editingId = id;
    renderForm(product);
    $showFormBtn.style.display = 'none';
  } catch (error) {
    alert(error.message);
  }
}

async function deleteProduct(id) {
  if (!confirm('¿Estás seguro de eliminar este producto?')) return;

  try {
    const res = await axios.delete(`${endpointProducts}/${id}`);
    fetchProducts();
  } catch (error) {
    alert(error.message);
  }
}

// Carga inicial de productos
fetchProducts();
