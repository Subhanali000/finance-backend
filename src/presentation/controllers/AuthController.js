

const AuthenticationUseCase = require('../../application/use-cases/AuthenticationUseCase');
const MongoUserRepository = require('../../infrastructure/repositories/MongoUserRepository');

class AuthController {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.authUseCase = new AuthenticationUseCase(this.userRepository);
  }

  /**
   * @desc    Register new user
   * @route   POST /api/auth/register
   * @access  Public
   */
  async register(req, res, next) {
    try {
      const result = await this.authUseCase.register(req.body);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Login user
   * @route   POST /api/auth/login
   * @access  Public
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.authUseCase.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get current user profile
   * @route   GET /api/auth/me
   * @access  Private
   */
  async getProfile(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user.toJSON()
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
