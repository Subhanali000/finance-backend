

const { IFinancialRecordRepository } = require('../../domain/repositories/IRepositories');
const FinancialRecord = require('../../domain/entities/FinancialRecord');
const FinancialRecordModel = require('../database/models/FinancialRecordModel');

class MongoFinancialRecordRepository extends IFinancialRecordRepository {
  async create(record) {
    const recordDoc = new FinancialRecordModel({
      userId: record.userId,
      amount: record.amount,
      type: record.type,
      category: record.category,
      date: record.date,
      description: record.description,
      notes: record.notes
    });

    const savedRecord = await recordDoc.save();
    return this.toDomain(savedRecord);
  }

  async findById(id) {
    const recordDoc = await FinancialRecordModel.findById(id);
    if (!recordDoc) return null;
    return this.toDomain(recordDoc);
  }

  async findAll(filters = {}) {
    const query = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.category) {
      query.category = { $regex: filters.category, $options: 'i' };
    }

    if (filters.date) {
      if (filters.date.$gte || filters.date.$lte) {
        query.date = filters.date;
      }
    }

    const sort = filters.sort || { date: -1 };
    const limit = filters.limit || 100;

    const recordDocs = await FinancialRecordModel.find(query)
      .sort(sort)
      .limit(limit);

    return recordDocs.map(doc => this.toDomain(doc));
  }

  async update(id, recordData) {
    const updateData = {
      amount: recordData.amount,
      type: recordData.type,
      category: recordData.category,
      date: recordData.date,
      description: recordData.description,
      notes: recordData.notes,
      updatedAt: new Date()
    };

    const recordDoc = await FinancialRecordModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!recordDoc) throw new Error('Financial record not found');
    return this.toDomain(recordDoc);
  }

  async delete(id) {
    const result = await FinancialRecordModel.findByIdAndDelete(id);
    if (!result) throw new Error('Financial record not found');
    return true;
  }

  async count(filters = {}) {
    const query = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    return await FinancialRecordModel.countDocuments(query);
  }

  async getAggregatedData(userId, filters = {}) {
    const matchStage = {};

    if (userId) {
      matchStage.userId = userId;
    }

    if (filters.startDate || filters.endDate) {
      matchStage.date = {};
      if (filters.startDate) {
        matchStage.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        matchStage.date.$lte = new Date(filters.endDate);
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          average: { $avg: '$amount' }
        }
      }
    ];

    const results = await FinancialRecordModel.aggregate(pipeline);

    const aggregated = {
      totalIncome: 0,
      totalExpenses: 0,
      count: 0,
      avgIncome: 0,
      avgExpense: 0
    };

    results.forEach(result => {
      if (result._id === 'income') {
        aggregated.totalIncome = result.total;
        aggregated.avgIncome = result.average;
      } else if (result._id === 'expense') {
        aggregated.totalExpenses = result.total;
        aggregated.avgExpense = result.average;
      }
      aggregated.count += result.count;
    });

    return aggregated;
  }

  async getCategoryTotals(userId, filters = {}) {
    const matchStage = {};

    if (userId) {
      matchStage.userId = userId;
    }

    if (filters.type) {
      matchStage.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
      matchStage.date = {};
      if (filters.startDate) {
        matchStage.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        matchStage.date.$lte = new Date(filters.endDate);
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: { type: '$type', category: '$category' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ];

    const results = await FinancialRecordModel.aggregate(pipeline);

    const categoryTotals = {
      income: [],
      expenses: []
    };

    results.forEach(result => {
      const item = {
        category: result._id.category,
        total: result.total,
        count: result.count
      };

      if (result._id.type === 'income') {
        categoryTotals.income.push(item);
      } else if (result._id.type === 'expense') {
        categoryTotals.expenses.push(item);
      }
    });

    return categoryTotals;
  }

  async getMonthlyTrends(userId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const matchStage = {
      date: { $gte: startDate }
    };

    if (userId) {
      matchStage.userId = userId;
    }

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ];

    const results = await FinancialRecordModel.aggregate(pipeline);

    // Format results by month
    const trendsByMonth = {};

    results.forEach(result => {
      const monthKey = `${result._id.year}-${String(result._id.month).padStart(2, '0')}`;
      
      if (!trendsByMonth[monthKey]) {
        trendsByMonth[monthKey] = {
          period: monthKey,
          income: 0,
          expenses: 0,
          net: 0
        };
      }

      if (result._id.type === 'income') {
        trendsByMonth[monthKey].income = result.total;
      } else if (result._id.type === 'expense') {
        trendsByMonth[monthKey].expenses = result.total;
      }

      trendsByMonth[monthKey].net = 
        trendsByMonth[monthKey].income - trendsByMonth[monthKey].expenses;
    });

    return Object.values(trendsByMonth);
  }

  // Convert MongoDB document to Domain Entity
  toDomain(recordDoc) {
    return new FinancialRecord({
      id: recordDoc._id.toString(),
      userId: recordDoc.userId.toString(),
      amount: recordDoc.amount,
      type: recordDoc.type,
      category: recordDoc.category,
      date: recordDoc.date,
      description: recordDoc.description,
      notes: recordDoc.notes,
      createdAt: recordDoc.createdAt,
      updatedAt: recordDoc.updatedAt
    });
  }
}

module.exports = MongoFinancialRecordRepository;
