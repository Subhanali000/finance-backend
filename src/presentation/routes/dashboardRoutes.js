

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const { authenticate, authorize } = require('../middleware/authMiddleware');



router.get('/summary', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getSummary(req, res, next)
);

router.get('/trends', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getTrends(req, res, next)
);

router.get('/health', authenticate, authorize('admin', 'analyst'), (req, res, next) => 
  dashboardController.getFinancialHealth(req, res, next)
);

module.exports = router;
