
const UserManagementUseCase = require('../../application/use-cases/UserManagementUseCase');
const MongoUserRepository = require('../../infrastructure/repositories/MongoUserRepository');

class UserController {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.userManagementUseCase = new UserManagementUseCase(this.userRepository);
  }

  /**
   * @desc    Get all users
   * @route   GET /api/users
   * @access  Private (Admin only)
   */
  async getAllUsers(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        status: req.query.status,
        search: req.query.search,
        limit: parseInt(req.query.limit) || 100
      };

      const users = await this.userManagementUseCase.getAllUsers(filters, req.user);

      res.status(200).json({
        success: true,
        count: users.length,
        data: users
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get single user by ID
   * @route   GET /api/users/:id
   * @access  Private
   */
  async getUserById(req, res, next) {
    try {
      const user = await this.userManagementUseCase.getUserById(req.params.id, req.user);

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Update user
   * @route   PUT /api/users/:id
   * @access  Private
   */
  async updateUser(req, res, next) {
    try {
      const updatedUser = await this.userManagementUseCase.updateUser(
        req.params.id,
        req.body,
        req.user
      );

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Delete user
   * @route   DELETE /api/users/:id
   * @access  Private (Admin only)
   */
  async deleteUser(req, res, next) {
    try {
      const result = await this.userManagementUseCase.deleteUser(req.params.id, req.user);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get user statistics
   * @route   GET /api/users/stats
   * @access  Private (Admin only)
   */
  async getUserStats(req, res, next) {
    try {
      const stats = await this.userManagementUseCase.getUserStats(req.user);

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
