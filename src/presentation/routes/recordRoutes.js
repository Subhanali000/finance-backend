

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

router.get('/recent', authenticate, (req, res, next) => 
  recordController.getRecentActivity(req, res, next)
);


router.post('/', authenticate, authorize('admin'), createRecordValidation, (req, res, next) => 
  recordController.createRecord(req, res, next)
);


router.get('/', authenticate, recordFilterValidation, (req, res, next) => 
  recordController.getAllRecords(req, res, next)
);


router.get('/:id', authenticate, idValidation, (req, res, next) => 
  recordController.getRecordById(req, res, next)
);


router.put('/:id', authenticate, authorize('admin'), idValidation, updateRecordValidation, (req, res, next) => 
  recordController.updateRecord(req, res, next)
);

router.delete('/:id', authenticate, authorize('admin'), idValidation, (req, res, next) => 
  recordController.deleteRecord(req, res, next)
);

module.exports = router;
