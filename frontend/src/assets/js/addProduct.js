//<section>
//            <!--seccion para el renderizado de la introduccion de productos-->
//                <!-- Botón para mostrar el formulario -->
//            <button id="show-form-btn">Mostrar formulario para agregar productos</button>

//            <!-- Contenedor donde se generará el formulario -->
//            <div id="form-container"></div>

        //     <!-- Lista de productos -->
        //     <ul id="product-list" id="card-section"></ul>
        // </section>



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
    <input type="text" id="url_img" placeholder="Url de la imagen" value="${product.image_url || ''}">
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
  const res = await axios.get( endpointProducts = 'http://localhost:3000/products'
);
  const products = res.data;
  renderList(products);
}

function renderList(products) {
  $productList.innerHTML = ''; 

  products.forEach((p) => {
    const li = document.createElement('li');
    li.classList.add('card');

    // Crear div para imagen con fondo
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('card-img');
    if (p.image_url) {
      imgDiv.style.backgroundImage = `url('${p.image_url}')`;
    }

    // Crear div para contenido y botones
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content', 'overlay');
    contentDiv.innerHTML = `
      <strong>${p.name_product}</strong>
      <br class="price">Cantidad: ${p.stock} - Precio: $${p.price.toFixed(2)}<br> 
      <em>${p.product_description || ''}</em><br>
      <button data-id="${p.id}" class="editBtn swipe-btn">Editar</button>
      <button data-id="${p.id}" class="deleteBtn swipe-btn">Eliminar</button>
    `;

    // Asignar eventos a botones
    contentDiv.querySelector('.editBtn').onclick = () => editProduct(p.id);
    contentDiv.querySelector('.deleteBtn').onclick = () => deleteProduct(p.id);

    // Agregar imagen y contenido al li
    li.appendChild(imgDiv);
    li.appendChild(contentDiv);

    $productList.appendChild(li);
  });
}

async function submitForm() {
  const name_product = document.getElementById('name_product').value.trim();
  const stock = parseInt(document.getElementById('stock').value);
  const price = parseFloat(document.getElementById('price').value);
  const product_description = document.getElementById('product_description').value.trim();
  const image_url = document.getElementById('url_img').value.trim();
  if (!name_product || isNaN(stock) || stock < 0 || isNaN(price) || price < 0) {
    alert('Por favor, completa correctamente todos los campos requeridos.');
    return;
  }

  const productData = {
    name_product,
    stock,
    price,
    product_description,
    id_shop: null,
    image_url,
    product_star_rate: 0,
    id_category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    if (editingId) {
      // Actualizar producto
      const res = await axios.put(`${API_URL}/${editingId}`, productData);
      editingId = null;
    } else {
      // Agregar producto
      const res = await axios.post(API_URL, productData);
    }

    // Limpiar y esconder formulario
    $formContainer.innerHTML = '';
    $showFormBtn.style.display = 'inline-block';

    fetchProducts();
  } catch (error) {
    alert(error.message);
  }
}

async function editProduct(id) {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
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
    const res = await axios.delete(`${API_URL}/${id}`);
    fetchProducts();
  } catch (error) {
    alert(error.message);
  }
}

// Carga inicial de productos
fetchProducts();
