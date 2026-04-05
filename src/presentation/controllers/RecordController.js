

const FinancialRecordUseCase = require('../../application/use-cases/FinancialRecordUseCase');
const MongoFinancialRecordRepository = require('../../infrastructure/repositories/MongoFinancialRecordRepository');

class RecordController {
  constructor() {
    this.recordRepository = new MongoFinancialRecordRepository();
    this.recordUseCase = new FinancialRecordUseCase(this.recordRepository);
  }

  /**
   * @desc    Create new financial record
   * @route   POST /api/records
   * @access  Private (Admin only)
   */
  async createRecord(req, res, next) {
    try {
      const record = await this.recordUseCase.createRecord(req.body, req.user);

      res.status(201).json({
        success: true,
        message: 'Financial record created successfully',
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get all financial records with filters
   * @route   GET /api/records
   * @access  Private
   */
  async getAllRecords(req, res, next) {
    try {
      const filters = {
        type: req.query.type,
        category: req.query.category,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        userId: req.query.userId,
        limit: parseInt(req.query.limit) || 100
      };

      const records = await this.recordUseCase.getAllRecords(filters, req.user);

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get single financial record by ID
   * @route   GET /api/records/:id
   * @access  Private
   */
  async getRecordById(req, res, next) {
    try {
      const record = await this.recordUseCase.getRecordById(req.params.id, req.user);

      res.status(200).json({
        success: true,
        data: record
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Update financial record
   * @route   PUT /api/records/:id
   * @access  Private (Admin only)
   */
  async updateRecord(req, res, next) {
    try {
      const updatedRecord = await this.recordUseCase.updateRecord(
        req.params.id,
        req.body,
        req.user
      );

      res.status(200).json({
        success: true,
        message: 'Financial record updated successfully',
        data: updatedRecord
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Delete financial record
   * @route   DELETE /api/records/:id
   * @access  Private (Admin only)
   */
  async deleteRecord(req, res, next) {
    try {
      const result = await this.recordUseCase.deleteRecord(req.params.id, req.user);

      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get recent activity
   * @route   GET /api/records/recent
   * @access  Private
   */
  async getRecentActivity(req, res, next) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const records = await this.recordUseCase.getRecentActivity(limit, req.user);

      res.status(200).json({
        success: true,
        count: records.length,
        data: records
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RecordController();
