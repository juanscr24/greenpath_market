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
    <select id="id_category" required>
      <option value="">-- Selecciona una categoría --</option>
      <option value="1" ${product.id_category == 1 ? 'selected' : ''}>Frutas y verduras</option>
      <option value="2" ${product.id_category == 2 ? 'selected' : ''}>Granos y cereales</option>
      <option value="3" ${product.id_category == 3 ? 'selected' : ''}>Lácteos y derivados</option>
      <option value="4" ${product.id_category == 4 ? 'selected' : ''}>Res, pollo y pescado</option>
    </select>
    <button id="submitBtn">${editingId ? 'Update' : 'Add'}</button>
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
  if (!window.currentShopId) {
    console.log('Shop not loaded yet, skipping fetchProducts');
    return;
  }
  const url = `${endpointProducts}/shop/${window.currentShopId}`;
  const res = await axios.get(url);
  const products = res.data;
  renderList(products);
}

// Make fetchProducts global so it can be called from my_shop.js
window.fetchProducts = fetchProducts;

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
        <p>Sold by: <strong>${window.currentShopName || 'Mi Tienda'}</strong></p>
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

  // Get shop id from window
  if (!window.currentShopId) {
    alert('Tienda no cargada, por favor recarga la página');
    return;
  }
  const id_shop = window.currentShopId;

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

// No need to call fetchProducts here, it's called from my_shop.js after shop is loaded
