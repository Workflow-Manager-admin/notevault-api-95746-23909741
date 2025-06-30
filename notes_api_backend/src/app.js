const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { connectDB } = require('./services/db');

// Initialize express app
const app = express();

/**
 * Tries to connect to MongoDB before allowing requests to be handled.
 * If connection fails, server should not proceed.
 */
let mongoConnected = false;

// Attempt DB connection at app startup; block requests if not connected.
(async () => {
  try {
    await connectDB();
    mongoConnected = true;
  } catch (err) {
    console.error('Failed to connect to MongoDB on startup:', err);
    // The app will still start up, but reject requests with 503.
    mongoConnected = false;
  }
})();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${req.protocol}://${req.get('host')}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

// Block all routes if not connected to DB
app.use((req, res, next) => {
  if (!mongoConnected) {
    return res.status(503).json({
      status: 'error',
      message: 'Service unavailable: Could not connect to database'
    });
  }
  next();
});

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

module.exports = app;
