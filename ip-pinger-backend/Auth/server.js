const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const jwt = require('jsonwebtoken');
const app = express();

// Environment variables
const JWT_SECRET = 'your-secret-key-here';
const MONGODB_URI = 'mongodb://localhost:27017/auth_db';
const SESSION_DURATION = 365 * 24 * 60 * 60 * 1000; // 365 days in milliseconds

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  credentials: true,
}));

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Separate Schema for Sessions
const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: SESSION_DURATION / 1000 // TTL index in seconds
  }
});

// User Schema without sessions
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true // Ensures creation date can't be modified
  }
}, {
  timestamps: true // Adds updatedAt field
});

const User = mongoose.model('User', userSchema);
const Session = mongoose.model('Session', sessionSchema);

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if session exists
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    // Verify user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    console.log(`Valid session for user ${user.username}`);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Registration endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword
    });

    await user.save();
    console.log(`User registered: ${username}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: '365d' }
    );

    // Create new session
    const session = new Session({
      userId: user._id,
      token
    });
    await session.save();

    console.log(`User logged in: ${username}`);
    console.log(`Session started at: ${new Date().toISOString()}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      },
      expiresIn: SESSION_DURATION
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Logout endpoint
app.post('/auth/logout', authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    
    // Remove the specific session
    await Session.deleteOne({ token });

    console.log(`User logged out: ${req.user.username}`);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: 'This is a protected route',
    user: req.user,
    accessTime: new Date().toISOString()
  });
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(22000, () => {
  console.log('Server is running on port 22000');
  console.log(`Session duration set to ${SESSION_DURATION / 1000} seconds`);
});