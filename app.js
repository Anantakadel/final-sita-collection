import  { products } from './products.js';
import { api } from './api.js';

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const productModal = document.getElementById('product-modal');
const productDetail = document.getElementById('product-detail');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');

// Login related elements
const loginNav = document.getElementById('login-nav');
const loginNavMobile = document.getElementById('login-nav-mobile');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const userIcon = document.getElementById('user-icon');
const registerLink = document.getElementById('register-link');
const loginLink = document.getElementById('login-link');
const registerModal = document.getElementById('register-modal');
const registerForm = document.getElementById('register-form');
const registerNavMobile = document.getElementById('register-nav-mobile');

// Admin related elements
const adminModal = document.getElementById('admin-modal');
const adminTabs = document.querySelectorAll('.admin-tab');
const adminTabContents = document.querySelectorAll('.admin-tab-content');
const adminProductsList = document.querySelector('.admin-products-list');
const adminOrdersList = document.querySelector('.admin-orders-list');
const addProductBtn = document.getElementById('add-product-btn');
const productFormModal = document.getElementById('product-form-modal');
const productForm = document.getElementById('product-form');
const productFormTitle = document.getElementById('product-form-title');

// Checkout related elements
const checkoutModal = document.getElementById('checkout-modal');
const checkoutSteps = document.querySelectorAll('.checkout-step');
const checkoutForm = document.getElementById('checkout-form');
const checkoutItemsList = document.getElementById('checkout-items');
const checkoutTotal = document.getElementById('checkout-total');
const checkoutGrandTotal = document.getElementById('checkout-grand-total');
const checkoutBackBtn = document.getElementById('checkout-back-btn');
const checkoutNextBtn = document.getElementById('checkout-next-btn');
const orderConfirmation = document.getElementById('order-confirmation');

// State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = null;
let isAdmin = false;
let currentStep = 0;

// Init
document.addEventListener('DOMContentLoaded', () => {
  displayProducts(products);
  setupEventListeners();
  checkCurrentUser();
  updateCartCount();
});

// Check if user is logged in
function checkCurrentUser() {
  const userSession = localStorage.getItem('user');
  if (userSession) {
    currentUser = JSON.parse(userSession);
    isAdmin = currentUser.role === 'admin';
    
    // Update UI
    loginNav.textContent = 'Logout';
    loginNavMobile.textContent = 'Logout';
    
    if (isAdmin) {
      userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        openAdminDashboard();
      });
    } else {
      userIcon.addEventListener('click', (e) => {
        e.preventDefault();
        showUserProfile();
      });
    }
  }
}

// Display products
function displayProducts(productsToDisplay) {
  productsContainer.innerHTML = '';
  
  productsToDisplay.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.id = product.id;
    productCard.dataset.category = product.category;
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">Rs. ${product.price.toFixed(2)}</p>
        <p class="product-stock">In Stock: ${product.stock}</p>
        <button class="add-to-cart">Add to Cart</button>
      </div>
    `;
    
    productsContainer.appendChild(productCard);
  });
}

// Setup event listeners
function setupEventListeners() {
  // Filter products
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(btn => btn.classList.remove('active'));
      btn.classList.add('active');
      
      const category = btn.dataset.category;
      if (category === 'all') {
        displayProducts(products);
      } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
      }
    });
  });
  
  // Add to cart
  productsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('add-to-cart')) {
      const productCard = e.target.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      addToCart(productId);
    }
  });
  
  // View product details
  productsContainer.addEventListener('click', e => {
    if (e.target.closest('.product-card') && !e.target.classList.contains('add-to-cart')) {
      const productCard = e.target.closest('.product-card');
      const productId = parseInt(productCard.dataset.id);
      showProductDetails(productId);
    }
  });
  
  // Open cart modal
  cartIcon.addEventListener('click', e => {
    e.preventDefault();
    updateCartDisplay();
    cartModal.style.display = 'block';
  });
  
  // Open login modal
  loginNav.addEventListener('click', e => {
    e.preventDefault();
    
    if (currentUser) {
      logout();
    } else {
      loginModal.style.display = 'block';
    }
  });
  
  // Mobile login
  loginNavMobile.addEventListener('click', e => {
    e.preventDefault();
    
    if (currentUser) {
      logout();
    } else {
      loginModal.style.display = 'block';
    }
    
    mobileMenu.style.display = 'none';
  });
  
  // Register link in login modal
  registerLink.addEventListener('click', e => {
    e.preventDefault();
    loginModal.style.display = 'none';
    registerModal.style.display = 'block';
  });
  
  // Login link in register modal
  loginLink.addEventListener('click', e => {
    e.preventDefault();
    registerModal.style.display = 'none';
    loginModal.style.display = 'block';
  });
  
  // Mobile register
  registerNavMobile?.addEventListener('click', e => {
    e.preventDefault();
    registerModal.style.display = 'block';
    mobileMenu.style.display = 'none';
  });
  
  // Login form submission
  loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
      const response = await api.login({ email, password });
      
      if (response.success) {
        currentUser = response.data;
        isAdmin = currentUser.role === 'admin';
        
        // Store user in local storage
        localStorage.setItem('user', JSON.stringify(currentUser));
        
        // Update UI
        loginNav.textContent = 'Logout';
        loginNavMobile.textContent = 'Logout';
        
        if (isAdmin) {
          userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            openAdminDashboard();
          });
        } else {
          userIcon.addEventListener('click', (e) => {
            e.preventDefault();
            showUserProfile();
          });
        }
        
        loginModal.style.display = 'none';
        showToast(`Welcome back, ${currentUser.name}!`);
      } else {
        showToast('Invalid credentials. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Error during login. Please try again.', 'error');
    }
  });
  
  // Register form submission
  registerForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
      showToast('Passwords do not match!', 'error');
      return;
    }
    
    try {
      const response = await api.register({ 
        name, 
        email, 
        password,
        phone
      });
      
      if (response.success) {
        showToast('Account created successfully! Please login.');
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
        
        // Fill login email
        document.getElementById('login-email').value = email;
      } else {
        showToast(`Registration failed: ${response.error}`, 'error');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showToast('Error during registration. Please try again.', 'error');
    }
  });
  
  // Admin dashboard tabs
  adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      adminTabs.forEach(t => t.classList.remove('active'));
      adminTabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const tabContent = document.getElementById(`admin-${tab.dataset.tab}`);
      tabContent.classList.add('active');
      
      if (tab.dataset.tab === 'products') {
        loadAdminProducts();
      } else if (tab.dataset.tab === 'orders') {
        loadAdminOrders();
      }
    });
  });
  
  // Add new product
  addProductBtn.addEventListener('click', () => {
    // Reset form
    productForm.reset();
    document.getElementById('product-id').value = '';
    productFormTitle.textContent = 'Add New Product';
    productFormModal.style.display = 'block';
  });
  
  // Product form submission
  productForm.addEventListener('submit', async e => {
    e.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const image = document.getElementById('product-image').value;
    const stock = document.getElementById('product-stock').value;
    
    const productData = {
      name,
      price: parseFloat(price),
      description,
      category,
      image,
      stock: parseInt(stock)
    };
    
    try {
      let response;
      
      if (productId) {
        // Update existing product
        response = await api.updateProduct(productId, productData);
        
        if (response.success) {
          // Update the product in the local products array
          const index = products.findIndex(p => p.id === parseInt(productId));
          if (index !== -1) {
            products[index] = response.data;
          }
          
          showToast('Product updated successfully!');
        }
      } else {
        // Add new product
        response = await api.addProduct(productData);
        
        if (response.success) {
          // Add the new product to the local products array
          products.push(response.data);
          showToast('Product added successfully!');
        }
      }
      
      if (response.success) {
        // Close the modal and refresh product displays
        productFormModal.style.display = 'none';
        loadAdminProducts();
        displayProducts(products);
      } else {
        showToast('Error saving product. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Product save error:', error);
      showToast('Error saving product. Please try again.', 'error');
    }
  });
  
  // Close modals
  document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      cartModal.style.display = 'none';
      productModal.style.display = 'none';
      loginModal.style.display = 'none';
      registerModal.style.display = 'none';
      adminModal.style.display = 'none';
      productFormModal.style.display = 'none';
      checkoutModal.style.display = 'none';
      resetCheckout();
    });
  });
  
  // Close modals when clicking outside
  window.addEventListener('click', e => {
    if (e.target === cartModal) cartModal.style.display = 'none';
    if (e.target === productModal) productModal.style.display = 'none';
    if (e.target === loginModal) loginModal.style.display = 'none';
    if (e.target === registerModal) registerModal.style.display = 'none';
    if (e.target === adminModal) adminModal.style.display = 'none';
    if (e.target === productFormModal) productFormModal.style.display = 'none';
    if (e.target === checkoutModal) {
      checkoutModal.style.display = 'none';
      resetCheckout();
    }
  });
  
  // Proceed to checkout
  checkoutBtn.addEventListener('click', async () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    
    // If user is not logged in, prompt to login
    if (!currentUser) {
      cartModal.style.display = 'none';
      loginModal.style.display = 'block';
      showToast('Please log in to continue with checkout', 'info');
      return;
    }
    
    // Show checkout modal
    cartModal.style.display = 'none';
    startCheckout();
  });
  
  // Checkout navigation buttons
  checkoutBackBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      navigateCheckout(currentStep - 1);
    } else {
      checkoutModal.style.display = 'none';
      cartModal.style.display = 'block';
      resetCheckout();
    }
  });
  
  checkoutNextBtn.addEventListener('click', () => {
    const currentStepElement = checkoutSteps[currentStep];
    
    // Validate current step
    if (currentStep === 0) {
      // Review step, always valid
      navigateCheckout(currentStep + 1);
    } else if (currentStep === 1) {
      // Shipping info step
      const form = checkoutForm;
      if (form.checkValidity()) {
        navigateCheckout(currentStep + 1);
      } else {
        form.reportValidity();
      }
    } else if (currentStep === 2) {
      // Payment info step, proceed to final confirmation
      placeOrder();
    }
  });
  
  // Mobile menu toggle
  menuToggle.addEventListener('click', () => {
    if (mobileMenu.style.display === 'block') {
      mobileMenu.style.display = 'none';
    } else {
      mobileMenu.style.display = 'block';
    }
  });
  
  // Contact form
  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value
    };
    
    try {
      const response = await api.sendContactMessage(formData);
      
      if (response.success) {
        showToast('Message sent successfully! We will get back to you soon.');
        e.target.reset();
      } else {
        showToast('Error sending message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      showToast('Error sending message. Please try again.', 'error');
    }
  });
}

// Logout user
function logout() {
  currentUser = null;
  isAdmin = false;
  localStorage.removeItem('user');
  
  // Update UI
  loginNav.textContent = 'Login';
  loginNavMobile.textContent = 'Login';
  
  // Remove admin dashboard event listener
  userIcon.removeEventListener('click', openAdminDashboard);
  userIcon.removeEventListener('click', showUserProfile);
  
  showToast('You have been logged out.');
}

// Show user profile
function showUserProfile() {
  if (!currentUser) return;
  
  // In a real app, you'd have a user profile modal or page
  showToast(`Hello, ${currentUser.name}! Profile feature coming soon.`);
}

// Open admin dashboard
function openAdminDashboard() {
  if (!isAdmin) return;
  
  // Set active tab to products by default
  adminTabs.forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.tab === 'products') {
      tab.classList.add('active');
    }
  });
  
  adminTabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === 'admin-products') {
      content.classList.add('active');
    }
  });
  
  // Load products
  loadAdminProducts();
  
  // Show modal
  adminModal.style.display = 'block';
}

// Load products for admin dashboard
async function loadAdminProducts() {
  try {
    // In a real app, we'd fetch products from the API here
    // For simplicity, we're using the local products array
    const productsListElement = document.querySelector('.admin-products-list');
    productsListElement.innerHTML = '';
    
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'admin-product-item';
      
      productElement.innerHTML = `
        <div class="admin-product-thumbnail">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="admin-product-info">
          <h3>${product.name}</h3>
          <p class="admin-product-price">Rs. ${product.price.toFixed(2)}</p>
          <p class="admin-product-category">${product.category}</p>
          <p>Stock: ${product.stock}</p>
        </div>
        <div class="admin-product-actions">
          <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
          <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
        </div>
      `;
      
      productsListElement.appendChild(productElement);
    });
    
    // Add event listeners to the edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        editProduct(parseInt(btn.dataset.id));
      });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        deleteProduct(parseInt(btn.dataset.id));
      });
    });
  } catch (error) {
    console.error('Error loading admin products:', error);
  }
}

// Load orders for admin dashboard
async function loadAdminOrders() {
  try {
    const response = await api.getOrders();
    
    if (response.success) {
      const ordersListElement = document.querySelector('.admin-orders-list');
      ordersListElement.innerHTML = '';
      
      if (response.data.length === 0) {
        ordersListElement.innerHTML = '<p>No orders yet.</p>';
        return;
      }
      
      response.data.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'admin-order-item';
        
        const itemsText = order.items.map(item => 
          `${item.product.name} x ${item.quantity}`
        ).join(', ');
        
        orderElement.innerHTML = `
          <div class="admin-order-id">Order #${order.id}</div>
          <div class="admin-order-details">
            <p>Date: ${new Date(order.date).toLocaleString()}</p>
            <p>Items: ${itemsText}</p>
          </div>
          <div class="admin-order-total">Rs. ${order.total.toFixed(2)}</div>
          <div class="admin-order-status status-${order.status}">${order.status}</div>
        `;
        
        ordersListElement.appendChild(orderElement);
      });
    } else {
      console.error('Error loading orders:', response.error);
    }
  } catch (error) {
    console.error('Error loading admin orders:', error);
  }
}

// Edit product
function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Fill the form with product data
  document.getElementById('product-id').value = product.id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-description').value = product.description;
  document.getElementById('product-category').value = product.category;
  document.getElementById('product-image').value = product.image;
  document.getElementById('product-stock').value = product.stock;
  
  // Show the form modal
  productFormTitle.textContent = 'Edit Product';
  productFormModal.style.display = 'block';
}

// Delete product
async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const response = await api.deleteProduct(productId);
    
    if (response.success) {
      // Remove the product from the local products array
      const index = products.findIndex(p => p.id === productId);
      if (index !== -1) {
        products.splice(index, 1);
      }
      
      // Refresh the admin products list and store display
      loadAdminProducts();
      displayProducts(products);
      
      showToast('Product deleted successfully!');
    } else {
      showToast('Error deleting product. Please try again.', 'error');
    }
  } catch (error) {
    console.error('Delete product error:', error);
    showToast('Error deleting product. Please try again.', 'error');
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  // Check if product is in stock
  if (product.stock <= 0) {
    showToast('Sorry, this product is out of stock.', 'error');
    return;
  }
  
  const existingItem = cart.find(item => item.product.id === productId);
  
  if (existingItem) {
    // Check if adding more would exceed stock
    if (existingItem.quantity >= product.stock) {
      showToast(`Sorry, only ${product.stock} units available.`, 'error');
      return;
    }
    existingItem.quantity += 1;
  } else {
    cart.push({
      product,
      quantity: 1
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartCount();
  showToast(`${product.name} added to cart`);
}

// Update cart display
function updateCartDisplay() {
  cartItems.innerHTML = '';
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty</p>';
    cartTotalPrice.textContent = '0.00';
    return;
  }
  
  let total = 0;
  
  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;
    
    cartItem.innerHTML = `
      <div class="cart-item-image">
        <img src="${item.product.image}" alt="${item.product.name}">
      </div>
      <div class="cart-item-info">
        <h3 class="cart-item-title">${item.product.name}</h3>
        <p class="cart-item-price">Rs. ${item.product.price.toFixed(2)}</p>
        <div class="cart-item-quantity">
          <button class="quantity-btn decrease" data-id="${item.product.id}">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="${item.product.stock}" data-id="${item.product.id}">
          <button class="quantity-btn increase" data-id="${item.product.id}">+</button>
        </div>
      </div>
      <button class="cart-item-remove" data-id="${item.product.id}">&times;</button>
    `;
    
    cartItems.appendChild(cartItem);
  });
  
  cartTotalPrice.textContent = total.toFixed(2);
  
  // Setup cart item event listeners
  document.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      updateItemQuantity(id, 'decrease');
    });
  });
  
  document.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      updateItemQuantity(id, 'increase');
    });
  });
  
  document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', () => {
      const id = parseInt(input.dataset.id);
      const value = parseInt(input.value);
      const product = products.find(p => p.id === id);
      
      if (value < 1) {
        input.value = 1;
        updateItemQuantity(id, 'set', 1);
      } else if (value > product.stock) {
        input.value = product.stock;
        updateItemQuantity(id, 'set', product.stock);
        showToast(`Sorry, only ${product.stock} units available.`, 'error');
      } else {
        updateItemQuantity(id, 'set', value);
      }
    });
  });
  
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      removeFromCart(id);
    });
  });
}

// Update cart item quantity
function updateItemQuantity(productId, action, value = null) {
  const cartItem = cart.find(item => item.product.id === productId);
  if (!cartItem) return;
  
  const product = products.find(p => p.id === productId);
  
  if (action === 'increase') {
    if (cartItem.quantity < product.stock) {
      cartItem.quantity += 1;
    } else {
      showToast(`Sorry, only ${product.stock} units available.`, 'error');
      return;
    }
  } else if (action === 'decrease') {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      removeFromCart(productId);
      return;
    }
  } else if (action === 'set' && value !== null) {
    if (value <= product.stock) {
      cartItem.quantity = value;
    } else {
      cartItem.quantity = product.stock;
    }
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartDisplay();
  updateCartCount();
}

// Remove item from cart
function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  updateCartDisplay();
  updateCartCount();
}

// Update cart count
function updateCartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = count;
}

// Show product details
function showProductDetails(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  productDetail.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <h2>${product.name}</h2>
        <p class="price">Rs. ${product.price.toFixed(2)}</p>
        <p class="description">${product.description}</p>
        <p>In Stock: ${product.stock}</p>
        <div class="quantity">
          <label>Quantity:</label>
          <button class="quantity-btn decrease">-</button>
          <input type="number" class="quantity-input" value="1" min="1" max="${product.stock}">
          <button class="quantity-btn increase">+</button>
        </div>
        <button class="btn add-to-cart-detail">Add to Cart</button>
      </div>
    </div>
  `;
  
  productModal.style.display = 'block';
  
  // Setup event listeners
  const quantityInput = productDetail.querySelector('.quantity-input');
  const decreaseBtn = productDetail.querySelector('.decrease');
  const increaseBtn = productDetail.querySelector('.increase');
  const addToCartBtn = productDetail.querySelector('.add-to-cart-detail');
  
  decreaseBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
      quantityInput.value = quantity - 1;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity < product.stock) {
      quantityInput.value = quantity + 1;
    } else {
      showToast(`Sorry, only ${product.stock} units available.`, 'error');
    }
  });
  
  quantityInput.addEventListener('change', () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity < 1) {
      quantityInput.value = 1;
    } else if (quantity > product.stock) {
      quantityInput.value = product.stock;
      showToast(`Sorry, only ${product.stock} units available.`, 'error');
    }
  });
  
  addToCartBtn.addEventListener('click', () => {
    if (product.stock <= 0) {
      showToast('Sorry, this product is out of stock.', 'error');
      return;
    }
    
    const quantity = parseInt(quantityInput.value);
    const existingItem = cart.find(item => item.product.id === productId);
    
    if (existingItem) {
      // Check if adding more would exceed stock
      if (existingItem.quantity + quantity > product.stock) {
        showToast(`Sorry, only ${product.stock} units available.`, 'error');
        return;
      }
      existingItem.quantity += quantity;
    } else {
      cart.push({
        product,
        quantity
      });
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    productModal.style.display = 'none';
    showToast(`${product.name} added to cart`);
  });
}

// Start checkout process
function startCheckout() {
  // Reset to first step
  currentStep = 0;
  checkoutSteps.forEach((step, index) => {
    step.classList.toggle('active', index === 0);
  });
  
  // Update content for the review step
  updateCheckoutReview();
  
  // Show checkout modal
  checkoutModal.style.display = 'block';
  
  // Set button text
  checkoutBackBtn.textContent = 'Back to Cart';
  checkoutNextBtn.textContent = 'Continue to Shipping';
}

// Navigate between checkout steps
function navigateCheckout(stepIndex) {
  // Update current step
  currentStep = stepIndex;
  
  // Update steps visibility
  checkoutSteps.forEach((step, index) => {
    step.classList.toggle('active', index === stepIndex);
  });
  
  // Update button text
  if (stepIndex === 0) {
    checkoutBackBtn.textContent = 'Back to Cart';
    checkoutNextBtn.textContent = 'Continue to Shipping';
  } else if (stepIndex === 1) {
    checkoutBackBtn.textContent = 'Back to Review';
    checkoutNextBtn.textContent = 'Continue to Payment';
  } else if (stepIndex === 2) {
    checkoutBackBtn.textContent = 'Back to Shipping';
    checkoutNextBtn.textContent = 'Place Order';
  }
}

// Update checkout review content
function updateCheckoutReview() {
  checkoutItemsList.innerHTML = '';
  
  let total = 0;
  
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'checkout-item';
    
    const itemTotal = item.product.price * item.quantity;
    total += itemTotal;
    
    itemElement.innerHTML = `
      <div class="checkout-item-image">
        <img src="${item.product.image}" alt="${item.product.name}">
      </div>
      <div class="checkout-item-info">
        <h3>${item.product.name}</h3>
        <p>Rs. ${item.product.price.toFixed(2)} x ${item.quantity}</p>
      </div>
      <div class="checkout-item-total">
        Rs. ${itemTotal.toFixed(2)}
      </div>
    `;
    
    checkoutItemsList.appendChild(itemElement);
  });
  
  checkoutTotal.textContent = total.toFixed(2);
  
  // Calculate and display grand total (subtotal + shipping)
  const shipping = 150.00;
  const grandTotal = total + shipping;
  checkoutGrandTotal.textContent = grandTotal.toFixed(2);
}

// Reset checkout
function resetCheckout() {
  currentStep = 0;
  checkoutForm.reset();
  orderConfirmation.style.display = 'none';
}

// Place order
async function placeOrder() {
  try {
    if (!currentUser) {
      showToast('Please log in to complete your order', 'error');
      checkoutModal.style.display = 'none';
      loginModal.style.display = 'block';
      return;
    }
    
    const response = await api.checkout(cart);
    
    if (response.success) {
      // Show confirmation
      orderConfirmation.style.display = 'block';
      checkoutSteps.forEach(step => step.classList.remove('active'));
      
      // Update buttons
      checkoutBackBtn.style.display = 'none';
      checkoutNextBtn.textContent = 'Continue Shopping';
      checkoutNextBtn.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        resetCheckout();
      });
      
      // Clear cart
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      
      // Refresh products as stock has been updated
      const updatedProducts = await api.getProducts();
      if (updatedProducts.success) {
        Object.assign(products, updatedProducts.data);
        displayProducts(products);
      }
    } else {
      showToast(`Error processing your order: ${response.error}`, 'error');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Error processing your order. Please try again.', 'error');
  }
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}
 