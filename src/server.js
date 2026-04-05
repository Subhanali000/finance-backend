
require('dotenv').config();
const app = require('./app');
const connectDB = require('./infrastructure/database/connection');

// Configuration
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log('================================');
      console.log(' Finance Backend Server Started');
      console.log('================================');
      console.log(`Environment: ${NODE_ENV}`);
      console.log(` Server: http://localhost:${PORT}`);
      console.log(` API Docs: http://localhost:${PORT}/api-docs`);
      console.log(` Health Check: http://localhost:${PORT}/health`);
      console.log('================================');
      //Kindly chnage the development url into http://localhost:5000
      if (NODE_ENV === 'development') {
        console.log('\n Quick Start:');
        console.log('   1. Register: POST https://finance-backend-hmcg.onrender.com/api/auth/register');
        console.log('   2. Login: POST https://finance-backend-hmcg.onrender.com/api/auth/login');
        console.log('   3. Use token in Authorization: Bearer <token>');
        console.log('\n See API documentation at: https://finance-backend-hmcg.onrender.com/api-docs\n');
      }
    });

  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(' Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
