import  express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sample database (in a real app, you'd use a proper database)
const db = {
  products: [
    {
      id: 1,
      name: "Classic Leather Boots",
      price: 129.99,
      description: "Handcrafted leather boots perfect for any occasion. These boots are made from premium leather and feature a durable sole that will last for years.",
      category: "shoes",
      image: "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 15
    },
    {
      id: 2,
      name: "Premium White T-Shirt",
      price: 39.99,
      description: "A premium white t-shirt made from 100% organic cotton. This t-shirt is breathable, comfortable, and perfect for everyday wear.",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw0fHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 25
    },
    {
      id: 3,
      name: "Designer Dress Shoes",
      price: 149.99,
      description: "Elegant dress shoes with a modern design. These shoes feature a sleek silhouette, premium leather uppers, and a comfortable insole.",
      category: "shoes",
      image: "https://images.unsplash.com/photo-1638953173691-671b6c2692fa?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwzfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 10
    },
    {
      id: 4,
      name: "Slim Fit Dress Shirt",
      price: 59.99,
      description: "A slim fit dress shirt perfect for formal occasions or business meetings. This shirt is made from high-quality cotton and features a modern cut.",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1603251578711-3290ca1a0187?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw2fHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 20
    },
    {
      id: 5,
      name: "Designer Sunglasses",
      price: 89.99,
      description: "Stylish designer sunglasses with UV protection. These sunglasses feature a classic design that complements any outfit.",
      category: "accessories",
      image: "https://images.unsplash.com/photo-1602810319250-a663f0af2f75?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw1fHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 15
    },
    {
      id: 6,
      name: "Casual Sweater",
      price: 69.99,
      description: "A comfortable casual sweater perfect for cooler days. This sweater is made from a soft wool blend and features a relaxed fit.",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwyfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 12
    },
    {
      id: 7,
      name: "Hotel Embroidered T-Shirt",
      price: 49.99,
      description: "Minimalist design with embroidered text on 100% cotton. Perfect for a casual yet distinctive look.",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw3fHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 18
    },
    {
      id: 8,
      name: "Essential White Crew Neck",
      price: 34.99,
      description: "A versatile crew neck t-shirt that works with any outfit. Made from premium cotton with a comfortable fit.",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw4fHxmYXNoaW9uJTIwY2xvdGhpbmclMjBwcm9kdWN0c3xlbnwwfHx8fDE3NDUwNjQwMDF8MA&ixlib=rb-4.0.3&fit=fillmax&h=600&w=800",
      stock: 22
    }
  ],
  orders: [],
  users: [
    {
      id: 1,
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // In a real app, this would be hashed
      role: "admin",
      created: new Date().toISOString()
    }
  ],
  contact: []
};

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(join(__dirname, '/')));

// API routes
// Get all products
app.get('/api/products', (req, res) => {
  res.json({
    success: true,
    data: db.products
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = db.products.find(p => p.id === productId);
  
  if (product) {
    res.json({
      success: true,
      data: product
    });
  } else {
    res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
});

// Add product
app.post('/api/products', (req, res) => {
  const { name, price, description, category, image, stock } = req.body;
  
  if (!name || !price || !description || !category || !image) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  const newProduct = {
    id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
    name,
    price: parseFloat(price),
    description,
    category,
    image,
    stock: stock || 0
  };
  
  db.products.push(newProduct);
  
  res.status(201).json({
    success: true,
    data: newProduct
  });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = db.products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  const { name, price, description, category, image, stock } = req.body;
  
  if (!name || !price || !description || !category || !image) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields'
    });
  }
  
  const updatedProduct = {
    ...db.products[productIndex],
    name,
    price: parseFloat(price),
    description,
    category,
    image,
    stock: stock !== undefined ? stock : db.products[productIndex].stock
  };
  
  db.products[productIndex] = updatedProduct;
  
  res.json({
    success: true,
    data: updatedProduct
  });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const productIndex = db.products.findIndex(p => p.id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Product not found'
    });
  }
  
  db.products.splice(productIndex, 1);
  
  res.json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Checkout
app.post('/api/checkout', (req, res) => {
  const { items } = req.body;
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid cart items'
    });
  }
  
  // Check stock availability
  for (const item of items) {
    const product = db.products.find(p => p.id === item.product.id);
    if (!product) {
      return res.status(400).json({
        success: false,
        error: `Product ${item.product.name} not found`
      });
    }
    
    if (product.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        error: `Not enough stock for ${product.name}. Available: ${product.stock}`
      });
    }
  }
  
  // Update stock
  items.forEach(item => {
    const product = db.products.find(p => p.id === item.product.id);
    product.stock -= item.quantity;
  });
  
  // Create order
  const order = {
    id: db.orders.length + 1,
    items,
    total: items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
    date: new Date().toISOString(),
    status: 'pending'
  };
  
  db.orders.push(order);
  
  res.json({
    success: true,
    data: {
      orderId: order.id
    }
  });
});

// Get all orders
app.get('/api/orders', (req, res) => {
  res.json({
    success: true,
    data: db.orders
  });
});

// Contact form
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    });
  }
  
  const contact = {
    id: db.contact.length + 1,
    name,
    email,
    message,
    date: new Date().toISOString()
  };
  
  db.contact.push(contact);
  
  res.json({
    success: true,
    message: 'Message sent successfully'
  });
});

// User registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    });
  }
  
  // Check if user already exists
  if (db.users.some(user => user.email === email)) {
    return res.status(400).json({
      success: false,
      error: 'User already exists'
    });
  }
  
  const user = {
    id: db.users.length + 1,
    name,
    email,
    password, // In a real app, this would be hashed
    role: 'customer',
    created: new Date().toISOString()
  };
  
  db.users.push(user);
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }
  
  const user = db.users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 