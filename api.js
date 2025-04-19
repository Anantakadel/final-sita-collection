//  API service for backend communication
export const api = {
  // Base URL for API requests
  baseUrl: '/api',
  
  // Fetch API wrapper
  async request(endpoint, method = 'GET', data = null) {
    try {
      // For demonstration purposes, simulate API calls locally
      // In a real app, this would make actual server requests
      return await this.mockRequest(endpoint, method, data);
    } catch (error) {
      console.error('API request error:', error);
      return { success: false, error: 'Network error' };
    }
  },
  
  // Mock API for frontend testing
  async mockRequest(endpoint, method, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Get data from localStorage
    const getLocalData = (key, defaultValue = []) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    };
    
    // Set data to localStorage
    const setLocalData = (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    };
    
    // Initialize local data if not present
    if (!localStorage.getItem('products')) {
      const initialProducts = await import('./products.js').then(m => m.products);
      setLocalData('products', initialProducts);
    }
    
    if (!localStorage.getItem('orders')) {
      setLocalData('orders', []);
    }
    
    if (!localStorage.getItem('users')) {
      setLocalData('users', [{
        id: 1,
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      }, {
        id: 2,
        name: "Test User",
        email: "user@example.com",
        password: "user123",
        role: "customer"
      }]);
    }
    
    if (!localStorage.getItem('contacts')) {
      setLocalData('contacts', []);
    }
    
    // Handle different API endpoints
    if (endpoint === '/products' && method === 'GET') {
      const products = getLocalData('products');
      return { success: true, data: products };
    }
    
    if (endpoint.startsWith('/products/') && method === 'GET') {
      const productId = parseInt(endpoint.split('/')[2]);
      const products = getLocalData('products');
      const product = products.find(p => p.id === productId);
      return product ? { success: true, data: product } : { success: false, error: 'Product not found' };
    }
    
    if (endpoint === '/products' && method === 'POST') {
      const products = getLocalData('products');
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      const newProduct = { ...data, id: newId };
      products.push(newProduct);
      setLocalData('products', products);
      return { success: true, data: newProduct };
    }
    
    if (endpoint.startsWith('/products/') && method === 'PUT') {
      const productId = parseInt(endpoint.split('/')[2]);
      const products = getLocalData('products');
      const index = products.findIndex(p => p.id === productId);
      
      if (index === -1) {
        return { success: false, error: 'Product not found' };
      }
      
      const updatedProduct = { ...products[index], ...data, id: productId };
      products[index] = updatedProduct;
      setLocalData('products', products);
      return { success: true, data: updatedProduct };
    }
    
    if (endpoint.startsWith('/products/') && method === 'DELETE') {
      const productId = parseInt(endpoint.split('/')[2]);
      const products = getLocalData('products');
      const filtered = products.filter(p => p.id !== productId);
      
      if (filtered.length === products.length) {
        return { success: false, error: 'Product not found' };
      }
      
      setLocalData('products', filtered);
      return { success: true, message: 'Product deleted successfully' };
    }
    
    if (endpoint === '/checkout' && method === 'POST') {
      const { items } = data;
      const products = getLocalData('products');
      const orders = getLocalData('orders');
      
      // Validate items and check stock
      for (const item of items) {
        const product = products.find(p => p.id === item.product.id);
        if (!product) {
          return { success: false, error: `Product ${item.product.name} not found` };
        }
        
        if (product.stock < item.quantity) {
          return { success: false, error: `Not enough stock for ${product.name}. Available: ${product.stock}` };
        }
      }
      
      // Update stock
      items.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.product.id);
        if (productIndex !== -1) {
          products[productIndex].stock -= item.quantity;
        }
      });
      
      // Create order
      const newOrder = {
        id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1,
        items: items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image
          },
          quantity: item.quantity
        })),
        total: items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'pending'
      };
      
      orders.push(newOrder);
      setLocalData('products', products);
      setLocalData('orders', orders);
      
      return { success: true, data: { orderId: newOrder.id } };
    }
    
    if (endpoint === '/orders' && method === 'GET') {
      const orders = getLocalData('orders');
      return { success: true, data: orders };
    }
    
    if (endpoint === '/contact' && method === 'POST') {
      const contacts = getLocalData('contacts');
      const newContact = {
        id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
        ...data,
        date: new Date().toISOString()
      };
      contacts.push(newContact);
      setLocalData('contacts', contacts);
      return { success: true, message: 'Message sent successfully' };
    }
    
    if (endpoint === '/auth/register' && method === 'POST') {
      const users = getLocalData('users');
      if (users.some(u => u.email === data.email)) {
        return { success: false, error: 'User already exists' };
      }
      
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        ...data,
        role: 'customer',
        created: new Date().toISOString()
      };
      
      users.push(newUser);
      setLocalData('users', users);
      
      // Return user data without password
      const { password, ...userData } = newUser;
      return { success: true, data: userData };
    }
    
    if (endpoint === '/auth/login' && method === 'POST') {
      const { email, password } = data;
      const users = getLocalData('users');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }
      
      // Return user data without password
      const { password: _, ...userData } = user;
      return { success: true, data: userData };
    }
    
    return { success: false, error: 'API endpoint not implemented' };
  },
  
  // Real API methods that map to the mock implementation above
  async getProducts() {
    return this.request('/products');
  },
  
  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  },
  
  async addProduct(productData) {
    return this.request('/products', 'POST', productData);
  },
  
  async updateProduct(productId, productData) {
    return this.request(`/products/${productId}`, 'PUT', productData);
  },
  
  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, 'DELETE');
  },
  
  async checkout(cartItems) {
    return this.request('/checkout', 'POST', { items: cartItems });
  },
  
  async getOrders() {
    return this.request('/orders');
  },
  
  async sendContactMessage(formData) {
    return this.request('/contact', 'POST', formData);
  },
  
  async register(userData) {
    return this.request('/auth/register', 'POST', userData);
  },
  
  async login(credentials) {
    return this.request('/auth/login', 'POST', credentials);
  }
};
 