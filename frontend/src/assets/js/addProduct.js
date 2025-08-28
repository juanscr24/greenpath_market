const API_URL = 'http://localhost:3000/products';

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
  const res = await fetch(API_URL);
  const products = await res.json();
  renderList(products);
}

function renderList(products) {
  if (products.length === 0) {
    $productList.innerHTML = '<li>No hay productos</li>';
    return;
  }

  $productList.innerHTML = ''; // limpiar lista

  products.forEach((p) => {
    const li = document.createElement('li');
    li.classList.add("card");
    li.innerHTML = `
      <strong>${p.name_product}</strong> - Cantidad: ${p.stock} - Precio: $${p.price.toFixed(2)}<br>
      <em>${p.product_description || ''}</em><br>
      <button data-id="${p.id}" class="editBtn">Editar</button>
      <button data-id="${p.id}" class="deleteBtn">Eliminar</button>
    `;

    // Asignar eventos a botones
    li.querySelector('.editBtn').onclick = () => editProduct(p.id);
    li.querySelector('.deleteBtn').onclick = () => deleteProduct(p.id);

    $productList.appendChild(li);
  });
}

async function submitForm() {
  const name_product = document.getElementById('name_product').value.trim();
  const stock = parseInt(document.getElementById('stock').value);
  const price = parseFloat(document.getElementById('price').value);
  const product_description = document.getElementById('product_description').value.trim();

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
    id_image: null,
    product_star_rate: 0,
    id_category: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    if (editingId) {
      // Actualizar producto
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Error actualizando el producto');
      editingId = null;
    } else {
      // Agregar producto
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Error agregando el producto');
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
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Producto no encontrado');
    const product = await res.json();
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
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Error eliminando el producto');
    fetchProducts();
  } catch (error) {
    alert(error.message);
  }
}

// Carga inicial de productos
fetchProducts();
