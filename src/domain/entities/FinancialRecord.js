

class FinancialRecord {
  constructor({
    id,
    userId,
    amount,
    type,
    category,
    date,
    description,
    notes,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.userId = userId;
    this.amount = amount;
    this.type = type; // 'income' or 'expense'
    this.category = category;
    this.date = date || new Date();
    this.description = description || '';
    this.notes = notes || '';
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Business rules
  isIncome() {
    return this.type === 'income';
  }

  isExpense() {
    return this.type === 'expense';
  }

  getFormattedAmount() {
    return this.isIncome() ? `+${this.amount}` : `-${this.amount}`;
  }

  // Validation
  validate() {
    const errors = [];

    if (!this.amount || this.amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!['income', 'expense'].includes(this.type)) {
      errors.push('Type must be either income or expense');
    }

    if (!this.category || this.category.trim().length < 2) {
      errors.push('Category must be at least 2 characters long');
    }

    if (!this.date || !(this.date instanceof Date) || isNaN(this.date)) {
      errors.push('Invalid date');
    }

    if (!this.userId) {
      errors.push('User ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // To plain object
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      amount: this.amount,
      type: this.type,
      category: this.category,
      date: this.date,
      description: this.description,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = FinancialRecord;
