require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');
const socketIO = require('socket.io');
require('express-async-errors');

const sequelize = require('./config/sequelize');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const traceabilityRoutes = require('./routes/traceabilityRoutes');
const iotRoutes = require('./routes/iotRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const productionRoutes = require('./routes/productionRoutes');
const productionRoutes2 = require('./routes/productionRoutes2');
const qualityMaintenanceRoutes = require('./routes/qualityMaintenanceRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// WebSocket for real-time IoT data
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('sensor-update', (data) => {
    io.emit('sensor-data', data);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/traceability', traceabilityRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/production', productionRoutes);
app.use('/api', productionRoutes2);
app.use('/api', qualityMaintenanceRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Atlas SmartFactory API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      traceability: '/api/traceability',
      iot: '/api/iot',
      health: '/health'
    },
    frontend: 'http://localhost:3000'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'API running', timestamp: new Date() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

// Initialize database and seed test users
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Drop and recreate the database on startup
    await sequelize.sync({ force: true });
    console.log('✓ Database synced');

    // Seed test users if they don't exist
    const testUsers = [
      {
        email: 'operator@atlas.com',
        password: 'atlas123',
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'operator',
        department: 'Production',
        active: true,
      },
      {
        email: 'director@atlas.com',
        password: 'atlas123',
        firstName: 'Marie',
        lastName: 'Martin',
        role: 'director',
        department: 'Management',
        active: true,
      },
      {
        email: 'quality@atlas.com',
        password: 'atlas123',
        firstName: 'Pierre',
        lastName: 'Bernard',
        role: 'quality_manager',
        department: 'Quality Control',
        active: true,
      },
      {
        email: 'tech@atlas.com',
        password: 'atlas123',
        firstName: 'Sophie',
        lastName: 'Leclerc',
        role: 'technician',
        department: 'Maintenance',
        active: true,
      },
    ];

    console.log('Creating test users...');
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✓ Created user: ${userData.email}`);
      } else {
        console.log(`✓ User already exists: ${userData.email}`);
      }
    }

    console.log('✓ Database initialization complete');
  } catch (error) {
    console.error('✗ Database initialization error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  await initializeDatabase();
  server.listen(PORT, () => {
    console.log(`\n🚀 Atlas SmartFactory API running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
  });
};

startServer();

module.exports = { app, io };
