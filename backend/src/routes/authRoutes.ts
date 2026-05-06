import express, { Router } from 'express';
import { body } from 'express-validator';
import { signup, login, getCurrentUser, getUsers } from '../controllers/authController.js';
import { adminOnly, authMiddleware } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router: Router = express.Router();

router.post(
  '/signup',
  [
    body('name').notEmpty().trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['admin', 'member']),
  ],
  handleValidationErrors,
  signup
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  handleValidationErrors,
  login
);

router.get('/me', authMiddleware, getCurrentUser);
router.get('/users', authMiddleware, adminOnly, getUsers);

export default router;
