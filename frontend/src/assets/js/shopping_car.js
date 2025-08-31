import { getCart, removeFromCart, updateQuantity, getCartTotal, createOrder } from './cart.js';

// Función para renderizar el carrito
function renderCart() {
    const cartContainer = document.getElementById('render_cart');
    const cart = getCart();

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h3>Tu carrito está vacío</h3>
                <p>Agrega algunos productos para comenzar</p>
                <a href="./dashboard.html" class="btn-primary">Ir a comprar</a>
            </div>
        `;
        return;
    }

    let cartHTML = '<div class="cart-items">';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        cartHTML += `
            <div class="cart-item" data-product-id="${item.id_product}">
                <img src="${item.image_url}" alt="${item.name_product}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4>${item.name_product}</h4>
                    <p>Precio: $${item.price.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-action="decrease">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" data-action="increase">+</button>
                    </div>
                    <p class="item-total">Total: $${itemTotal.toLocaleString()}</p>
                </div>
                <button class="remove-btn" data-product-id="${item.id_product}">×</button>
            </div>
        `;
    });

    cartHTML += '</div>';

    // Total del carrito
    const total = getCartTotal();
    cartHTML += `
        <div class="cart-total">
            <h3>Total: $${total.toLocaleString()}</h3>
        </div>
    `;

    // Opciones de pago
    cartHTML += `
        <div class="payment-section">
            <h3>Selecciona método de pago</h3>
            <div class="payment-methods">
                <div class="payment-option" data-method="visa">
                    <img src="../assets/img/pasarelas-pago/visa-logo.png" alt="Visa">
                    <span>Visa</span>
                </div>
                <div class="payment-option" data-method="mastercard">
                    <img src="../assets/img/pasarelas-pago/mastercard.png" alt="MasterCard">
                    <span>MasterCard</span>
                </div>
                <div class="payment-option" data-method="paypal">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" alt="PayPal">
                    <span>PayPal</span>
                </div>
                <div class="payment-option" data-method="amex">
                    <img src="../assets/img/pasarelas-pago/american-express.png" alt="American Express">
                    <span>American Express</span>
                </div>
                <div class="payment-option" data-method="nequi">
                    <img src="../assets/img/pasarelas-pago/nequi.png" alt="Nequi">
                    <span>Nequi</span>
                </div>
            </div>
            <button id="checkout-btn" class="checkout-btn" disabled>Proceder al pago</button>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;

    // Agregar event listeners
    setupCartEventListeners();
}

// Función para configurar event listeners del carrito
function setupCartEventListeners() {
    // Botones de cantidad
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const productId = parseInt(cartItem.getAttribute('data-product-id'));
            const action = e.target.getAttribute('data-action');
            const currentQuantity = parseInt(cartItem.querySelector('.quantity').textContent);

            let newQuantity = currentQuantity;
            if (action === 'increase') {
                newQuantity += 1;
            } else if (action === 'decrease' && currentQuantity > 1) {
                newQuantity -= 1;
            }

            updateQuantity(productId, newQuantity);
            renderCart();
        });
    });

    // Botones de eliminar
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            removeFromCart(productId);
            renderCart();
        });
    });

    // Opciones de pago
    let selectedPaymentMethod = null;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', (e) => {
            // Remover selección anterior
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('selected'));
            // Agregar selección actual
            e.currentTarget.classList.add('selected');
            selectedPaymentMethod = e.currentTarget.getAttribute('data-method');

            // Habilitar botón de checkout
            document.getElementById('checkout-btn').disabled = false;
        });
    });

    // Botón de checkout
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (!selectedPaymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        // Simular procesamiento de pago
        alert(`Procesando pago con ${selectedPaymentMethod}...`);

        // Crear orden
        const order = createOrder(selectedPaymentMethod);

        if (order) {
            alert('¡Pago exitoso! Tu pedido ha sido procesado.');
            // Redirigir a perfil con vista de pedidos
            window.location.href = './profile.html';
        }
    });
}

// Inicializar carrito cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
});
