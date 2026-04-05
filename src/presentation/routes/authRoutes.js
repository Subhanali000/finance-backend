

const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../middleware/validation');



router.post('/register', registerValidation, (req, res, next) => 
  authController.register(req, res, next)
);


router.post('/login', loginValidation, (req, res, next) => 
  authController.login(req, res, next)
);

router.get('/me', authenticate, (req, res, next) => 
  authController.getProfile(req, res, next)
);

module.exports = router;
