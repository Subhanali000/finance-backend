

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const UserModel = require('../infrastructure/database/models/UserModel');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📊 Connected to MongoDB');

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@finance.com';
    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log(`📧 Email: ${adminEmail}`);
      process.exit(0);
    }

    // Hash password
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const admin = new UserModel({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('================================');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
