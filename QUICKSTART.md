# Quick Start Guide

Get the Finance Backend API running in 5 minutes!

## Prerequisites

- Node.js (v14+) installed
- MongoDB installed locally OR MongoDB Atlas account
- Terminal/Command Prompt

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Environment

The `.env` file is already created with default values. For local development, you can use it as-is.

**Default Configuration:**
- Port: `5000`
- Database: `mongodb://localhost:27017/finance-db` (local MongoDB)
- Admin Email: `admin@finance.com`
- Admin Password: `Admin@123`

### Option A: Use Local MongoDB

Make sure MongoDB is running:
mongod

# Windows
# Start MongoDB service from Services


## Step 3: Create Admin User

```bash
npm run seed-admin
```

You should see:
```
 Admin user created successfully!
 Email: admin@finance.com
 Password: Admin@123
```

## Step 4: Start Server

```bash
# Development mode (auto-reload)
npm run dev

# Production mode
npm start
```

You should see:
```
 Finance Backend Server Started
 Server: http://localhost:5000
 API Docs: http://localhost:5000/api-docs
```

## Step 5: Test It!

### Option A: Open Browser

1. Go to: http://localhost:5000
2. You should see welcome message

### Option B: Use cURL

```bash
# Health check
curl http://localhost:5000/health

# Login as admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"Admin@123"}'
```

### Option C: Use API Documentation

1. Open: http://localhost:5000/api-docs
2. Click "Authorize" button
3. Login to get JWT token
4. Use token to test endpoints

##  What's Next?

### 1. Explore API Documentation
Visit http://localhost:5000/api-docs to see all available endpoints

### 2. Create Your First Record

```bash
# First, login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"Admin@123"}'

# Use the token to create a record
curl -X POST http://localhost:5000/api/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-01-15",
    "description": "Monthly salary"
  }'
```

### 3. View Dashboard

```bash
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

##  Learn More

- **Full Documentation**: See `README.md`
- **API Examples**: See `API_EXAMPLES.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

##  Common Issues

### Issue: Port 5000 already in use
**Solution**: Change port in `.env`
```env
PORT=3000
```

### Issue: Module not found
**Solution**: Reinstall dependencies
npm install


##  Success!

Your Finance Backend API is now running!

**Default Admin Credentials:**
- Email: `admin@finance.com`
- Password: `Admin@123`

 **Important**: Change the admin password after first login!

---

**Need Help?** Check the full README.md or API documentation at http://localhost:5000/api-docs
