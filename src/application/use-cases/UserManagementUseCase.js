
const bcrypt = require('bcryptjs');
const User = require('../../domain/entities/User');

class UserManagementUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers(filters = {}, currentUser) {
    // Only admins can view all users
    if (!currentUser.isAdmin()) {
      throw new Error('Unauthorized: Only admins can view all users');
    }

    const users = await this.userRepository.findAll(filters);
    return users.map(user => user.toJSON());
  }

  async getUserById(userId, currentUser) {
    // Users can view their own profile, admins can view any profile
    if (userId !== currentUser.id && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: You can only view your own profile');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  async updateUser(userId, updateData, currentUser) {
    // Users can update their own profile, admins can update any profile
    if (userId !== currentUser.id && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: You can only update your own profile');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Prevent non-admins from changing roles
    if (updateData.role && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: Only admins can change user roles');
    }

    // Prevent non-admins from changing status
    if (updateData.status && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: Only admins can change user status');
    }

    // Update allowed fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email.toLowerCase();
    if (updateData.role && currentUser.isAdmin()) user.role = updateData.role;
    if (updateData.status && currentUser.isAdmin()) user.status = updateData.status;

    // If password is being updated
    if (updateData.password) {
      if (updateData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(updateData.password, salt);
    }

    // Validate updated user
    const validation = user.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    user.updatedAt = new Date();
    const updatedUser = await this.userRepository.update(userId, user);
    return updatedUser.toJSON();
  }

  async deleteUser(userId, currentUser) {
    // Only admins can delete users
    if (!currentUser.isAdmin()) {
      throw new Error('Unauthorized: Only admins can delete users');
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      throw new Error('You cannot delete your own account');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  async getUserStats(currentUser) {
    // Only admins can view user stats
    if (!currentUser.isAdmin()) {
      throw new Error('Unauthorized: Only admins can view user statistics');
    }

    const totalUsers = await this.userRepository.count({});
    const activeUsers = await this.userRepository.count({ status: 'active' });
    const inactiveUsers = await this.userRepository.count({ status: 'inactive' });
    const adminCount = await this.userRepository.count({ role: 'admin' });
    const analystCount = await this.userRepository.count({ role: 'analyst' });
    const viewerCount = await this.userRepository.count({ role: 'viewer' });

    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      byRole: {
        admin: adminCount,
        analyst: analystCount,
        viewer: viewerCount
      }
    };
  }
}

module.exports = UserManagementUseCase;
