

class User {
  constructor({
    id,
    name,
    email,
    password,
    role,
    status,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role || 'viewer';
    this.status = status || 'active';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Business rules
  isActive() {
    return this.status === 'active';
  }

  isAdmin() {
    return this.role === 'admin';
  }

  isAnalyst() {
    return this.role === 'analyst';
  }

  isViewer() {
    return this.role === 'viewer';
  }

  canCreateRecords() {
    return this.role === 'admin';
  }

  canEditRecords() {
    return this.role === 'admin';
  }

  canDeleteRecords() {
    return this.role === 'admin';
  }

  canViewRecords() {
    return ['admin', 'analyst', 'viewer'].includes(this.role);
  }

  canAccessDashboard() {
    return ['admin', 'analyst'].includes(this.role);
  }

  canManageUsers() {
    return this.role === 'admin';
  }

  // Validation
  validate() {
    const errors = [];

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!this.email || !this.isValidEmail(this.email)) {
      errors.push('Invalid email address');
    }

    if (!['admin', 'analyst', 'viewer'].includes(this.role)) {
      errors.push('Invalid role. Must be admin, analyst, or viewer');
    }

    if (!['active', 'inactive'].includes(this.status)) {
      errors.push('Invalid status. Must be active or inactive');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // To plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;
