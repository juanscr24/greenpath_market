// Cart management utilities using localStorage

// Get cart from localStorage
export function getCart() {
    const cart = localStorage.getItem('greenpath_cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
export function saveCart(cart) {
    localStorage.setItem('greenpath_cart', JSON.stringify(cart));
}

// Add item to cart
export function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id_product === product.id_product);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1,
            added_at: new Date().toISOString()
        });
    }

    saveCart(cart);
    return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.id_product !== productId);
    saveCart(updatedCart);
    return updatedCart;
}

// Update item quantity
export function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id_product === productId);

    if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
            return removeFromCart(productId);
        }
        saveCart(cart);
    }

    return cart;
}

// Clear cart
export function clearCart() {
    localStorage.removeItem('greenpath_cart');
}

// Get cart total
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Get cart item count
export function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Simulate order creation and move cart to orders
export function createOrder(paymentMethod) {
    const cart = getCart();
    if (cart.length === 0) return null;

    const order = {
        id_order: Date.now(), // Simple ID generation
        order_date: new Date().toISOString(),
        items: cart,
        total: getCartTotal(),
        payment_method: paymentMethod,
        status: 'Entregado' // Simulate delivered
    };

    // Get existing orders
    const orders = JSON.parse(localStorage.getItem('greenpath_orders') || '[]');
    orders.push(order);
    localStorage.setItem('greenpath_orders', JSON.stringify(orders));

    // Clear cart
    clearCart();

    return order;
}

// Get orders
export function getOrders() {
    return JSON.parse(localStorage.getItem('greenpath_orders') || '[]');
}
