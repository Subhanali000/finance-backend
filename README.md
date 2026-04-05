# Finance Data Processing and Access Control Backend

A robust backend system for finance dashboard with role-based access control, built using **Clean Architecture** principles.

## Project Overview

This backend system provides a complete solution for managing financial records with user authentication, role-based authorization, and comprehensive analytics dashboard. Built with Node.js, Express, and MongoDB.

## Key Features

### 1. **User & Role Management**
- User registration and authentication with JWT
- Three role types: **Admin**, **Analyst**, **Viewer**
- Role-based access control (RBAC) for all endpoints
- User status management (active/inactive)

### 2. **Financial Records Management**
- Complete CRUD operations for financial records
- Support for income and expense tracking
- Category-based organization
- Date-based filtering
- Rich metadata (description, notes, timestamps)

### 3. **Dashboard Analytics**
- **Summary Dashboard**: Total income, expenses, net balance
- **Category Breakdown**: Income and expense by category
- **Monthly Trends**: 6-month trend analysis
- **Financial Health**: Savings rate and recommendations
- Real-time aggregated data

### 4. **Access Control**
- **Admin**: Full system access - can create, edit, delete records and manage users
- **Analyst**: Can view all records and access dashboard analytics
- **Viewer**: Read-only access to records

### 5. **Security & Validation**
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting for API protection
- Helmet.js for security headers
- CORS configuration


## Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/
├── domain/              # Business logic (framework-independent)
│   ├── entities/        # User, FinancialRecord entities
│   └── repositories/    # Repository interfaces
├── application/         # Use cases (business logic orchestration)
│   └── use-cases/       # Authentication, User, Record, Dashboard use cases
├── infrastructure/      # External dependencies
│   ├── database/        # MongoDB models and connection
│   └── repositories/    # MongoDB repository implementations
├── presentation/        # API layer
│   ├── controllers/     # HTTP controllers
│   ├── routes/          # Express routes
│   └── middleware/      # Auth, validation, error handling
├── config/              # Configuration files
├── scripts/             # Utility scripts
├── app.js               # Express app setup
└── server.js            # Server entry point
```

### Architecture Layers:

1. **Domain Layer**: Pure business logic, no framework dependencies
2. **Application Layer**: Use cases that orchestrate business logic
3. **Infrastructure Layer**: Database, external services implementations
4. **Presentation Layer**: HTTP API, controllers, routes, middleware

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd finance-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=5000
NODE_ENV=development
```
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/finance-db

# JWT Configuration
JWT_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWV9.TJVA95OrM7E2cBab30RMHrHDcEfxjoYZgeFONFh7HgQ"
JWT_EXPIRE=7d

# Admin User
ADMIN_EMAIL=admin@finance.com
ADMIN_PASSWORD=Admin@123
```

4. **Start MongoDB** (if using local MongoDB)
```bash
mongod
```

5. **Create initial admin user**
```bash
node src/scripts/seedAdmin.js
```

6. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## API Documentation

Once the server is running, access the interactive API documentation at:
```
http://localhost:5000/api-docs
```

### Quick API Overview

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

#### User Management Endpoints
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)
- `GET /api/users/stats` - Get user statistics (Admin only)

#### Financial Records Endpoints
- `POST /api/records` - Create record (Admin only)
- `GET /api/records` - Get all records (with filters)
- `GET /api/records/:id` - Get record by ID
- `PUT /api/records/:id` - Update record (Admin only)
- `DELETE /api/records/:id` - Delete record (Admin only)
- `GET /api/records/recent` - Get recent activity

#### Dashboard Endpoints
- `GET /api/dashboard/summary` - Get summary (Admin, Analyst)
- `GET /api/dashboard/trends` - Get monthly trends (Admin, Analyst)
- `GET /api/dashboard/categories` - Get category analysis (Admin, Analyst)
- `GET /api/dashboard/health` - Get financial health (Admin, Analyst)

## Testing the API

### Using Swagger UI
1. Go to `http://localhost:5000/api-docs`
2. Use the "Authorize" button to add your JWT token
3. Try out endpoints directly from the browser

### Using cURL

**1. Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

**2. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**3. Create a financial record:**
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2024-01-15"
  }'
```

**4. Get dashboard summary:**
```bash
curl -X GET "http://localhost:5000/api/dashboard/summary" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman

Import the following collection structure:

1. Create a new collection "Finance API"
2. Set base URL: `http://localhost:5000`
3. Add Authorization header: `Bearer {{token}}`
4. Add endpoints as shown in API documentation


## Database Schema

### Users Collection
```javascript
{
  name: String (required, min: 2 chars),
  email: String (required, unique, valid email),
  password: String (required, hashed, min: 6 chars),
  role: String (enum: ['admin', 'analyst', 'viewer']),
  status: String (enum: ['active', 'inactive']),
  createdAt: Date,
  updatedAt: Date
}
```

### Financial Records Collection
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number (required, min: 0.01),
  type: String (enum: ['income', 'expense']),
  category: String (required),
  date: Date (required),
  description: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against brute-force attacks
- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin resource sharing
- **Error Handling**: Centralized error handling with appropriate status codes

## Project Structure Details

### Key Components

**Domain Entities**: Pure business objects with validation logic
- `User.js`: User entity with role-based business rules
- `FinancialRecord.js`: Financial record entity with validation

**Use Cases**: Business logic orchestration
- `AuthenticationUseCase.js`: Registration, login, JWT generation
- `UserManagementUseCase.js`: User CRUD with authorization
- `FinancialRecordUseCase.js`: Record management with access control
- `DashboardUseCase.js`: Analytics and aggregation logic

**Repositories**: Data access abstraction
- Interface definitions in `domain/repositories`
- MongoDB implementations in `infrastructure/repositories`

**Controllers**: HTTP request handling
- Thin layer that delegates to use cases
- Handles HTTP-specific concerns

**Middleware**:
- `authMiddleware.js`: JWT verification and role checking
- `validation.js`: Request validation
- `errorHandler.js`: Centralized error handling



## Testing

To run tests (when implemented):
```bash
npm test
```

## Design Decisions & Assumptions

### Assumptions Made:
1. **Single currency**: All amounts are in the same currency
2. **User creation**: New users can self-register, role defaults to 'viewer'
3. **Record ownership**: Records are tied to the user who created them
4. **Date handling**: All dates are stored in UTC
5. **Soft delete**: Not implemented - records are permanently deleted

### Design Choices:
1. **Clean Architecture**: Chosen for maintainability and testability
2. **MongoDB**: NoSQL for flexible schema and easy scaling
3. **JWT**: Stateless authentication for scalability
4. **Express.js**: Mature, well-documented framework
5. **Repository Pattern**: Abstraction over data access for flexibility

## Future Enhancements

Potential improvements for production:
- [ ] Unit and integration tests
- [ ] Soft delete functionality
- [ ] Audit logging
- [ ] File attachments for records
- [ ] Export to CSV/PDF
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] Refresh token mechanism
- [ ] Caching with Redis
- [ ] Docker containerization

## License

ISC

## Author

**Subhan Ali**
- Email: subhanali.ali000777@gmail.com

## Acknowledgments

Built as an assignment for Zorvyn FinTech Backend Developer Internship

---

**Note**: This is an assessment project demonstrating backend development skills, not production-ready software. Additional hardening would be required for production deployment.
