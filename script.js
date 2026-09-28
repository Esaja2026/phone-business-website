// Product Database
const products = [
    {
        id: 1,
        name: "iPhone 15 Pro",
        price: 999,
        specs: "6.1\" display, A17 Pro chip, 256GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐⭐ (2,450 reviews)"
    },
    {
        id: 2,
        name: "Samsung Galaxy S24",
        price: 899,
        specs: "6.2\" display, Snapdragon 8 Gen 3, 256GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐⭐ (1,890 reviews)"
    },
    {
        id: 3,
        name: "Google Pixel 8",
        price: 799,
        specs: "6.3\" display, Google Tensor G3, 128GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐⭐ (1,560 reviews)"
    },
    {
        id: 4,
        name: "OnePlus 12",
        price: 749,
        specs: "6.7\" display, Snapdragon 8 Gen 3, 256GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐ (890 reviews)"
    },
    {
        id: 5,
        name: "Xiaomi 14",
        price: 699,
        specs: "6.36\" display, Snapdragon 8 Gen 3, 512GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐⭐ (1,200 reviews)"
    },
    {
        id: 6,
        name: "iPhone 15",
        price: 799,
        specs: "6.1\" display, A16 Bionic, 128GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐⭐ (3,100 reviews)"
    },
    {
        id: 7,
        name: "Samsung Galaxy A54",
        price: 449,
        specs: "6.4\" display, Exynos 1280, 128GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐ (450 reviews)"
    },
    {
        id: 8,
        name: "Motorola Edge 40",
        price: 499,
        specs: "6.55\" display, Snapdragon 778G+, 256GB",
        emoji: "📱",
        rating: "⭐⭐⭐⭐ (320 reviews)"
    }
];

// Shopping Cart
let cart = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCartFromStorage();
    updateCartCount();
    setupEventListeners();
});

// Load Products to Grid
function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">${product.emoji}</div>
        <div class="product-info">
            <div class="product-name">${product.name}</div>
            <div class="product-specs">${product.specs}</div>
            <div class="product-rating">${product.rating}</div>
            <div class="product-price">$${product.price}</div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `;
    return card;
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Open Cart Modal
function openCart() {
    const modal = document.getElementById('cartModal');
    displayCartItems();
    modal.style.display = 'block';
}

// Close Cart Modal
function closeCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = 'none';
}

// Display Cart Items
function displayCartItems() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        document.querySelector('.cart-summary').innerHTML = `
            <h3>Total: $<span id="totalPrice">0.00</span></h3>
            <button class="btn btn-primary" onclick="closeCart()">Continue Shopping</button>
        `;
        return;
    }
    
    cartItemsDiv.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div>
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} each</div>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <div>
                <div class="cart-item-price">$${itemTotal.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });
    
    document.getElementById('totalPrice').textContent = total.toFixed(2);
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartCount();
            displayCartItems();
        }
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartCount();
    displayCartItems();
    showNotification('Item removed from cart');
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    closeCart();
    document.getElementById('checkout').style.display = 'block';
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
}

// Cancel Checkout
function cancelCheckout() {
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('checkoutForm').reset();
}

// Handle Checkout Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            processOrder();
        });
    }
});

// Process Order
function processOrder() {
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const zip = document.getElementById('zip').value;
    
    // Validate form
    if (!fullName || !email || !phone || !address || !city || !state || !zip) {
        alert('Please fill in all fields');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
        id: 'ORD-' + Date.now(),
        customer: {
            name: fullName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            state: state,
            zip: zip
        },
        items: cart,
        total: total,
        date: new Date().toLocaleString()
    };
    
    // Save order
    saveOrder(order);
    
    // Show success message
    alert(`Order placed successfully!\n\nOrder ID: ${order.id}\nTotal: $${total.toFixed(2)}\n\nConfirmation email sent to ${email}`);
    
    // Clear cart and reset form
    cart = [];
    saveCartToStorage();
    updateCartCount();
    document.getElementById('checkoutForm').reset();
    document.getElementById('checkout').style.display = 'none';
    document.getElementById('productsGrid').scrollIntoView({ behavior: 'smooth' });
}

// Save Order to Local Storage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Save Cart to Local Storage
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Cart from Local Storage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Cart link
    const cartLink = document.querySelector('.cart-link');
    if (cartLink) {
        cartLink.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }
    
    // Price filter
    const filterPrice = document.getElementById('filterPrice');
    if (filterPrice) {
        filterPrice.addEventListener('change', filterProducts);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('cartModal');
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeCart();
            }
        });
    }
}

// Filter Products
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const priceFilter = document.getElementById('filterPrice').value;
    
    const filtered = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                            product.specs.toLowerCase().includes(searchTerm);
        
        // Price filter
        let matchesPrice = true;
        if (priceFilter) {
            if (priceFilter === '0-500') {
                matchesPrice = product.price <= 500;
            } else if (priceFilter === '500-1000') {
                matchesPrice = product.price > 500 && product.price <= 1000;
            } else if (priceFilter === '1000+') {
                matchesPrice = product.price > 1000;
            }
        }
        
        return matchesSearch && matchesPrice;
    });
    
    // Display filtered products
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    
    if (filtered.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;">No products found</div>';
    } else {
        filtered.forEach(product => {
            const card = createProductCard(product);
            grid.appendChild(card);
        });
    }
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
