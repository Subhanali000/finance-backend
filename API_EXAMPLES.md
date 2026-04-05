# API Usage Examples

Complete examples for testing all endpoints.

## Authentication Flow

### 1. Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Alice Johnson",
  "email": "alice@example.com",
  "password": "SecurePass123",
  "role": "admin"
}

# Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "alice@example.com",
  "password": "SecurePass123"
}

# Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Current User Profile
```bash
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "status": "active"
    }
  }
}
```

## Financial Records

### 1. Create Income Record
```bash
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2024-01-15",
  "description": "Monthly salary payment",
  "notes": "Regular monthly income"
}

# Response:
{
  "success": true,
  "message": "Financial record created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15T00:00:00.000Z",
    "description": "Monthly salary payment",
    "notes": "Regular monthly income",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. Create Expense Record
```bash
POST /api/records
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1200,
  "type": "expense",
  "category": "Rent",
  "date": "2024-01-05",
  "description": "Monthly apartment rent"
}
```

### 3. Get All Records (with filters)
```bash
# Get all records
GET /api/records
Authorization: Bearer <token>

# Filter by type
GET /api/records?type=income
Authorization: Bearer <token>

# Filter by date range
GET /api/records?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

# Filter by category
GET /api/records?category=Salary
Authorization: Bearer <token>

# Combine filters
GET /api/records?type=expense&startDate=2024-01-01&limit=50
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "count": 25,
  "data": [
    {
      "id": "507f1f77bcf86cd799439012",
      "amount": 5000,
      "type": "income",
      "category": "Salary",
      ...
    },
    ...
  ]
}
```

### 4. Get Single Record
```bash
GET /api/records/507f1f77bcf86cd799439012
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "amount": 5000,
    "type": "income",
    ...
  }
}
```

### 5. Update Record
```bash
PUT /api/records/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5500,
  "description": "Updated salary with bonus"
}

# Response:
{
  "success": true,
  "message": "Financial record updated successfully",
  "data": { ... }
}
```

### 6. Delete Record
```bash
DELETE /api/records/507f1f77bcf86cd799439012
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "message": "Financial record deleted successfully"
}
```

### 7. Get Recent Activity
```bash
GET /api/records/recent?limit=10
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

## Dashboard Analytics

### 1. Get Dashboard Summary
```bash
# Current summary
GET /api/dashboard/summary
Authorization: Bearer <token>

# Summary for date range
GET /api/dashboard/summary?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "totalIncome": 15000,
    "totalExpenses": 8500,
    "netBalance": 6500,
    "transactionCount": 45,
    "categoryBreakdown": {
      "income": [
        { "category": "Salary", "total": 12000, "count": 3 },
        { "category": "Freelance", "total": 3000, "count": 5 }
      ],
      "expenses": [
        { "category": "Rent", "total": 3600, "count": 3 },
        { "category": "Food", "total": 2000, "count": 15 },
        { "category": "Transport", "total": 1500, "count": 10 }
      ]
    },
    "averageIncome": 3750,
    "averageExpense": 354.17
  }
}
```

### 2. Get Monthly Trends
```bash
# Last 6 months (default)
GET /api/dashboard/trends
Authorization: Bearer <token>

# Custom months
GET /api/dashboard/trends?months=12
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": [
    {
      "period": "2024-01",
      "income": 15000,
      "expenses": 8500,
      "net": 6500
    },
    {
      "period": "2024-02",
      "income": 16000,
      "expenses": 9000,
      "net": 7000
    },
    ...
  ]
}
```

### 3. Get Category Analysis
```bash
# All categories
GET /api/dashboard/categories
Authorization: Bearer <token>

# Only income categories
GET /api/dashboard/categories?type=income
Authorization: Bearer <token>

# Only expense categories
GET /api/dashboard/categories?type=expense
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "income": [
      { "category": "Salary", "total": 12000, "count": 3 },
      { "category": "Freelance", "total": 3000, "count": 5 }
    ],
    "expenses": [
      { "category": "Rent", "total": 3600, "count": 3 },
      { "category": "Food", "total": 2000, "count": 15 }
    ],
    "topIncomeCategory": { "category": "Salary", "total": 12000, "count": 3 },
    "topExpenseCategory": { "category": "Rent", "total": 3600, "count": 3 }
  }
}
```

### 4. Get Financial Health
```bash
GET /api/dashboard/health
Authorization: Bearer <token>

# Response:
{
  "success": true,
  "data": {
    "period": "Last 30 days",
    "totalIncome": 15000,
    "totalExpenses": 8500,
    "netSavings": 6500,
    "savingsRate": 43.33,
    "healthStatus": "excellent",
    "recommendations": [
      "Excellent savings rate! Keep up the good work.",
      "Consider investing surplus funds for long-term growth."
    ]
  }
}
```

## 👥 User Management

### 1. Get All Users (Admin only)
```bash
# All users
GET /api/users
Authorization: Bearer <admin-token>

# Filter by role
GET /api/users?role=analyst
Authorization: Bearer <admin-token>

# Filter by status
GET /api/users?status=active
Authorization: Bearer <admin-token>

# Search users
GET /api/users?search=john
Authorization: Bearer <admin-token>

# Response:
{
  "success": true,
  "count": 15,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "admin",
      "status": "active"
    },
    ...
  ]
}
```

### 2. Get User Statistics (Admin only)
```bash
GET /api/users/stats
Authorization: Bearer <admin-token>

# Response:
{
  "success": true,
  "data": {
    "total": 50,
    "active": 45,
    "inactive": 5,
    "byRole": {
      "admin": 5,
      "analyst": 15,
      "viewer": 30
    }
  }
}
```

### 3. Update User
```bash
PUT /api/users/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Alice Smith",
  "role": "analyst"
}

# Response:
{
  "success": true,
  "message": "User updated successfully",
  "data": { ... }
}
```

### 4. Delete User (Admin only)
```bash
DELETE /api/users/507f1f77bcf86cd799439013
Authorization: Bearer <admin-token>

# Response:
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "amount",
      "message": "Amount must be greater than 0"
    }
  ]
}
```

### Unauthorized
```json
{
  "success": false,
  "message": "No token provided. Access denied."
}
```

### Forbidden
```json
{
  "success": false,
  "message": "Access denied. Required roles: admin"
}
```

### Not Found
```json
{
  "success": false,
  "message": "Financial record not found"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## Complete Workflow Example

### Scenario: New user creates records and views dashboard

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Bob Smith","email":"bob@example.com","password":"BobPass123","role":"admin"}'

# Save the token from response

# 2. Create income record
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"amount":5000,"type":"income","category":"Salary","date":"2024-01-15"}'

# 3. Create expense record
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"amount":1200,"type":"expense","category":"Rent","date":"2024-01-05"}'

# 4. View all records
curl -X GET http://localhost:5000/api/records \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# 5. View dashboard summary
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <YOUR_TOKEN>"

# 6. View monthly trends
curl -X GET http://localhost:5000/api/dashboard/trends \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
