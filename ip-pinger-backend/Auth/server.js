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
const SESSION_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

// User Schema with 5-minute session expiry
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
  sessions: [{
    token: String,
    createdAt: { 
      type: Date, 
      default: Date.now,
      expires: 300 // 5 minutes in seconds
    }
  }]
});

const User = mongoose.model('User', userSchema);

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if token exists in user's sessions
    const user = await User.findOne({
      _id: decoded.userId,
      'sessions.token': token
    });

    if (!user) {
      console.log(`Session not found for user ${decoded.userId}`);
      return res.status(401).json({ message: 'Session expired or invalid' });
    }

    // Check if session is within 5 minutes
    const session = user.sessions.find(s => s.token === token);
    const sessionAge = Date.now() - session.createdAt;
    
    if (sessionAge > SESSION_DURATION) {
      console.log(`Session expired for user ${decoded.userId}. Age: ${sessionAge}ms`);
      // Remove expired session
      await User.updateOne(
        { _id: decoded.userId },
        { $pull: { sessions: { token: token } } }
      );
      return res.status(401).json({ message: 'Session expired' });
    }

    console.log(`Valid session for user ${decoded.userId}. Session age: ${sessionAge}ms`);
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
      password: hashedPassword,
      sessions: []
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
      { expiresIn: '5m' } // JWT expiration set to 5 minutes
    );

    // Add new session
    user.sessions.push({ token, createdAt: new Date() });
    await user.save();

    console.log(`User logged in: ${username}`);
    console.log(`Session started at: ${new Date().toISOString()}`);
    console.log(`Session will expire at: ${new Date(Date.now() + SESSION_DURATION).toISOString()}`);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username
      },
      expiresIn: SESSION_DURATION // Send expiration time to client
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
    
    await User.updateOne(
      { _id: req.user.userId },
      { $pull: { sessions: { token: token } } }
    );

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
// Clean up expired sessions every minute
setInterval(async () => {
  try {
    const result = await User.updateMany(
      {},
      { $pull: { sessions: { createdAt: { $lt: new Date(Date.now() - SESSION_DURATION) } } } }
    );
    console.log(`Cleaned up expired sessions at ${new Date().toISOString()}`);
    console.log(`Modified ${result.modifiedCount} users`);
  } catch (error) {
    console.error('Session cleanup error:', error);
  }
}, 60000); // Run every minute

app.listen(22000, () => {
  console.log('Server is running on port 22000');
  console.log(`Session duration set to ${SESSION_DURATION/1000} seconds`);
});