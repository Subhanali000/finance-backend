
class IUserRepository {
  async create(user) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByEmail(email) {
    throw new Error('Method not implemented');
  }

  async findAll(filters) {
    throw new Error('Method not implemented');
  }

  async update(id, userData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async count(filters) {
    throw new Error('Method not implemented');
  }
}

class IFinancialRecordRepository {
  async create(record) {
    throw new Error('Method not implemented');
  }

  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findAll(filters) {
    throw new Error('Method not implemented');
  }

  async update(id, recordData) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async count(filters) {
    throw new Error('Method not implemented');
  }

  async getAggregatedData(userId, filters) {
    throw new Error('Method not implemented');
  }

  async getCategoryTotals(userId, filters) {
    throw new Error('Method not implemented');
  }

  async getMonthlyTrends(userId, months) {
    throw new Error('Method not implemented');
  }
}

module.exports = {
  IUserRepository,
  IFinancialRecordRepository
};
