

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard analytics endpoints
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get dashboard summary (Admin, Analyst)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dashboard summary with totals and breakdowns
 *       403:
 *         description: Access denied
 */
router.get('/summary', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getSummary(req, res, next)
);

/**
 * @swagger
 * /api/dashboard/trends:
 *   get:
 *     summary: Get monthly trends (Admin, Analyst)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: months
 *         schema:
 *           type: integer
 *           default: 6
 *     responses:
 *       200:
 *         description: Monthly income/expense trends
 *       403:
 *         description: Access denied
 */
router.get('/trends', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getTrends(req, res, next)
);

/**
 * @swagger
 * /api/dashboard/categories:
 *   get:
 *     summary: Get category analysis (Admin, Analyst)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [all, income, expense]
 *           default: all
 *     responses:
 *       200:
 *         description: Category-wise breakdown
 *       403:
 *         description: Access denied
 */
router.get('/categories', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getCategoryAnalysis(req, res, next)
);

/**
 * @swagger
 * /api/dashboard/health:
 *   get:
 *     summary: Get financial health metrics (Admin, Analyst)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Financial health status and recommendations
 *       403:
 *         description: Access denied
 */
router.get('/health', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getFinancialHealth(req, res, next)
);

module.exports = router;
