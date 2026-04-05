

const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { updateUserValidation, idValidation } = require('../middleware/validation');

router.get('/stats', authenticate, authorize('admin'), (req, res, next) => 
  userController.getUserStats(req, res, next)
);


router.get('/', authenticate, authorize('admin'), (req, res, next) => 
  userController.getAllUsers(req, res, next)
);


router.get('/:id', authenticate, idValidation, (req, res, next) => 
  userController.getUserById(req, res, next)
);


router.put('/:id', authenticate, idValidation, updateUserValidation, (req, res, next) => 
  userController.updateUser(req, res, next)
);


router.delete('/:id', authenticate, authorize('admin'), idValidation, (req, res, next) => 
  userController.deleteUser(req, res, next)
);

module.exports = router;
