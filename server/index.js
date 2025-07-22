import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'volunteer_platform_secret_key_2024';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage (in production, use a proper database)
let users = [];
let services = [
  {
    id: '1',
    name: 'Food Bank Distribution',
    description: 'Help distribute food to families in need',
    location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
    category: 'Community Support',
    volunteersNeeded: 5,
    date: '2024-01-15',
    time: '09:00',
    organizer: 'NYC Food Bank',
    requirements: ['Physical ability', 'Compassion'],
    image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '2',
    name: 'Beach Cleanup Initiative',
    description: 'Join us in cleaning up the local beach and protecting marine life',
    location: { lat: 34.0522, lng: -118.2437, address: 'Los Angeles, CA' },
    category: 'Environmental',
    volunteersNeeded: 15,
    date: '2024-01-20',
    time: '08:00',
    organizer: 'Ocean Conservation Group',
    requirements: ['Physical fitness', 'Environmental awareness'],
    image: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '3',
    name: 'Senior Center Activities',
    description: 'Spend time with seniors and assist with daily activities',
    location: { lat: 41.8781, lng: -87.6298, address: 'Chicago, IL' },
    category: 'Elder Care',
    volunteersNeeded: 8,
    date: '2024-01-18',
    time: '14:00',
    organizer: 'Golden Years Center',
    requirements: ['Patience', 'Communication skills'],
    image: 'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  {
    id: '4',
    name: 'Youth Tutoring Program',
    description: 'Help local students with homework and reading skills',
    location: { lat: 39.9526, lng: -75.1652, address: 'Philadelphia, PA' },
    category: 'Education',
    volunteersNeeded: 10,
    date: '2024-01-22',
    time: '16:00',
    organizer: 'Community Learning Center',
    requirements: ['Teaching experience preferred', 'Background check required'],
    image: 'https://images.pexels.com/photos/8617741/pexels-photo-8617741.jpeg?auto=compress&cs=tinysrgb&w=500'
  }
];
let messages = [];

// Helper function to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, skills, interests, location, phone } = req.body;
    
    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      skills: skills || [],
      interests: interests || [],
      location: location || '',
      phone: phone || '',
      joinedDate: new Date().toISOString(),
      profileImage: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`
    };

    users.push(user);

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { ...user, password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login successful',
      token,
      user: { ...user, password: undefined }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Protected Routes
app.get('/api/profile', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ ...user, password: undefined });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ ...users[userIndex], password: undefined });
});

// Service Routes
app.get('/api/services', (req, res) => {
  const { category, location, search } = req.query;
  let filteredServices = [...services];

  if (category && category !== 'all') {
    filteredServices = filteredServices.filter(service => 
      service.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    filteredServices = filteredServices.filter(service =>
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredServices);
});

app.post('/api/services', authenticateToken, (req, res) => {
  const newService = {
    id: uuidv4(),
    ...req.body,
    createdBy: req.user.id
  };
  services.push(newService);
  res.status(201).json(newService);
});

// Volunteer Routes
app.get('/api/volunteers', authenticateToken, (req, res) => {
  const volunteers = users.map(user => ({ ...user, password: undefined }));
  res.json(volunteers);
});

app.post('/api/volunteer-for-service/:serviceId', authenticateToken, (req, res) => {
  const serviceIndex = services.findIndex(s => s.id === req.params.serviceId);
  if (serviceIndex === -1) {
    return res.status(404).json({ message: 'Service not found' });
  }

  // Add volunteer to service (in a real app, you'd have a separate volunteers table)
  services[serviceIndex].volunteers = services[serviceIndex].volunteers || [];
  if (!services[serviceIndex].volunteers.includes(req.user.id)) {
    services[serviceIndex].volunteers.push(req.user.id);
    services[serviceIndex].volunteersNeeded = Math.max(0, services[serviceIndex].volunteersNeeded - 1);
  }

  res.json({ message: 'Successfully volunteered for service' });
});

// Message Routes
app.get('/api/messages', authenticateToken, (req, res) => {
  const userMessages = messages.filter(
    msg => msg.receiverId === req.user.id || msg.senderId === req.user.id
  );
  res.json(userMessages);
});

app.post('/api/messages', authenticateToken, (req, res) => {
  const newMessage = {
    id: uuidv4(),
    senderId: req.user.id,
    receiverId: req.body.receiverId,
    content: req.body.content,
    timestamp: new Date().toISOString(),
    read: false
  };
  messages.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});