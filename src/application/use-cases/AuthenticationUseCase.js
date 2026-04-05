

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../domain/entities/User');

class AuthenticationUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    // Create user entity
    const user = new User({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'viewer',
      status: 'active'
    });

    // Validate user
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Validate password strength
    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(userData.password, salt);

    // Save user
    const savedUser = await this.userRepository.create(user);

    // Generate token
    const token = this.generateToken(savedUser);

    return {
      user: savedUser.toJSON(),
      token
    };
  }

  async login(email, password) {
    // Find user
    const user = await this.userRepository.findByEmail(email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive()) {
      throw new Error('Account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: user.toJSON(),
      token
    };
  }

  generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

module.exports = AuthenticationUseCase;
