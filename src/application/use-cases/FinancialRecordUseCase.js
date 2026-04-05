

const FinancialRecord = require('../../domain/entities/FinancialRecord');

class FinancialRecordUseCase {
  constructor(financialRecordRepository) {
    this.financialRecordRepository = financialRecordRepository;
  }

  async createRecord(recordData, currentUser) {
    // Only admins can create records
    if (!currentUser.canCreateRecords()) {
      throw new Error('Unauthorized: Only admins can create financial records');
    }

    // Create record entity
    const record = new FinancialRecord({
      userId: currentUser.id,
      amount: parseFloat(recordData.amount),
      type: recordData.type,
      category: recordData.category,
      date: recordData.date ? new Date(recordData.date) : new Date(),
      description: recordData.description || '',
      notes: recordData.notes || ''
    });

    // Validate record
    const validation = record.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Save record
    const savedRecord = await this.financialRecordRepository.create(record);
    return savedRecord.toJSON();
  }

  async getAllRecords(filters = {}, currentUser) {
    // All roles can view records
    if (!currentUser.canViewRecords()) {
      throw new Error('Unauthorized: You do not have permission to view records');
    }

    // Build filter object
    const queryFilters = {};

    // Filter by date range
    if (filters.startDate || filters.endDate) {
      queryFilters.date = {};
      if (filters.startDate) {
        queryFilters.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        queryFilters.date.$lte = new Date(filters.endDate);
      }
    }

    // Filter by type
    if (filters.type && ['income', 'expense'].includes(filters.type)) {
      queryFilters.type = filters.type;
    }

    // Filter by category
    if (filters.category) {
      queryFilters.category = filters.category;
    }

    // Filter by user (admins can see all, others see only their own)
    if (!currentUser.isAdmin()) {
      queryFilters.userId = currentUser.id;
    } else if (filters.userId) {
      queryFilters.userId = filters.userId;
    }

    const records = await this.financialRecordRepository.findAll(queryFilters);
    return records.map(record => record.toJSON());
  }

  async getRecordById(recordId, currentUser) {
    const record = await this.financialRecordRepository.findById(recordId);
    
    if (!record) {
      throw new Error('Financial record not found');
    }

    // Check authorization
    if (record.userId !== currentUser.id && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: You can only view your own records');
    }

    return record.toJSON();
  }

  async updateRecord(recordId, updateData, currentUser) {
    // Only admins can update records
    if (!currentUser.canEditRecords()) {
      throw new Error('Unauthorized: Only admins can update financial records');
    }

    const record = await this.financialRecordRepository.findById(recordId);
    
    if (!record) {
      throw new Error('Financial record not found');
    }

    // Check authorization
    if (record.userId !== currentUser.id && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: You can only update your own records');
    }

    // Update allowed fields
    if (updateData.amount !== undefined) {
      record.amount = parseFloat(updateData.amount);
    }
    if (updateData.type) record.type = updateData.type;
    if (updateData.category) record.category = updateData.category;
    if (updateData.date) record.date = new Date(updateData.date);
    if (updateData.description !== undefined) record.description = updateData.description;
    if (updateData.notes !== undefined) record.notes = updateData.notes;

    // Validate updated record
    const validation = record.validate();
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    record.updatedAt = new Date();
    const updatedRecord = await this.financialRecordRepository.update(recordId, record);
    return updatedRecord.toJSON();
  }

  async deleteRecord(recordId, currentUser) {
    // Only admins can delete records
    if (!currentUser.canDeleteRecords()) {
      throw new Error('Unauthorized: Only admins can delete financial records');
    }

    const record = await this.financialRecordRepository.findById(recordId);
    
    if (!record) {
      throw new Error('Financial record not found');
    }

    // Check authorization
    if (record.userId !== currentUser.id && !currentUser.isAdmin()) {
      throw new Error('Unauthorized: You can only delete your own records');
    }

    await this.financialRecordRepository.delete(recordId);
    return { message: 'Financial record deleted successfully' };
  }

  async getRecentActivity(limit = 10, currentUser) {
    const filters = {
      limit,
      sort: { createdAt: -1 }
    };

    // Non-admins can only see their own records
    if (!currentUser.isAdmin()) {
      filters.userId = currentUser.id;
    }

    const records = await this.financialRecordRepository.findAll(filters);
    return records.map(record => record.toJSON());
  }
}

module.exports = FinancialRecordUseCase;
