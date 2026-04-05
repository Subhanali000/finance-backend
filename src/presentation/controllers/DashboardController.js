

const DashboardUseCase = require('../../application/use-cases/DashboardUseCase');
const MongoFinancialRecordRepository = require('../../infrastructure/repositories/MongoFinancialRecordRepository');

class DashboardController {
  constructor() {
    this.recordRepository = new MongoFinancialRecordRepository();
    this.dashboardUseCase = new DashboardUseCase(this.recordRepository);
  }

  /**
   * @desc    Get dashboard summary
   * @route   GET /api/dashboard/summary
   * @access  Private (Admin, Analyst)
   */
  async getSummary(req, res, next) {
    try {
      const filters = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        userId: req.query.userId
      };

      const summary = await this.dashboardUseCase.getDashboardSummary(filters, req.user);

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get monthly trends
   * @route   GET /api/dashboard/trends
   * @access  Private (Admin, Analyst)
   */
  async getTrends(req, res, next) {
    try {
      const months = parseInt(req.query.months) || 6;
      const trends = await this.dashboardUseCase.getMonthlyTrends(months, req.user);

      res.status(200).json({
        success: true,
        data: trends
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get category analysis
   * @route   GET /api/dashboard/categories
   * @access  Private (Admin, Analyst)
   */
  async getCategoryAnalysis(req, res, next) {
    try {
      const type = req.query.type || 'all';
      const analysis = await this.dashboardUseCase.getCategoryAnalysis(type, req.user);

      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @desc    Get financial health metrics
   * @route   GET /api/dashboard/health
   * @access  Private (Admin, Analyst)
   */
  async getFinancialHealth(req, res, next) {
    try {
      const health = await this.dashboardUseCase.getFinancialHealth(req.user);

      res.status(200).json({
        success: true,
        data: health
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
