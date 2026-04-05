

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Data Processing API',
      version: '1.0.0',
      description: `
Backend API for Finance Dashboard with Role-Based Access Control.

⚠️ Notes:
- By default, a newly registered user is assigned the "viewer" role.
- To test different roles (e.g., admin), you can modify the role manually in:
  src/presentation/route/authRoute.js
- If a user is already registered, please use the login route instead of registering again.
- 📧 Contact: <a href="mailto:subhanali.ali000777@gmail.com">subhanali.ali000777@gmail.com</a>
- 📞 Phone: +91-8743094186

      `
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://finance-backend-hmcg.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['admin', 'analyst', 'viewer'], example: 'viewer' },
            status: { type: 'string', enum: ['active', 'inactive'], example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        FinancialRecord: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            amount: { type: 'number', example: 1500.50 },
            type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
            category: { type: 'string', example: 'Salary' },
            date: { type: 'string', format: 'date-time' },
            description: { type: 'string', example: 'Monthly salary payment' },
            notes: { type: 'string', example: 'Additional notes' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization'
      },
      {
        name: 'Users',
        description: 'User management operations'
      },
      {
        name: 'Financial Records',
        description: 'Financial record CRUD operations'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard analytics and insights'
      }
    ]
  },
  apis: ['./src/presentation/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi
};
