

const express = require('express');
const router = express.Router();
const recordController = require('../controllers/RecordController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  createRecordValidation,
  updateRecordValidation,
  idValidation,
  recordFilterValidation
} = require('../middleware/validation');

/**
 * @swagger
 * tags:
 *   name: Financial Records
 *   description: Financial record management endpoints
 */

/**
 * @swagger
 * /api/records/recent:
 *   get:
 *     summary: Get recent financial records
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent records retrieved successfully
 */
router.get('/recent', authenticate, (req, res, next) => 
  recordController.getRecentActivity(req, res, next)
);

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create new financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *                 example: Monthly salary payment
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Record created successfully
 *       403:
 *         description: Access denied
 */
router.post('/', authenticate, authorize('admin'), createRecordValidation, (req, res, next) => 
  recordController.createRecord(req, res, next)
);

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get all financial records with filters
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
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
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of financial records
 */
router.get('/', authenticate, recordFilterValidation, (req, res, next) => 
  recordController.getAllRecords(req, res, next)
);

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     summary: Get financial record by ID
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, idValidation, (req, res, next) => 
  recordController.getRecordById(req, res, next)
);

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     summary: Update financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       404:
 *         description: Record not found
 */
router.put('/:id', authenticate, authorize('admin'), idValidation, updateRecordValidation, (req, res, next) => 
  recordController.updateRecord(req, res, next)
);

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     summary: Delete financial record (Admin only)
 *     tags: [Financial Records]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, authorize('admin'), idValidation, (req, res, next) => 
  recordController.deleteRecord(req, res, next)
);

module.exports = router;
